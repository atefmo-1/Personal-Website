import { NextResponse } from "next/server";
import { validate, type ContactInput } from "@/lib/contact";
import { site } from "@/lib/site";

// Delivers contact-form messages by email through Resend (https://resend.com).
// Env vars (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY      required
//   CONTACT_TO_EMAIL    optional, defaults to the email in lib/site.ts
//   CONTACT_FROM_EMAIL  optional, defaults to Resend's shared test sender, which can only
//                       deliver to the email your Resend account was created with

// Best-effort throttle per IP. Serverless instances don't share memory, so this slows down
// a single noisy client rather than acting as a hard limit.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

function throttled(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const oneLine = (s: string) => s.replace(/[\r\n]+/g, " ").trim();

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "bad-request" }, { status: 400 });
  }

  // Honeypot: a hidden field real people never fill in. Bots get a fake success.
  if (typeof body.website === "string" && body.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ ok: false, error: "invalid", fields: errors }, { status: 422 });
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (throttled(ip)) {
    return NextResponse.json({ ok: false, error: "rate-limited" }, { status: 429 });
  }

  const key = process.env.RESEND_API_KEY;
  if (!key) {
    return NextResponse.json({ ok: false, error: "not-configured" }, { status: 503 });
  }

  const input = body as ContactInput;
  const name = oneLine(input.name);
  const company = oneLine(input.company ?? "");
  const lines = [`From: ${name} <${input.email.trim()}>`];
  if (company) lines.push(`Company: ${company}`);
  lines.push("", input.message.trim());
  const text = lines.join("\n");

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || "Portfolio contact form <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO_EMAIL || site.email],
      reply_to: input.email.trim(),
      subject: `New message from ${name}${company ? ` (${company})` : ""} via your website`,
      text,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ ok: false, error: "send-failed" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}

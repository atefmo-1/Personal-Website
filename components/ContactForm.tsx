"use client";

import { useState } from "react";
import { limits, validate, type ContactInput } from "@/lib/contact";
import { site } from "@/lib/site";

type Status = "idle" | "sending" | "sent" | "error";
type Errors = Partial<Record<keyof ContactInput, string>>;

const empty: ContactInput = { name: "", email: "", company: "", message: "" };

// Opens the visitor's own mail app with their message filled in, for when sending fails.
function mailtoFallback(v: ContactInput) {
  const subject = `Hello from ${v.name || "your website"}`;
  const body = `${v.message}\n\n${v.name}${v.company ? `, ${v.company}` : ""}`;
  return `mailto:${site.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function ContactForm() {
  const [values, setValues] = useState<ContactInput>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [honeypot, setHoneypot] = useState("");

  const set = <K extends keyof ContactInput>(key: K, value: ContactInput[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    if (Object.keys(found).length > 0) {
      const first = Object.keys(found)[0];
      (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus?.();
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, website: honeypot }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.ok) {
        setStatus("sent");
        return;
      }
      if (data.fields) {
        setErrors(data.fields);
        setStatus("idle");
        return;
      }
      setStatus("error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div role="status" className="rounded-2xl border border-line bg-bg p-8 sm:p-10">
        <p className="font-display text-3xl font-bold tracking-tight">Message received!</p>
        <p className="mt-3 text-lg text-muted">
          Thanks, {values.name.split(" ")[0]}. It&apos;s in my inbox now, and I&apos;ll write back to {values.email}{" "}
          soon.
        </p>
        <button
          type="button"
          onClick={() => {
            setValues(empty);
            setStatus("idle");
          }}
          className="mt-8 font-mono text-xs uppercase tracking-label text-muted underline underline-offset-4 hover:text-fg"
        >
          Send another
        </button>
      </div>
    );
  }

  const field =
    "mt-2 w-full rounded-xl border bg-bg px-4 py-3 text-base text-fg placeholder:text-muted/70 transition-colors focus:border-fg focus:outline-none";
  const border = (k: keyof ContactInput) => (errors[k] ? "border-fg" : "border-line");
  const errorText = (k: keyof ContactInput) =>
    errors[k] && (
      <p id={`${k}-error`} className="mt-2 text-sm text-fg">
        <span aria-hidden>! </span>
        {errors[k]}
      </p>
    );
  const describedBy = (k: keyof ContactInput) => (errors[k] ? `${k}-error` : undefined);

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-6">
      {/* Honeypot: hidden from people and screen readers; bots tend to fill it in */}
      <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden>
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} name="website" />
        </label>
      </div>


      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="label">
            Your name
          </label>
          <input
            id="name"
            name="name"
            autoComplete="name"
            maxLength={limits.name}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={!!errors.name}
            aria-describedby={describedBy("name")}
            className={`${field} ${border("name")}`}
            placeholder="Atef"
          />
          {errorText("name")}
        </div>
        <div>
          <label htmlFor="email" className="label">
            Your email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={limits.email}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={describedBy("email")}
            className={`${field} ${border("email")}`}
            placeholder="you@example.com"
          />
          {errorText("email")}
        </div>
      </div>

      <div>
        <label htmlFor="company" className="label">
          Company or school <span className="normal-case tracking-normal">(optional)</span>
        </label>
        <input
          id="company"
          name="company"
          autoComplete="organization"
          maxLength={limits.company}
          value={values.company}
          onChange={(e) => set("company", e.target.value)}
          aria-invalid={!!errors.company}
          aria-describedby={describedBy("company")}
          className={`${field} ${border("company")}`}
          placeholder="Company, school, or team"
        />
        {errorText("company")}
      </div>

      <div>
        <label htmlFor="message" className="label">
          Your message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          maxLength={limits.message}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
          aria-invalid={!!errors.message}
          aria-describedby={describedBy("message")}
          className={`${field} ${border("message")} resize-y`}
          placeholder="A bit about you and what you have in mind. Happy to find a time to chat."
        />
        {errorText("message")}
      </div>

      <div aria-live="polite">
        {status === "error" && (
          <p className="rounded-xl border border-line bg-bg p-4 text-[15px]">
            Well, that&apos;s embarrassing. My form tripped over its own feet.{" "}
            <a href={mailtoFallback(values)} className="underline underline-offset-4">
              Send it from your email app instead
            </a>{" "}
            and your message comes along for the ride.
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-mono text-xs uppercase tracking-label text-bg transition-colors hover:bg-fg/80 disabled:cursor-wait disabled:opacity-60"
      >
        {status === "sending" ? "Sending..." : "Send it"} <span aria-hidden>→</span>
      </button>
    </form>
  );
}

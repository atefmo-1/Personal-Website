"use client";

import { IconCheck, IconCopy } from "@tabler/icons-react";
import { useState } from "react";

// Email address as a mailto link, with a one-click copy button next to it.
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard blocked (rare): the mailto link still works.
    }
  }

  return (
    <div className="flex items-center gap-2 rounded-xl border border-line bg-surface py-2 pl-4 pr-2">
      <a href={`mailto:${email}`} className="min-w-0 flex-1 truncate text-[15px] hover:underline underline-offset-4">
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 font-mono text-[11px] uppercase tracking-label transition-colors hover:border-fg"
      >
        {copied ? <IconCheck size={14} aria-hidden /> : <IconCopy size={14} aria-hidden />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}

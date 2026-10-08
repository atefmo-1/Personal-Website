"use client";

import { useEffect, useState } from "react";

// Easter egg: type "draw" anywhere (outside a form field) to turn the site into a blueprint,
// white lines on blue with grid paper, and type it again to go back. Colors come from the
// [data-blueprint] tokens in globals.css, so every drawing follows along.
export function BlueprintMode() {
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    let typed = "";
    let timer: ReturnType<typeof setTimeout>;
    function onKey(e: KeyboardEvent) {
      const el = e.target as HTMLElement;
      if (e.metaKey || e.ctrlKey || e.altKey || el.closest("input, textarea, select, [contenteditable]")) return;
      if (e.key.length !== 1) return;
      typed = (typed + e.key.toLowerCase()).slice(-4);
      if (typed !== "draw") return;
      typed = "";
      const root = document.documentElement;
      const on = !("blueprint" in root.dataset);
      if (on) root.dataset.blueprint = "";
      else delete root.dataset.blueprint;
      setToast(on ? "Blueprint mode. Type “draw” again to leave." : "Back to ink.");
      clearTimeout(timer);
      timer = setTimeout(() => setToast(null), 2600);
    }
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div aria-live="polite" className="pointer-events-none fixed print:hidden inset-x-0 bottom-6 z-[60] flex justify-center px-4">
      {toast && <p className="rounded-full border border-line bg-surface px-4 py-2 font-mono text-[11px] uppercase tracking-label shadow-sm">{toast}</p>}
    </div>
  );
}

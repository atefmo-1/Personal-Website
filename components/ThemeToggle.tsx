"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function currentTheme(): Theme {
  const picked = document.documentElement.dataset.theme;
  if (picked === "light" || picked === "dark") return picked;
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

// Flips between light and dark and remembers the choice. Until someone clicks it,
// the site follows the OS setting.
export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => setTheme(currentTheme()), []);

  function toggle() {
    const next: Theme = currentTheme() === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
    setTheme(next);
  }

  const label = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={theme ? label : "Toggle color theme"}
      title={theme ? label : undefined}
      className="grid h-8 w-8 place-items-center rounded-full border border-line text-muted transition-colors hover:border-fg hover:text-fg"
    >
      {/* Half-filled circle: reads as "contrast" in either theme */}
      <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden>
        <circle cx="8" cy="8" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 1.5a6.5 6.5 0 0 1 0 13z" fill="currentColor" />
      </svg>
    </button>
  );
}

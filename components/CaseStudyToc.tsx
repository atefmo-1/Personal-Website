"use client";

import { useEffect, useState } from "react";

// "On this page" links for a case study, with the section being read highlighted.
export function CaseStudyToc({ items, start = 1 }: { items: { id: string; label: string }[]; start?: number }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const sections = items.map((i) => document.getElementById(i.id)).filter((el): el is HTMLElement => !!el);
    // A section counts as "being read" once it crosses the upper part of the screen.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) setActive(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, [items]);

  return (
    <nav aria-label="On this page" className="sticky top-28">
      <p className="label">On this page</p>
      <ol className="mt-4 space-y-1 border-l border-line">
        {items.map((item, i) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? "location" : undefined}
              className={`-ml-px flex gap-3 border-l py-1.5 pl-4 text-sm transition-colors hover:text-fg ${
                active === item.id ? "border-fg text-fg" : "border-transparent text-muted"
              }`}
            >
              <span className="font-mono text-xs tabular-nums opacity-60">{String(i + start).padStart(2, "0")}</span>
              {item.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

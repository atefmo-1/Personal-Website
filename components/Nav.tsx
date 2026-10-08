"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Monogram } from "./Monogram";
import { ThemeToggle } from "./ThemeToggle";
import { pages } from "@/lib/pages";
import { site } from "@/lib/site";

export function Nav() {
  const pathname = usePathname();
  return (
    <header className="fixed inset-x-0 top-0 z-50 print:hidden border-b border-line bg-bg/85 backdrop-blur-md">
      <nav aria-label="Primary" className="container-x flex h-14 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2.5 font-display text-[15px] font-bold tracking-tight" aria-label={`${site.name}, home`}>
          <Monogram className="h-[18px] w-auto" />
          <span className="hidden md:inline">{site.name}</span>
        </Link>
        <div className="flex items-center gap-3 md:gap-8">
          <ul className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.04em] md:gap-7 md:text-[11px] md:tracking-label">
            {pages.map((p) => {
              // Sub-pages (like a project page) keep their section highlighted.
              const active = pathname === p.href || (p.href !== "/" && pathname.startsWith(`${p.href}/`));
              return (
                <li key={p.href}>
                  <Link
                    href={p.href}
                    aria-current={active ? "page" : undefined}
                    className={`border-b py-1 transition-colors hover:text-fg ${
                      active ? "border-accent text-fg" : "border-transparent text-muted"
                    }`}
                  >
                    {"short" in p ? (
                      <>
                        <span className="md:hidden">{p.short}</span>
                        <span className="hidden md:inline">{p.title}</span>
                      </>
                    ) : (
                      p.title
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}

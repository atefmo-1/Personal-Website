import Link from "next/link";

type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  download?: boolean | string;
  external?: boolean;
};

export function Button({ href, children, variant = "primary", download, external }: Props) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-3 font-mono text-xs uppercase tracking-label transition-colors duration-200";
  const styles =
    variant === "primary"
      ? "bg-fg text-bg hover:bg-fg/80"
      : "border border-line text-fg hover:border-fg";
  const className = `${base} ${styles}`;
  // Internal pages use client-side navigation; files, mailto and external links stay plain anchors.
  const internal = href.startsWith("/") && !download && !/\.[a-z0-9]+$/i.test(href);
  return internal ? (
    <Link href={href} className={className}>
      {children}
    </Link>
  ) : (
    <a
      href={href}
      className={className}
      download={download}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}

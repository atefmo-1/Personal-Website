// Name link with a small ↗ that opens in a new tab. Used for companies and schools.
export function ExternalLink({
  href,
  small,
  children,
}: {
  href: string;
  small?: boolean;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`group inline-flex items-baseline gap-1.5 hover:underline ${
        small ? "font-medium underline-offset-4" : "underline-offset-[6px]"
      }`}
    >
      {children}
      <span
        className="text-xs text-muted transition-colors group-hover:text-fg"
        aria-hidden
      >
        ↗
      </span>
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

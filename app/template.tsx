// Re-mounts on every page change, so each new page gets the same entrance: an ink line draws
// across under the nav while the page fades in (.page-ink / .page-enter in globals.css).
// It only plays after a click; nothing reacts to hover.
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <>
      <span aria-hidden className="page-ink print:hidden" />
      <div className="page-enter">{children}</div>
    </>
  );
}

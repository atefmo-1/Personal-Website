// "AM" as one pen line, in the same hand as the signature: the A's right leg dips and rises
// straight into the M. Used in the nav, the footer and the browser tab icon (app/icon.svg).
export const MONOGRAM = "M2 22 L9 3 L15.5 20.5 Q16.6 23.4 18 20.5 V3 L24 14.5 L30 3 V22 M5.2 14 H12.8";

export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 25" className={className} aria-hidden>
      <path d={MONOGRAM} fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

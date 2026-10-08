// A one-line pen drawing of the route so far, drawn once when the page loads:
// a village house, a pigeon tower and a palm tree in Sharqia, a looping flight, Johannesburg's
// skyline and Hillbrow Tower, another flight, and the Old Well at UNC.
// Pure SVG + CSS (.ink-path in globals.css). Reduced-motion readers see it already drawn.
const START = 1.0; // seconds, after the hero's own entrance
const DURATION = 3.4;

const STOPS = [
  { label: "Sharqia, Egypt", at: 0.06, align: "left" },
  { label: "Johannesburg, South Africa", at: 0.53, align: "center" },
  { label: "Chapel Hill, USA", at: 0.9, align: "right" },
] as const;

const PATH = [
  // Sharqia: a flat-roofed house, a pigeon tower, a palm tree
  "M0 92 H18 V58 H30 V52 H36 V58 H58 V92",
  "H70 V70 L76 34 Q82 22 88 34 L94 70 V92",
  "H118 C122 70 126 50 128 28 C116 22 104 26 98 38 C108 28 118 26 128 28 C120 16 110 14 104 16 C114 18 122 22 128 28",
  "C136 16 148 16 154 22 C146 20 136 22 128 28 C140 24 152 30 158 42 C150 32 140 28 128 28 C130 52 132 72 134 92",
  // First flight, as a loop
  "H210 C262 92 262 34 302 34 C340 34 338 72 312 72 C284 72 296 24 360 24 C420 24 432 92 470 92",
  // Johannesburg: blocks, Hillbrow Tower, more blocks, a ridge
  "H480 V68 H494 V54 H506 V92 H516 V30 H510 V18 H534 V30 H528 V92 H542 V60 H558 V92 H572 V74 H584 V92 H590 Q630 64 670 92",
  // Second flight, across the Atlantic
  "H690 C730 92 726 30 768 30 C804 30 800 70 778 70 C756 70 764 28 818 28 C850 28 838 92 846 92",
  // Chapel Hill: the Old Well's steps, columns and dome
  "V87 H852 V82 H858 V54 H854 V50 C858 38 880 32 896 31 V25 H904 V31 C920 32 942 38 946 50 V54 H942 V82 H948 V87 H954 V92 H1000",
  // Details: the house's window, the tower's pigeon holes, the Old Well's beam and inner columns
  "M40 68 H50 V78 H40 Z M80 44 H84 M79 54 H85 M854 54 H946 M878 54 V82 M900 54 V82 M922 54 V82",
].join(" ");

const delay = (s: number) => ({ animationDelay: `${s}s` });

export function InkJourney({ className = "" }: { className?: string }) {
  return (
    <figure className={className} aria-label="A line drawing of the route from Sharqia, Egypt, to Johannesburg, South Africa, to Chapel Hill, USA">
      <svg viewBox="0 0 1000 96" className="h-auto w-full overflow-visible text-fg" aria-hidden>
        <path
          d={PATH}
          pathLength={1000}
          style={delay(START)}
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          // The drawing scales with the page, so the stroke is thicker in drawing units on small screens.
          className="ink-path [stroke-width:3.4] sm:[stroke-width:2] lg:[stroke-width:1.4]"
        />
      </svg>
      {/* Each label fades in as the pen reaches its stop. Phones show only the drawing. */}
      <div className="relative mt-2 hidden h-4 sm:block" aria-hidden>
        {STOPS.map((s) => (
          <span
            key={s.label}
            className="enter-fade label absolute whitespace-nowrap"
            style={{
              ...delay(START + s.at * DURATION * 0.85),
              left: `${s.at * 100}%`,
              transform: s.align === "left" ? "translateX(-15%)" : s.align === "right" ? "translateX(-85%)" : "translateX(-50%)",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

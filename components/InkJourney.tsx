// A pen drawing of the route so far, drawn once when the page loads. Sharqia: mud-brick houses,
// a pigeon tower, a minaret and dome, palm trees. A looping flight. Johannesburg: the Carlton
// Centre, Ponte City, Hillbrow Tower and the Nelson Mandela Bridge. Another flight. Chapel Hill:
// a dogwood, the Old Well and the Bell Tower. Strokes go left to right, so the pen travels the route.
// Pure SVG + CSS (.ink-path in globals.css). Reduced-motion readers see it already drawn.
const START = 1.0; // seconds, after the hero's own entrance
const DURATION = 3.4;

const STOPS = [
  { label: "Sharqia, Egypt", at: 0.1, align: "center" },
  { label: "Johannesburg, South Africa", at: 0.58, align: "center" },
  { label: "Chapel Hill, USA", at: 0.9, align: "right" },
] as const;

const PATH = [
  // Sharqia: two mud-brick houses, a pigeon tower, a minaret, a domed building
  "M0 112 H10 V80 H20 V74 H44 V80 H50 V112 H56 V92 H74 V112",
  "H80 V98 L84 50 Q90 34 96 50 L100 98 V112",
  "H108 V66 H111 V50 H113 V40 L115 28 L117 40 H119 V50 H121 V66 H124 V112",
  "H126 V90 H132 Q144 66 156 90 H162 V112 H174",
  "M14 88 h5 v5 h-5 Z M36 88 h5 v5 h-5 Z M26 112 V100 H32 V112 M62 100 h5 v5 h-5 Z",
  "M88 60 H92 M87 70 H93 M87 80 H93 M108 66 H124 M110 50 H122 M115 28 V22 M140 112 V102 Q144 95 148 102 V112",
  // Two palm trees
  "M174 112 C177 92 179 70 184 50 C172 44 160 48 154 60 M184 50 C174 38 162 36 154 40 M184 50 C186 38 194 32 204 34",
  "M184 50 C196 46 206 52 210 64 M184 50 C190 42 200 40 208 44",
  "M204 112 C206 98 207 86 210 74 C202 70 196 72 192 78 M210 74 C206 66 200 64 194 66 M210 74 C214 66 220 64 226 66 M210 74 C218 72 224 76 226 82",
  // First flight, as a loop
  "M174 112 H230 C282 112 282 54 322 54 C360 54 358 92 332 92 C304 92 316 44 380 44 C440 44 452 112 480 112",
  // Johannesburg: a block, the Carlton Centre, Ponte City, Hillbrow Tower, more blocks
  "H486 V74 H500 V112 H504 V36 H522 V112 H528 V56 C528 49 548 49 548 56 V112 H556 V32 H552 V22 H568 V32 H564 V112",
  "H570 V84 H582 V112 H588 V92 H596 V112",
  "M508 42 V108 M513 42 V108 M518 42 V108 M528 63 C528 69 548 69 548 63 M560 22 V8 M552 27 H568",
  // The Nelson Mandela Bridge: deck, pylon, fanned cables
  "M596 112 H700 M600 98 H684 M638 112 V60 L641 54 L644 60 V112",
  "M641 58 L606 98 M641 62 L618 98 M641 66 L628 98 M641 58 L676 98 M641 62 L664 98 M641 66 L654 98",
  // Second flight, across the Atlantic
  "M700 112 C732 112 730 54 762 54 C792 54 790 88 772 88 C752 88 762 58 790 60 C812 62 806 112 822 112",
  // Chapel Hill: a dogwood, the Old Well, the Bell Tower
  "H858 M836 112 V94 M836 101 L829 94 M836 99 L843 91",
  "M836 94 C822 96 816 84 824 78 C818 68 830 60 838 66 C846 58 860 66 854 76 C862 82 854 96 840 94",
  "M858 112 V107 H864 V102 H870 V66 H866 V62 C870 46 886 38 896 37 V31 H908 V37 C918 38 934 46 938 62 H934 V102 H940 V107 H946 V112",
  "M866 66 H938 M864 102 H940 M884 66 V102 M902 66 V102 M920 66 V102 M894 31 Q902 22 910 31 M902 25 V19",
  "M946 112 H954 V44 H972 V112 H1000 M950 44 H976 M954 44 L963 20 L972 44 M963 20 V12",
  "M958 52 V62 M963 52 V62 M968 52 V62 M954 70 H972 M959 84 a4 4 0 1 0 8 0 a4 4 0 1 0 -8 0",
].join(" ");

const delay = (s: number) => ({ animationDelay: `${s}s` });

export function InkJourney({ className = "" }: { className?: string }) {
  return (
    <figure className={className} aria-label="A line drawing of the route from Sharqia, Egypt, to Johannesburg, South Africa, to Chapel Hill, USA">
      <svg viewBox="0 0 1000 120" className="h-auto w-full overflow-visible text-fg" aria-hidden>
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
              transform: s.align === "right" ? "translateX(-85%)" : "translateX(-50%)",
            }}
          >
            {s.label}
          </span>
        ))}
      </div>
    </figure>
  );
}

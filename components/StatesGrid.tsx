import { about } from "@/lib/site";

// A tile-grid map of the US: every state (plus DC) is one square, placed roughly where it sits
// geographically. Visited ones are filled. Compact enough to sit beside the route map.
// [code, name, column, row] on a 12 x 8 grid (the standard layout used in news tile maps).
const TILES: [string, string, number, number][] = [
  ["AK", "Alaska", 0, 0], ["ME", "Maine", 11, 0],
  ["WI", "Wisconsin", 6, 1], ["VT", "Vermont", 10, 1], ["NH", "New Hampshire", 11, 1],
  ["WA", "Washington", 1, 2], ["ID", "Idaho", 2, 2], ["MT", "Montana", 3, 2], ["ND", "North Dakota", 4, 2],
  ["MN", "Minnesota", 5, 2], ["IL", "Illinois", 6, 2], ["MI", "Michigan", 7, 2], ["NY", "New York", 9, 2],
  ["MA", "Massachusetts", 10, 2],
  ["OR", "Oregon", 1, 3], ["NV", "Nevada", 2, 3], ["WY", "Wyoming", 3, 3], ["SD", "South Dakota", 4, 3],
  ["IA", "Iowa", 5, 3], ["IN", "Indiana", 6, 3], ["OH", "Ohio", 7, 3], ["PA", "Pennsylvania", 8, 3],
  ["NJ", "New Jersey", 9, 3], ["CT", "Connecticut", 10, 3], ["RI", "Rhode Island", 11, 3],
  ["CA", "California", 1, 4], ["UT", "Utah", 2, 4], ["CO", "Colorado", 3, 4], ["NE", "Nebraska", 4, 4],
  ["MO", "Missouri", 5, 4], ["KY", "Kentucky", 6, 4], ["WV", "West Virginia", 7, 4], ["VA", "Virginia", 8, 4],
  ["MD", "Maryland", 9, 4], ["DE", "Delaware", 10, 4],
  ["AZ", "Arizona", 2, 5], ["NM", "New Mexico", 3, 5], ["KS", "Kansas", 4, 5], ["AR", "Arkansas", 5, 5],
  ["TN", "Tennessee", 6, 5], ["NC", "North Carolina", 7, 5], ["SC", "South Carolina", 8, 5],
  ["DC", "District of Columbia", 9, 5],
  ["OK", "Oklahoma", 4, 6], ["LA", "Louisiana", 5, 6], ["MS", "Mississippi", 6, 6], ["AL", "Alabama", 7, 6],
  ["GA", "Georgia", 8, 6],
  ["HI", "Hawaii", 1, 7], ["TX", "Texas", 4, 7], ["FL", "Florida", 9, 7],
];

const visited = new Set(about.statesVisited);

export function StatesGrid() {
  const names = about.statesVisited.map((s) => (s === "District of Columbia" ? "Washington, DC" : s));
  return (
    <figure>
      <div className="grid w-full max-w-[300px] grid-cols-12 gap-[3px]" aria-hidden>
        {TILES.map(([code, name, col, row]) => {
          const on = visited.has(name);
          return (
            <div
              key={code}
              title={name}
              style={{ gridColumn: col + 1, gridRow: row + 1 }}
              className={`flex aspect-square items-center justify-center rounded-[3px] font-mono text-[8px] leading-none ${
                on ? "bg-fg font-semibold text-bg" : "bg-line text-muted"
              }`}
            >
              {code}
            </div>
          );
        })}
      </div>
      <figcaption className="sr-only">US places visited: {names.join(", ")}.</figcaption>
    </figure>
  );
}

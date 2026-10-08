// Sun and moon math for the live sky in the hero. Runs in the browser.

const RAD = Math.PI / 180;

// Days since J2000 (noon, Jan 1 2000, UTC).
const j2000 = (d: Date) => d.getTime() / 86400000 + 2440587.5 - 2451545.0;

// The sun's elevation above the horizon, in degrees (low-precision NOAA formulas, ~1°).
export function sunElevation(date: Date, lat: number, lon: number) {
  const n = j2000(date);
  const L = (280.46 + 0.9856474 * n) % 360;
  const g = ((357.528 + 0.9856003 * n) % 360) * RAD;
  const lambda = (L + 1.915 * Math.sin(g) + 0.02 * Math.sin(2 * g)) * RAD;
  const eps = (23.439 - 0.0000004 * n) * RAD;
  const ra = Math.atan2(Math.cos(eps) * Math.sin(lambda), Math.cos(lambda));
  const dec = Math.asin(Math.sin(eps) * Math.sin(lambda));
  const gmst = (((18.697374558 + 24.06570982441908 * n) % 24) + 24) % 24;
  const ha = (gmst * 15 + lon) * RAD - ra;
  return Math.asin(Math.sin(lat * RAD) * Math.sin(dec) + Math.cos(lat * RAD) * Math.cos(dec) * Math.cos(ha)) / RAD;
}

// The moon's age through its cycle (0 = new, 0.5 = full) and how much of it is lit.
export function moonPhase(date: Date) {
  const age = ((((j2000(date) + 2451545.0 - 2451550.1) / 29.530588853) % 1) + 1) % 1;
  return { age, lit: (1 - Math.cos(age * 2 * Math.PI)) / 2 };
}

export const CHAPEL_HILL: [number, number] = [35.91, -79.05];


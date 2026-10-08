// Sun and moon math for the live sky in the hero, plus a rough "where are you" from the
// visitor's time zone. Everything runs in the browser; nothing is sent anywhere.

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

// Great-circle distance in km.
export function distanceKm(a: [number, number], b: [number, number]) {
  const [la1, lo1, la2, lo2] = [a[0] * RAD, a[1] * RAD, b[0] * RAD, b[1] * RAD];
  const h = Math.sin((la2 - la1) / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin((lo2 - lo1) / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(h));
}

// Time zones are named after a city, so the zone gives a rough location without asking for one.
// Coordinates are each named city's.
const ZONES: Record<string, [number, number]> = {
  "America/New_York": [40.71, -74.01],
  "America/Detroit": [42.33, -83.05],
  "America/Toronto": [43.65, -79.38],
  "America/Chicago": [41.88, -87.63],
  "America/Denver": [39.74, -104.99],
  "America/Phoenix": [33.45, -112.07],
  "America/Los_Angeles": [34.05, -118.24],
  "America/Vancouver": [49.28, -123.12],
  "America/Anchorage": [61.22, -149.9],
  "Pacific/Honolulu": [21.31, -157.86],
  "America/Halifax": [44.65, -63.57],
  "America/Mexico_City": [19.43, -99.13],
  "America/Bogota": [4.71, -74.07],
  "America/Lima": [-12.05, -77.04],
  "America/Santiago": [-33.45, -70.67],
  "America/Sao_Paulo": [-23.55, -46.63],
  "America/Argentina/Buenos_Aires": [-34.6, -58.38],
  "America/Puerto_Rico": [18.47, -66.11],
  "Europe/London": [51.51, -0.13],
  "Europe/Dublin": [53.35, -6.26],
  "Europe/Lisbon": [38.72, -9.14],
  "Europe/Madrid": [40.42, -3.7],
  "Europe/Paris": [48.86, 2.35],
  "Europe/Brussels": [50.85, 4.35],
  "Europe/Amsterdam": [52.37, 4.9],
  "Europe/Berlin": [52.52, 13.4],
  "Europe/Zurich": [47.37, 8.54],
  "Europe/Rome": [41.9, 12.5],
  "Europe/Vienna": [48.21, 16.37],
  "Europe/Stockholm": [59.33, 18.07],
  "Europe/Oslo": [59.91, 10.75],
  "Europe/Copenhagen": [55.68, 12.57],
  "Europe/Warsaw": [52.23, 21.01],
  "Europe/Athens": [37.98, 23.73],
  "Europe/Istanbul": [41.01, 28.98],
  "Europe/Kyiv": [50.45, 30.52],
  "Europe/Kiev": [50.45, 30.52],
  "Europe/Moscow": [55.76, 37.62],
  "Africa/Cairo": [30.04, 31.24],
  "Africa/Johannesburg": [-26.2, 28.05],
  "Africa/Lagos": [6.52, 3.38],
  "Africa/Accra": [5.6, -0.19],
  "Africa/Nairobi": [-1.29, 36.82],
  "Africa/Addis_Ababa": [9.03, 38.74],
  "Africa/Kigali": [-1.95, 30.06],
  "Africa/Casablanca": [33.57, -7.59],
  "Africa/Algiers": [36.75, 3.06],
  "Africa/Tunis": [36.81, 10.18],
  "Africa/Khartoum": [15.5, 32.56],
  "Africa/Dakar": [14.72, -17.47],
  "Asia/Dubai": [25.2, 55.27],
  "Asia/Riyadh": [24.71, 46.68],
  "Asia/Qatar": [25.29, 51.53],
  "Asia/Amman": [31.95, 35.93],
  "Asia/Beirut": [33.89, 35.5],
  "Asia/Jerusalem": [31.77, 35.21],
  "Asia/Baghdad": [33.31, 44.36],
  "Asia/Tehran": [35.69, 51.39],
  "Asia/Karachi": [24.86, 67.0],
  "Asia/Kolkata": [22.57, 88.36],
  "Asia/Calcutta": [22.57, 88.36],
  "Asia/Dhaka": [23.81, 90.41],
  "Asia/Bangkok": [13.76, 100.5],
  "Asia/Jakarta": [-6.21, 106.85],
  "Asia/Singapore": [1.35, 103.82],
  "Asia/Kuala_Lumpur": [3.14, 101.69],
  "Asia/Manila": [14.6, 120.98],
  "Asia/Hong_Kong": [22.32, 114.17],
  "Asia/Shanghai": [31.23, 121.47],
  "Asia/Taipei": [25.03, 121.57],
  "Asia/Seoul": [37.57, 126.98],
  "Asia/Tokyo": [35.68, 139.69],
  "Australia/Perth": [-31.95, 115.86],
  "Australia/Adelaide": [-34.93, 138.6],
  "Australia/Brisbane": [-27.47, 153.03],
  "Australia/Sydney": [-33.87, 151.21],
  "Australia/Melbourne": [-37.81, 144.96],
  "Pacific/Auckland": [-36.85, 174.76],
};

export const CHAPEL_HILL: [number, number] = [35.91, -79.05];

// The visitor's time zone city and its coordinates, or null if the zone isn't in the list.
export function visitorPlace(): { city: string; at: [number, number] } | null {
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const at = ZONES[zone];
    if (!at) return null;
    return { city: zone.split("/").pop()!.replace(/_/g, " "), at };
  } catch {
    return null;
  }
}

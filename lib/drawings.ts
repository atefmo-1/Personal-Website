// One-line pen drawings for the page headers, in the same style as the home page's route
// drawing. Each sits on a 400 x 120 canvas with the ground at y = 110, and draws itself once
// (components/InkDrawing.tsx). Subpaths draw in order, so list the ground first.
// `viewBox` defaults to the header size, "0 0 400 120".
export type Drawing = { label: string; d: string; viewBox?: string };

const ground = "M0 110 H400";

export const drawings = {
  // Things I do when I'm not working: basketball, climbing, the gym, reading
  about: {
    label: "A line drawing of a basketball hoop and ball, a mountain with a flag on top, a dumbbell and an open book",
    d: [
      ground,
      "M52 110 V48 M30 48 V18 H74 V48 Z M43 48 V38 H61 V48 M40 50 H64 M42 50 L46 66 H58 L62 50 M48 50 L50 66 M56 50 L54 66",
      "M76 97 a12 12 0 1 0 24 0 a12 12 0 1 0 -24 0 M80 88 C86 93 86 101 80 106 M96 88 C90 93 90 101 96 106 M76 97 H100",
      "M110 110 L160 40 L178 64 L192 50 L240 110 M160 40 V22 L174 27 L160 32",
      "M248 92 h6 v12 h-6 Z M254 86 h10 v24 h-10 Z M264 98 H292 M292 86 h10 v24 h-10 Z M302 92 h6 v12 h-6 Z",
      "M322 104 C336 96 348 96 355 104 C362 96 374 96 388 104 V84 C374 76 362 76 355 84 C348 76 336 76 322 84 Z M355 84 V104",
    ].join(" "),
  },
  // A desk: sticky notes, a laptop with a rising chart, coffee, a plant
  work: {
    label: "A line drawing of a desk with sticky notes, a laptop showing a rising chart, a cup of coffee and a plant",
    d: [
      ground,
      "M20 108 V72 H52 V108 Z M27 82 H45 M27 90 H41 M58 108 V84 H82 V108 Z M64 94 H76",
      "M100 100 V40 H210 V100 M86 100 H224 L216 108 H94 Z M114 86 L136 72 L154 78 L176 56 L196 48 M189 46 L196 48 L193 55",
      "M246 108 V80 H274 V108 Z M274 86 C286 86 286 100 274 100 M254 72 C250 66 258 62 254 56 M266 72 C262 66 270 62 266 56",
      "M314 108 L318 90 H342 L346 108 Z M330 90 C320 76 312 72 308 58 C320 62 328 72 330 90 C332 72 338 60 352 54 C350 68 342 80 330 90 M330 90 V64",
    ].join(" "),
  },
  // An idea becomes an app that ships: a lightbulb, a phone with a checklist, a paper plane
  projects: {
    label: "A line drawing of a lightbulb, a phone showing a checklist, and a paper plane flying off on a looping trail",
    d: [
      ground,
      "M70 110 V102 M60 102 H80 M62 96 H78 M64 96 C64 86 52 80 52 66 C52 54 61 46 70 46 C79 46 88 54 88 66 C88 80 76 86 76 96",
      "M70 36 V28 M50 44 L44 38 M90 44 L96 38 M42 66 H34 M98 66 H106",
      "M152 110 V18 Q152 10 160 10 H204 Q212 10 212 18 V110 M174 18 H190",
      "M162 38 l4 4 l8 -8 M182 38 H202 M162 58 l4 4 l8 -8 M182 58 H202 M163 76 h9 v9 h-9 Z M182 80 H202",
      "M222 92 C262 92 268 44 296 52 C318 58 306 80 294 72 C282 64 300 40 340 36",
      "M340 36 L382 22 L362 52 L356 40 Z M356 40 L382 22",
    ].join(" "),
  },
  // A letter on its way: an envelope, a paper plane looping across, a mailbox with its flag up
  contact: {
    label: "A line drawing of an envelope, a paper plane looping through the air, and a mailbox with its flag up",
    d: [
      ground,
      "M20 108 V66 H92 V108 Z M20 66 L56 90 L92 66",
      "M100 84 C142 84 150 34 186 40 C214 46 206 72 190 68 C172 64 186 32 236 28",
      "M236 28 L278 16 L258 44 L252 32 Z M252 32 L278 16",
      "M332 110 V80 M306 80 V58 C306 47 315 40 326 40 H346 C357 40 364 47 364 58 V80 Z M326 40 C337 40 344 47 344 58 V80 M364 62 H372 V36 H384 V46 H372",
    ].join(" "),
  },
} satisfies Record<string, Drawing>;

// Project cards (components/Projects.tsx), keyed by project slug. Taller canvas, ground at y = 220.
export const projectDrawings: Record<string, Drawing> = {
  reloco: {
    label: "A line drawing of a suitcase and a passport, a paper plane looping overhead, and UNC's Old Well",
    viewBox: "0 0 300 240",
    d: [
      "M0 220 H300",
      "M30 220 V150 Q30 144 36 144 H100 Q106 144 106 150 V220 M54 144 V132 H82 V144 M50 160 V206 M86 160 V206",
      "M118 220 V156 H160 V220 M129 178 a10 10 0 1 0 20 0 a10 10 0 1 0 -20 0 M128 204 H150",
      "M190 220 V214 H196 V208 H202 V170 H198 V164 C204 151 226 143 238 142 V134 H248 V142 C260 143 282 151 288 164 H284 V208 H290 V214 H296 V220",
      "M198 170 H288 M202 208 H284 M224 170 V208 M243 170 V208 M262 170 V208",
      "M18 78 C58 78 78 38 108 48 C128 56 118 78 106 72 C94 66 108 38 158 42",
      "M158 42 L198 30 L180 58 L174 46 Z M174 46 L198 30",
    ].join(" "),
  },
};

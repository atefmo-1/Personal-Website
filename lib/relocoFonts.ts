import { DM_Sans, Instrument_Serif } from "next/font/google";

// Reloco's own typefaces (same as the product's layout.tsx), used where the page shows its brand.
export const relocoDisplay = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], display: "swap" });
export const relocoSans = DM_Sans({ subsets: ["latin"], display: "swap" });

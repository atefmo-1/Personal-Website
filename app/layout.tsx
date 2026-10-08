import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import { BlueprintMode } from "@/components/BlueprintMode";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";
import "./globals.css";

const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  variable: "--font-display",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });
// An italic serif for a word or two of emphasis in headlines and big text
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-serif" });
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  // Makes the share image URL absolute in production
  metadataBase: new URL("https://atefmohamed.com"),
  title: {
    default: site.name,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
  },
  // The preview image comes from app/opengraph-image.tsx
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F6F5F2" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
};

// Runs before first paint: applies a theme the visitor picked earlier, so there's no flash.
// With no saved choice, the CSS follows the OS setting.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${display.variable} ${body.variable} ${serif.variable} ${mono.variable}`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-screen flex-col bg-bg font-sans text-fg">
        <MotionProvider>
          <Nav />
          <main className="flex-1">{children}</main>
          <Footer />
          <BlueprintMode />
        </MotionProvider>
      </body>
    </html>
  );
}

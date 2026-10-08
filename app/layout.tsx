import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import { BlueprintMode } from "@/components/BlueprintMode";
import { Footer } from "@/components/Footer";
import { MotionProvider } from "@/components/MotionProvider";
import { Nav } from "@/components/Nav";
import { site } from "@/lib/site";
import "./globals.css";

// Each font names a fallback stack, so text never drops to the browser's default serif while a
// font loads (or if one fails to).
const display = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
  variable: "--font-display",
});
const body = Inter({
  subsets: ["latin"],
  display: "swap",
  fallback: ["system-ui", "Helvetica Neue", "Arial", "sans-serif"],
  variable: "--font-body",
});
const mono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
  fallback: ["ui-monospace", "Menlo", "monospace"],
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
      className={`${display.variable} ${body.variable} ${mono.variable}`}
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

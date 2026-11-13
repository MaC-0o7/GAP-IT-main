import type { Metadata, Viewport } from "next";
import {
  Noto_Sans_Devanagari,
  Noto_Sans_Tamil,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import Script from "next/script";
import { AnimatedBackgroundLoader } from "@/components/AnimatedBackgroundLoader";
import { SiteScene } from "@/components/home/site-scene";
import { LanguageProvider } from "@/lib/i18n/provider";
import "./globals.css";

const notoTamil = Noto_Sans_Tamil({
  display: "swap",
  subsets: ["latin", "tamil"],
  variable: "--font-noto-tamil",
  weight: ["400", "500", "600", "700"],
});

const notoDevanagari = Noto_Sans_Devanagari({
  display: "swap",
  subsets: ["devanagari", "latin"],
  variable: "--font-noto-devanagari",
  weight: ["400", "500", "600", "700"],
});

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  weight: ["400", "500", "600", "700"],
});

const sora = Sora({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-sora",
  weight: ["400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#F8FAFC",
};

export const metadata: Metadata = {
  title: "GAP-IT | Quality Operations",
  description: "Quality operations workspace for measurement and process control.",
};

const themeInitScript = `
  try {
    const theme = localStorage.getItem("gap-it-theme") === "dark" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
  } catch (error) {
    console.warn("Unable to read the saved theme from browser storage.", error);
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
  <html className={`${notoTamil.variable} ${notoDevanagari.variable} ${spaceGrotesk.variable} ${sora.variable}`} data-scroll-behavior="smooth" lang="en" suppressHydrationWarning>
    <head>
      <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </head>
    <body>
      <LanguageProvider>
        <AnimatedBackgroundLoader />
        <SiteScene />
        {children}
      </LanguageProvider>
    </body>
  </html>
);
}

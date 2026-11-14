import type { Metadata, Viewport } from "next";
import {
  Noto_Sans_Kannada,
  Noto_Sans_Malayalam,
  Noto_Sans_Devanagari,
  Noto_Sans_Tamil,
  Noto_Sans_Telugu,
  Sora,
  Space_Grotesk,
} from "next/font/google";
import { cookies } from "next/headers";
import Script from "next/script";
import { SiteBackgrounds } from "@/components/SiteBackgrounds";
import { LanguageProvider } from "@/lib/i18n/provider";
import { isLanguage } from "@/lib/i18n/types";
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

const notoTelugu = Noto_Sans_Telugu({
  display: "swap",
  subsets: ["telugu", "latin"],
  variable: "--font-noto-telugu",
  weight: ["400", "500", "600", "700"],
});

const notoKannada = Noto_Sans_Kannada({
  display: "swap",
  subsets: ["kannada", "latin"],
  variable: "--font-noto-kannada",
  weight: ["400", "500", "600", "700"],
});

const notoMalayalam = Noto_Sans_Malayalam({
  display: "swap",
  subsets: ["malayalam", "latin"],
  variable: "--font-noto-malayalam",
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
    const preference = localStorage.getItem("gap-it-theme");
    const dark = preference === "dark" || (
      preference === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches
    );
    document.documentElement.classList.toggle("dark", dark);
    document.documentElement.style.colorScheme = dark ? "dark" : "light";
  } catch (error) {
    console.warn("Unable to read the saved theme from browser storage.", error);
    document.documentElement.classList.remove("dark");
    document.documentElement.style.colorScheme = "light";
  }
`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const savedLanguage = (await cookies()).get("lang")?.value ?? null;
  const initialLanguage = isLanguage(savedLanguage) ? savedLanguage : null;

  return (
  <html className={`${notoTamil.variable} ${notoDevanagari.variable} ${notoTelugu.variable} ${notoKannada.variable} ${notoMalayalam.variable} ${spaceGrotesk.variable} ${sora.variable}`} data-scroll-behavior="smooth" lang={initialLanguage ?? "en"} suppressHydrationWarning>
    <head>
      <Script id="theme-init" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeInitScript }} />
    </head>
    <body>
      <LanguageProvider initialLanguage={initialLanguage}>
        <SiteBackgrounds />
        {children}
      </LanguageProvider>
    </body>
  </html>
);
}

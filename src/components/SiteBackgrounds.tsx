"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { HomeGridScan } from "@/components/home/home-grid-scan";

const LightGridBackground = dynamic(
  () => import("@/components/LightGridBackground"),
  { ssr: false },
);

export function SiteBackgrounds() {
  const pathname = usePathname();
  const [dark, setDark] = useState<boolean | null>(null);

  useEffect(() => {
    const updateTheme = () => {
      setDark(document.documentElement.classList.contains("dark"));
    };
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("gap-it-theme-change", updateTheme);
    window.addEventListener("storage", updateTheme);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    systemTheme.addEventListener("change", updateTheme);
    updateTheme();

    return () => {
      observer.disconnect();
      window.removeEventListener("gap-it-theme-change", updateTheme);
      window.removeEventListener("storage", updateTheme);
      systemTheme.removeEventListener("change", updateTheme);
    };
  }, []);

  const isPublicPage = pathname === "/" || pathname === "/login";
  const lightActive = dark === false && isPublicPage;
  const darkBackgroundActive = dark === true && isPublicPage;

  return (
    <div aria-hidden="true" className="site-backgrounds">
      <div className={`site-background-layer site-background-light ${lightActive ? "is-active" : ""}`}>
        <LightGridBackground active={lightActive} />
      </div>
    <div className={`site-background-layer site-background-dark ${darkBackgroundActive ? "is-active" : ""}`}>
      <HomeGridScan active={darkBackgroundActive} observeHero={pathname === "/"} />
      </div>
    </div>
  );
}

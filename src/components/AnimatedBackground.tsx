"use client";

import { useEffect, useState } from "react";
import GridScan from "@/components/GridScan";

type Theme = "light" | "dark";

export default function AnimatedBackground() {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState(1);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateDpr = () => {
      setIsMobile(mobileQuery.matches);
      setDpr(Math.min(window.devicePixelRatio || 1, mobileQuery.matches ? 1 : 1.35));
    };

    updateTheme();
    updateDpr();
    setMounted(true);
    window.addEventListener("gap-it-theme-change", updateTheme);
    window.addEventListener("storage", updateTheme);
    mobileQuery.addEventListener("change", updateDpr);
    return () => {
      window.removeEventListener("gap-it-theme-change", updateTheme);
      window.removeEventListener("storage", updateTheme);
      mobileQuery.removeEventListener("change", updateDpr);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-screen h-[100dvh] w-screen overflow-hidden bg-[var(--bg)] transition-colors duration-500"
    >
      <GridScan
        className="absolute inset-0"
        linesColor="#10b981"
        scanColor={theme === "dark" ? "#ffffff" : "#047857"}
        cells={isMobile ? 6 : 8}
        depth={isMobile ? 2 : 3}
        scanDuration={2.4}
        scanDelay={1.6}
        clickEffect="ping"
        autoScan
        dpr={dpr}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-black/15" />
    </div>
  );
}

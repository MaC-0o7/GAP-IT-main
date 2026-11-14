"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import { useLowPower } from "@/hooks/use-low-power";

const GridScan = dynamic(() => import("@/components/reactbits/GridScan/GridScan"), { ssr: false });

type Theme = "light" | "dark";

export default function AnimatedBackground() {
  const pathname = usePathname();
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);
  const [dpr, setDpr] = useState<number | undefined>(undefined);
  const [isMobile, setIsMobile] = useState(false);
  const lowPower = useLowPower();

  useEffect(() => {
    const updateTheme = () => {
      setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
    };
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateDpr = () => {
      setIsMobile(mobileQuery.matches);
      setDpr(mobileQuery.matches ? 1 : undefined);
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

  if (pathname !== "/workspace" || !mounted) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 h-[100svh] h-[100dvh] w-screen overflow-hidden bg-[var(--bg)] transition-colors duration-[var(--dur-base)]"
    >
      <GridScan
        className="absolute inset-0"
        linesColor="#10b981"
        scanColor={theme === "dark" ? "#ffffff" : "#047857"}
        cells={lowPower || isMobile ? 6 : 8}
        depth={lowPower || isMobile ? 2 : 3}
        scanDuration={2.4}
        scanDelay={1.6}
        clickEffect="ping"
        autoScan
        dpr={lowPower || isMobile ? 1 : dpr}
        points={!lowPower}
        glow={lowPower ? 0 : undefined}
        reflection={lowPower ? 0 : undefined}
        shading={lowPower ? 0.3 : undefined}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-black/15" />
    </div>
  );
}

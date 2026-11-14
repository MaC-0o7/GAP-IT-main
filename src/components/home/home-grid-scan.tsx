"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { useLowPower } from "@/hooks/use-low-power";

const GridScan = dynamic(
  () => import("@/components/reactbits/GridScan/GridScan"),
  { ssr: false },
);

type ActiveTheme = "light" | "dark";

function getActiveTheme(): ActiveTheme {
  const root = document.documentElement;
  let savedTheme: string | null = null;
  try {
    savedTheme = window.localStorage.getItem("gap-it-theme");
  } catch (error) {
    console.warn("Unable to read the saved theme for the Home hero.", error);
  }
  if (savedTheme === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  return root.classList.contains("dark") ? "dark" : "light";
}

export function HomeGridScan() {
  const [theme, setTheme] = useState<ActiveTheme | null>(null);
  const [dpr, setDpr] = useState<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const lowPower = useLowPower();

  useEffect(() => {
    const updateTheme = () => setTheme(getActiveTheme());
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("gap-it-theme-change", updateTheme);
    const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
    const updateSystemTheme = () => {
      try {
        if (window.localStorage.getItem("gap-it-theme") === "system") updateTheme();
      } catch (error) {
        console.warn("Unable to read the saved theme for the Home hero.", error);
      }
    };
    colorScheme.addEventListener("change", updateSystemTheme);
    updateTheme();
    return () => {
      observer.disconnect();
      window.removeEventListener("gap-it-theme-change", updateTheme);
      colorScheme.removeEventListener("change", updateSystemTheme);
    };
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const updateDpr = () => setDpr(media.matches ? 1 : undefined);
    updateDpr();
    media.addEventListener("change", updateDpr);
    window.addEventListener("resize", updateDpr, { passive: true });
    return () => {
      media.removeEventListener("change", updateDpr);
      window.removeEventListener("resize", updateDpr);
    };
  }, []);

  useEffect(() => {
    let timeout = 0;
    let idleId: number | undefined;
    const mount = () => {
      window.clearTimeout(timeout);
      setReady(true);
    };
    const idleWindow: {
      requestIdleCallback?: (callback: IdleRequestCallback) => number;
      cancelIdleCallback?: (handle: number) => void;
    } = window;
    if (idleWindow.requestIdleCallback) {
      idleId = idleWindow.requestIdleCallback(mount);
      timeout = window.setTimeout(mount, 1200);
    } else {
      timeout = window.setTimeout(mount, 0);
    }
    return () => {
      window.clearTimeout(timeout);
      if (idleId !== undefined) idleWindow.cancelIdleCallback?.(idleId);
    };
  }, []);

  const dark = theme === "dark";
  const surface = dark
    ? "radial-gradient(ellipse at 50% 40%, #1A1333 0%, #0F081F 55%, #05020C 100%)"
    : "radial-gradient(ellipse at 50% 40%, #0F766E 0%, #134E4A 100%)";

  return (
    <div aria-hidden="true" className="home-grid-scan" style={theme ? { background: surface } : undefined}>
      {ready && !lowPower && (
        <GridScan
          cells={8}
          clickEffect="ping"
          depth={3}
          dpr={dpr}
          linesColor={dark ? "#7c3aed" : "#ffffff"}
          scanColor={dark ? "#ffffff" : "#0fd795"}
          scanDelay={1.6}
          scanDuration={2.4}
        />
      )}
      {ready && lowPower && (
        <GridScan
          cells={8}
          clickEffect="ping"
          depth={3}
          dpr={1}
          glow={0}
          linesColor={dark ? "#7c3aed" : "#ffffff"}
          points={false}
          reflection={0}
          scanColor={dark ? "#ffffff" : "#0fd795"}
          scanDelay={1.6}
          scanDuration={2.4}
          shading={0.3}
        />
      )}
    </div>
  );
}

"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GridScan = dynamic(
  () => import("@/components/reactbits/GridScan/GridScan"),
  { ssr: false },
);

type ActiveTheme = "light" | "dark";

function getActiveTheme(): ActiveTheme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

export function HomeGridScan({ active = true }: { active?: boolean }) {
  const [theme, setTheme] = useState<ActiveTheme | null>(null);
  const [dpr, setDpr] = useState<number | undefined>(undefined);
  const [ready, setReady] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const updateTheme = () => setTheme(getActiveTheme());
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("gap-it-theme-change", updateTheme);
    updateTheme();
    return () => {
      observer.disconnect();
      window.removeEventListener("gap-it-theme-change", updateTheme);
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
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(media.matches);
    updateMotionPreference();
    media.addEventListener("change", updateMotionPreference);
    return () => media.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    const hero = document.getElementById("home-hero");
    if (!hero) return;

    const observer = new IntersectionObserver(([entry]) => {
      setHeroVisible(entry.isIntersecting);
    });
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const updateVisibility = () => setTabVisible(!document.hidden);
    updateVisibility();
    document.addEventListener("visibilitychange", updateVisibility);
    return () => document.removeEventListener("visibilitychange", updateVisibility);
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
    <div
      aria-hidden="true"
      className="home-grid-scan"
      style={theme ? { background: surface } : undefined}
    >
      {ready && !reducedMotion && (
        <GridScan
          cells={8}
          clickEffect="none"
          depth={3}
          dpr={dpr}
          interactive={false}
          lightMode={!dark}
          linesColor={dark ? "#7c3aed" : "#ffffff"}
          paused={!active || !heroVisible || !tabVisible}
          scanColor={dark ? "#ffffff" : "#0fd795"}
          scanDelay={1.6}
          scanDuration={2.4}
        />
      )}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import ShapeWaves from "@/components/reactbits/ShapeWaves/ShapeWaves";

export function SiteScene() {
  const pathname = usePathname();
  const [reducedMotion, setReducedMotion] = useState(false);
  const [sceneColors, setSceneColors] = useState<{
    color: string;
    hoverColor: string;
    backgroundColor: string;
    fontFamily: string;
  } | null>(null);

  useEffect(() => {
    const updateThemeColors = () => {
      const styles = getComputedStyle(document.documentElement);
      const bodyStyles = getComputedStyle(document.body);
      setSceneColors({
        color: styles.getPropertyValue("--scene-color").trim(),
        hoverColor: styles.getPropertyValue("--scene-hover-color").trim(),
        backgroundColor: styles.getPropertyValue("--scene-background").trim(),
        fontFamily: bodyStyles.fontFamily,
      });
    };
    updateThemeColors();
    window.addEventListener("gap-it-theme-change", updateThemeColors);

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(motionQuery.matches);
    updateMotion();
    motionQuery.addEventListener("change", updateMotion);

    return () => {
      window.removeEventListener("gap-it-theme-change", updateThemeColors);
      motionQuery.removeEventListener("change", updateMotion);
    };
  }, []);

  if (pathname !== "/login" || !sceneColors) return null;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 site-scene"
    >
      <ShapeWaves
        text="GAP-IT"
        fontFamily={sceneColors.fontFamily}
        fontWeight={500}
        textSize={0.33}
        shapes="mixed"
        cellSize={10}
        dotSize={0.76}
        color={sceneColors.color}
        hoverColor={sceneColors.hoverColor}
        backgroundColor={sceneColors.backgroundColor}
        speed={1}
        scale={1}
        contrast={1}
        brightness={0.5}
        flow={0.3}
        direction={0}
        fade={0.25}
        interactive
        splashRadius={40}
        splashStrength={0.4}
        glow={1.1}
        intro
        introDuration={1.6}
        paused={reducedMotion}
      />
    </div>
  );
}

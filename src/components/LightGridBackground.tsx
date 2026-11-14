"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

const GridScan = dynamic(
  () => import("@/components/reactbits/GridScan/GridScan"),
  { ssr: false },
);

export default function LightGridBackground({ active }: { active: boolean }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mobileQuery = window.matchMedia("(max-width: 767px)");
    const updateMobile = () => setIsMobile(mobileQuery.matches);
    updateMobile();
    mobileQuery.addEventListener("change", updateMobile);
    return () => mobileQuery.removeEventListener("change", updateMobile);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 -z-10 h-screen w-screen overflow-hidden bg-white"
      style={{ height: "100lvh", pointerEvents: "none" }}
    >
      <GridScan
        autoScan
        cells={isMobile ? 6 : 8}
        clickEffect="ping"
        depth={isMobile ? 2.5 : 3}
        interactive
        lightMode
        linesColor="#10b981"
        paused={!active}
        scanColor="#10b981"
        scanDelay={1.6}
        scanDuration={2.4}
        style={{ width: "100%", height: "100%" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-white/10" />
    </div>
  );
}

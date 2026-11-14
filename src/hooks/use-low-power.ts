"use client";

import { useEffect, useState } from "react";

type NavigatorCapabilities = Navigator & {
  connection?: EventTarget & { saveData?: boolean };
  deviceMemory?: number;
};

export function useLowPower() {
  const [lowPower, setLowPower] = useState(false);

  useEffect(() => {
    const navigatorWithCapabilities = window.navigator as NavigatorCapabilities;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setLowPower(
        reducedMotion.matches ||
          navigatorWithCapabilities.connection?.saveData === true ||
          (navigatorWithCapabilities.deviceMemory ?? Number.POSITIVE_INFINITY) <= 4 ||
          (navigatorWithCapabilities.hardwareConcurrency ?? Number.POSITIVE_INFINITY) <= 4,
      );
    };

    update();
    reducedMotion.addEventListener("change", update);
    navigatorWithCapabilities.connection?.addEventListener?.("change", update);
    return () => {
      reducedMotion.removeEventListener("change", update);
      navigatorWithCapabilities.connection?.removeEventListener?.("change", update);
    };
  }, []);

  return lowPower;
}

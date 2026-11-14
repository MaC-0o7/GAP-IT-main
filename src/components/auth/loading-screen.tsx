"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import type { LatticeStatus } from "@/components/reactbits/LatticeLoader/LatticeLoader";
import { useT } from "@/lib/i18n/provider";

const LatticeLoader = dynamic(() => import("@/components/reactbits/LatticeLoader/LatticeLoader"), { ssr: false });

export function LoadingScreen({
  status,
  onTimeout,
  onRetry,
}: {
  status?: LatticeStatus;
  onTimeout?: () => void;
  onRetry?: () => void;
}) {
  const { t } = useT();
  const [internalStatus, setInternalStatus] = useState<LatticeStatus>("loading");
  const [displayStatus, setDisplayStatus] = useState<LatticeStatus>("loading");
  const [visible, setVisible] = useState(false);
  const visibleSince = useRef<number | null>(null);
  const timeoutHandler = useRef(onTimeout);
  timeoutHandler.current = onTimeout;
  const currentStatus = status ?? internalStatus;

  useEffect(() => {
    if (currentStatus === "loading") {
      setVisible(false);
      visibleSince.current = null;
      const reveal = window.setTimeout(() => {
        visibleSince.current = performance.now();
        setDisplayStatus("loading");
        setVisible(true);
      }, 250);
      const timeout = window.setTimeout(() => {
        setInternalStatus("error");
        timeoutHandler.current?.();
      }, 8000);
      return () => {
        window.clearTimeout(reveal);
        window.clearTimeout(timeout);
      };
    }

    if (currentStatus === "done") {
      const shownAt = visibleSince.current;
      if (shownAt === null) {
        setVisible(false);
        return undefined;
      }
      const waitForMinimum = shownAt === null
        ? 0
        : Math.max(0, 400 - (performance.now() - shownAt));
      let hide = 0;
      const reveal = window.setTimeout(() => {
        setDisplayStatus("done");
        setVisible(true);
        hide = window.setTimeout(() => setVisible(false), 300);
      }, waitForMinimum);
      return () => {
        window.clearTimeout(reveal);
        window.clearTimeout(hide);
      };
    }

    setDisplayStatus("error");
    setVisible(true);
    return undefined;
  }, [currentStatus]);

  const retry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

  if (!visible) return null;

  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--bg)] px-5 py-12 text-[var(--text)]">
      <section aria-live="polite" className="flex max-w-full flex-col items-center gap-5 text-center">
        <LatticeLoader
          color="var(--text)"
          doneColor="#22c55e"
          doneLabel={t("auth.loadingDoneLabel")}
          errorColor="#ef4444"
          errorLabel={t("auth.loadingErrorLabel")}
          fontSize={16}
          gap={2}
          grid={3}
          glow={false}
          glowColor=""
          idleOpacity={0.18}
          label={t("auth.loadingLabel")}
          pattern="snake"
          shape="round"
          showTimer
          status={displayStatus}
          step={110}
          cellSize={6}
        />
        {displayStatus === "error" && (
          <>
            <p className="max-w-sm text-sm">{t("auth.loadingErrorMessage")}</p>
            <button
              className="min-h-11 rounded-xl bg-[var(--primary)] px-5 font-bold text-[var(--on-primary)]"
              onClick={retry}
              type="button"
            >
              {t("auth.tryAgain")}
            </button>
          </>
        )}
      </section>
    </main>
  );
}

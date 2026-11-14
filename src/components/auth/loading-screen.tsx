"use client";

import { useEffect, useRef, useState } from "react";
import LatticeLoader, { type LatticeStatus } from "@/components/reactbits/LatticeLoader/LatticeLoader";
import { useT } from "@/lib/i18n/provider";

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
  const timeoutHandler = useRef(onTimeout);
  timeoutHandler.current = onTimeout;
  const currentStatus = status ?? internalStatus;

  useEffect(() => {
    if (currentStatus !== "loading") return;
    const timeout = window.setTimeout(() => {
      setInternalStatus("error");
      timeoutHandler.current?.();
    }, 8000);
    return () => window.clearTimeout(timeout);
  }, [currentStatus]);

  const retry = () => {
    if (onRetry) onRetry();
    else window.location.reload();
  };

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
          status={currentStatus}
          step={110}
          cellSize={6}
        />
        {currentStatus === "error" && (
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

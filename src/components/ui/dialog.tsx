"use client";

import { useEffect, useRef } from "react";
import { useT } from "@/lib/i18n/provider";

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Dialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: DialogProps) {
  const { t } = useT();
  const cancelButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    cancelButton.current?.focus();
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onCancel, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[var(--z-dialog)] grid place-items-center bg-slate-950/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <section
        aria-modal="true"
        className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--text)] shadow-2xl"
        role="dialog"
        aria-labelledby="dialog-title"
        aria-describedby={description ? "dialog-description" : undefined}
      >
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white" id="dialog-title">
          {title}
        </h2>
        {description && (
          <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300" id="dialog-description">
            {description}
          </p>
        )}
        <div className="mt-5 flex flex-wrap justify-end gap-2">
          <button
            className="min-h-10 rounded-xl border border-[var(--border)] px-4 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-elevated)]"
            onClick={onCancel}
            ref={cancelButton}
            type="button"
          >
            {cancelLabel ?? t("dialog.cancel")}
          </button>
          <button
            className="min-h-10 rounded-xl bg-[var(--primary)] px-4 text-sm font-semibold text-[var(--on-primary)] hover:brightness-110"
            onClick={onConfirm}
            type="button"
          >
            {confirmLabel ?? t("dialog.confirm")}
          </button>
        </div>
      </section>
    </div>
  );
}

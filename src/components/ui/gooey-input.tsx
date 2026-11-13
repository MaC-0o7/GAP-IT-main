"use client";

import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type GooeyInputProps = ComponentPropsWithoutRef<"input"> & {
  startAdornment?: ReactNode;
  endAdornment?: ReactNode;
  wrapperClassName?: string;
};

export const GooeyInput = forwardRef<HTMLInputElement, GooeyInputProps>(
  function GooeyInput(
    { className, endAdornment, startAdornment, wrapperClassName, ...props },
    ref,
  ) {
    return (
      <div className={cn("relative", wrapperClassName)}>
        {startAdornment && (
          <span className="pointer-events-none absolute left-3 top-1/2 z-10 grid -translate-y-1/2 place-items-center text-slate-400">
            {startAdornment}
          </span>
        )}
        <input
          {...props}
          className={cn(
            "emerald-input h-10 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] text-sm text-[var(--text)] outline-none transition-colors placeholder:text-slate-400 focus:border-[var(--primary)] focus:ring-2 focus:ring-blue-100 dark:text-blue-50",
            startAdornment ? "pl-9" : "pl-3",
            endAdornment ? "pr-14" : "pr-3",
            className,
          )}
          ref={ref}
        />
        {endAdornment && (
          <span className="pointer-events-none absolute right-3 top-1/2 z-10 -translate-y-1/2">
            {endAdornment}
          </span>
        )}
      </div>
    );
  },
);

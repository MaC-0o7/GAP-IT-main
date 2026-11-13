"use client";

import { useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Button } from "@/components/ui/primitives";

type StatefulButtonProps = Omit<ComponentProps<"button">, "children" | "onClick"> & {
  children: ReactNode;
  onClick: () => void | Promise<void>;
  successLabel?: string;
};

export function StatefulButton({
  children,
  onClick,
  successLabel = "Sent",
  disabled,
  type = "button",
  ...props
}: StatefulButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  const resetTimer = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current !== null) window.clearTimeout(resetTimer.current);
    },
    [],
  );

  const handleClick = async () => {
    if (state === "loading" || disabled) return;

    setState("loading");
    try {
      await onClick();
      setState("success");
      resetTimer.current = window.setTimeout(() => {
        resetTimer.current = null;
        setState("idle");
      }, 1800);
    } catch (error) {
      console.error("Stateful button action failed.", error);
      setState("error");
    }
  };

  return (
    <Button
      {...props}
      aria-busy={state === "loading"}
      disabled={disabled || state === "loading"}
      onClick={() => void handleClick()}
      type={type}
      variant="primary"
    >
      {state === "loading"
        ? "Sending…"
        : state === "success"
          ? successLabel
          : state === "error"
            ? "Failed — retry"
            : children}
    </Button>
  );
}

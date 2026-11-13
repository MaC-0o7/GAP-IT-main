"use client";

import { AnimatePresence, motion } from "motion/react";
import { IconMoon, IconSun } from "@tabler/icons-react";

type AnimatedThemeTogglerProps = {
  isDark: boolean;
  label: string;
  onToggle: () => void;
  className?: string;
};

export function AnimatedThemeToggler({
  isDark,
  label,
  onToggle,
  className = "",
}: AnimatedThemeTogglerProps) {
  return (
    <motion.button
      aria-label={label}
      className={`grid size-11 shrink-0 place-items-center rounded-xl text-[var(--text)] transition-colors hover:bg-[var(--surface-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)] ${className}`}
      onClick={onToggle}
      type="button"
      whileTap={{ scale: 0.9 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={isDark ? "sun" : "moon"}
          animate={{ opacity: 1, rotate: 0, scale: 1 }}
          aria-hidden="true"
          className="grid place-items-center"
          exit={{ opacity: 0, rotate: isDark ? -90 : 90, scale: 0.6 }}
          initial={{ opacity: 0, rotate: isDark ? 90 : -90, scale: 0.6 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <IconSun className="size-[18px]" />
          ) : (
            <IconMoon className="size-[18px]" />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}

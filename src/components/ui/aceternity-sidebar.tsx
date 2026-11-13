"use client";
import React, { createContext, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import Image from "next/image";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

/* Map these classes to the app's theme tokens (see globals.css). Keep the frosted look. */
const SURFACE = "bg-[var(--surface)]/90";
const DRAWER_SURFACE = "bg-[var(--surface)]/97";
const TEXT = "text-[var(--text)]";
const ACTIVE = "bg-[var(--soft-teal)] text-[var(--primary-dark)] ring-1 ring-[var(--primary)]/30";

interface SidebarContextProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);
const ExpandedContext = createContext(false);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within a Sidebar");
  return context;
};

export const useSidebarExpanded = () => useContext(ExpandedContext);

export function BrandLogo({ className }: { className?: string }) {
  return (
    <Image
      alt="GAP-IT"
      className={className}
      height={31}
      src="/gap-it-logo.png"
      unoptimized
      width={160}
    />
  );
}

export const Sidebar = ({
  children,
  open: openProp,
  setOpen: setOpenProp,
  mobileOpen: mobileOpenProp,
  setMobileOpen: setMobileOpenProp,
}: {
  children: React.ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  mobileOpen?: boolean;
  setMobileOpen?: Dispatch<SetStateAction<boolean>>;
}) => {
  const [openState, setOpenState] = useState(false);
  const [mobileOpenState, setMobileOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = setOpenProp ?? setOpenState;
  const mobileOpen = mobileOpenProp ?? mobileOpenState;
  const setMobileOpen = setMobileOpenProp ?? setMobileOpenState;
  return (
    <SidebarContext.Provider value={{ open, setOpen, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  );
};

export const SidebarBody = ({
  className,
  children,
  showMobileBar = false,
  menuLabel = "Open menu",
  closeLabel = "Close menu",
}: {
  className?: string;
  children: React.ReactNode;
  showMobileBar?: boolean;
  menuLabel?: string;
  closeLabel?: string;
}) => (
  <>
    <DesktopSidebar className={className}>{children}</DesktopSidebar>
    <MobileSidebar
      className={className}
      showBar={showMobileBar}
      menuLabel={menuLabel}
      closeLabel={closeLabel}
    >
      {children}
    </MobileSidebar>
  </>
);

export const DesktopSidebar = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  const { open, setOpen } = useSidebar();
  const reduce = useReducedMotion();
  return (
    <div className="relative hidden w-[72px] shrink-0 self-stretch md:block">
      <ExpandedContext.Provider value={open}>
        <motion.aside
          className={cn(
            "glass-header absolute inset-y-0 left-0 z-[var(--z-drawer)] flex flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--surface)]/90 px-3 py-4 text-[var(--text)] shadow-[var(--shadow-soft)] backdrop-blur-2xl [-webkit-backdrop-filter:blur(20px)]",
            SURFACE,
            open && "shadow-xl",
            className,
          )}
          initial={false}
          animate={{ width: open ? 288 : 72 }}
          transition={{ duration: reduce ? 0 : 0.2, ease: "easeInOut" }}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          onFocus={() => setOpen(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setOpen(false);
          }}
        >
          {children}
        </motion.aside>
      </ExpandedContext.Provider>
    </div>
  );
};

export const MobileSidebar = ({
  className,
  children,
  showBar = true,
  menuLabel = "Open menu",
  closeLabel = "Close menu",
}: {
  className?: string;
  children: React.ReactNode;
  showBar?: boolean;
  menuLabel?: string;
  closeLabel?: string;
}) => {
  const { mobileOpen, setMobileOpen } = useSidebar();
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, setMobileOpen]);

  return (
    <div className="md:hidden">
      {showBar && (
        <div className={cn("flex h-12 w-full items-center justify-end px-4", SURFACE)}>
          <button
            type="button"
            aria-label={menuLabel}
            onClick={() => setMobileOpen(true)}
            className={cn("flex h-11 w-11 items-center justify-center", TEXT)}
          >
            <IconMenu2 className="h-6 w-6" />
          </button>
        </div>
      )}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={menuLabel}
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.3, ease: "easeInOut" }}
            className={cn(
              "fixed inset-0 z-[var(--z-drawer)] flex flex-col justify-between overflow-y-auto border-r border-[var(--border)] p-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] text-[var(--text)] shadow-2xl backdrop-blur-2xl [-webkit-backdrop-filter:blur(20px)]",
              DRAWER_SURFACE,
              className,
            )}
          >
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => setMobileOpen(false)}
              className={cn("absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center", TEXT)}
            >
              <IconX className="h-6 w-6" />
            </button>
            <ExpandedContext.Provider value={true}>{children}</ExpandedContext.Provider>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export interface SidebarLinkItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  active?: boolean;
}

export const SidebarLink = ({ link, className }: { link: SidebarLinkItem; className?: string }) => {
  const expanded = useContext(ExpandedContext);
  const { setMobileOpen } = useSidebar();
  const classes = cn(
    "group/sidebar flex min-h-11 w-full min-w-0 items-center justify-start gap-3 rounded-lg px-2 py-2 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]",
    TEXT,
    link.active && ACTIVE,
    className,
  );
  const content = (
    <>
      <span className="flex h-6 w-6 shrink-0 items-center justify-center">{link.icon}</span>
      <motion.span
        initial={false}
        animate={{ opacity: expanded ? 1 : 0, display: expanded ? "inline-block" : "none" }}
        className="min-w-0 break-words text-sm"
      >
        {link.label}
      </motion.span>
    </>
  );
  const handle = (event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (link.href) event.preventDefault();
    link.onClick?.();
    setMobileOpen(false);
  };
  return link.href ? (
    <a
      href={link.href}
      aria-label={link.label}
      title={link.label}
      aria-current={link.active ? "page" : undefined}
      onClick={handle}
      className={classes}
    >
      {content}
    </a>
  ) : (
    <button
      type="button"
      aria-label={link.label}
      title={link.label}
      aria-current={link.active ? "page" : undefined}
      onClick={handle}
      className={classes}
    >
      {content}
    </button>
  );
};

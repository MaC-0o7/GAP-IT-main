"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ComponentProps,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useT } from "@/lib/i18n/provider";

type SidebarContextValue = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  mobileOpen: boolean;
  setMobileOpen: Dispatch<SetStateAction<boolean>>;
  animate: boolean;
  hoverToExpand: boolean;
};

type SidebarLinkData = {
  label: string;
  href: string;
  icon: ReactNode;
  active?: boolean;
  onClick?: ComponentProps<"a">["onClick"];
};

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

export function BrandLogo({
  className,
  compact = false,
  priority = false,
}: {
  className?: string;
  compact?: boolean;
  priority?: boolean;
}) {
  if (compact) {
    return (
      <span className={cn("relative block h-8 w-8 shrink-0 overflow-hidden", className)}>
        <Image
          alt="GAP-IT"
          className="absolute left-0 top-1/2 max-w-none -translate-y-1/2"
          height={31}
          priority={priority}
          src="/gap-it-logo.png"
          unoptimized
          width={160}
        />
      </span>
    );
  }

  return (
    <Image
      alt="GAP-IT"
      className={className}
      height={31}
      priority={priority}
      src="/gap-it-logo.png"
      unoptimized
      width={160}
    />
  );
}

export function SidebarProvider({
  children,
  open: openProp,
  setOpen: setOpenProp,
  mobileOpen: mobileOpenProp,
  setMobileOpen: setMobileOpenProp,
  animate = true,
  hoverToExpand = true,
}: {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  mobileOpen?: boolean;
  setMobileOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
  hoverToExpand?: boolean;
}) {
  const [openState, setOpenState] = useState(false);
  const [mobileOpenState, setMobileOpenState] = useState(false);
  const open = openProp ?? openState;
  const setOpen = setOpenProp ?? setOpenState;
  const mobileOpen = mobileOpenProp ?? mobileOpenState;
  const setMobileOpen = setMobileOpenProp ?? setMobileOpenState;

  return (
    <SidebarContext.Provider value={{ open, setOpen, mobileOpen, setMobileOpen, animate, hoverToExpand }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function Sidebar({
  children,
  open,
  setOpen,
  mobileOpen,
  setMobileOpen,
  animate,
  hoverToExpand,
}: {
  children: ReactNode;
  open?: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
  mobileOpen?: boolean;
  setMobileOpen?: Dispatch<SetStateAction<boolean>>;
  animate?: boolean;
  hoverToExpand?: boolean;
}) {
  return (
    <SidebarProvider
      animate={animate}
      hoverToExpand={hoverToExpand}
      mobileOpen={mobileOpen}
      open={open}
      setMobileOpen={setMobileOpen}
      setOpen={setOpen}
    >
      {children}
    </SidebarProvider>
  );
}

export function SidebarBody({
  children,
  className,
  showMobile = true,
  showMobileBar,
  menuLabel,
  closeLabel,
  ...props
}: Omit<ComponentProps<typeof motion.div>, "children"> & {
  children: ReactNode;
  showMobile?: boolean;
  showMobileBar?: boolean;
  menuLabel?: string;
  closeLabel?: string;
}) {
  const mobileBar = showMobileBar ?? showMobile;

  return (
    <>
      <DesktopSidebar className={className} {...props}>
        {children}
      </DesktopSidebar>
      {mobileBar && <MobileSidebar closeLabel={closeLabel} menuLabel={menuLabel}>{children}</MobileSidebar>}
    </>
  );
}

function DesktopSidebar({
  children,
  className,
  ...props
}: ComponentProps<typeof motion.aside>) {
  const { open, setOpen, animate, hoverToExpand } = useSidebar();
  const { t } = useT();

  return (
    <motion.aside
      aria-label={t("shell.mainNavigation")}
      className={cn(
        "glass-header hidden h-dvh shrink-0 flex-col overflow-hidden border-r border-[var(--border)] bg-[var(--surface)]/90 px-3 py-5 shadow-[var(--shadow-soft)] backdrop-blur-2xl md:flex",
        className,
      )}
      animate={{ width: animate ? (open ? 272 : 76) : 272 }}
      onMouseEnter={() => {
        if (hoverToExpand) setOpen(true);
      }}
      onMouseLeave={() => {
        if (hoverToExpand) setOpen(false);
      }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      {...props}
    >
      {children}
    </motion.aside>
  );
}

function MobileSidebar({
  children,
  menuLabel,
  closeLabel,
}: {
  children: ReactNode;
  menuLabel?: string;
  closeLabel?: string;
}) {
  const { open, setOpen, mobileOpen, setMobileOpen } = useSidebar();
  const { t } = useT();
  const actualMenuLabel = menuLabel ?? t("shell.openMenu");
  const actualCloseLabel = closeLabel ?? t("shell.closeMenu");
  const panelOpen = mobileOpen ?? open;

  useEffect(() => {
    if (!panelOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [panelOpen, setMobileOpen]);

  return (
    <div className="glass-header flex h-14 items-center justify-between border-b border-[var(--border)] bg-[var(--surface)]/90 px-4 backdrop-blur-xl md:hidden">
      <a aria-label="GAP-IT Overview" className="flex items-center" href="/workspace">
        <BrandLogo className="h-auto w-[120px]" />
      </a>
      <button
        aria-expanded={panelOpen}
        aria-label={panelOpen ? actualCloseLabel : actualMenuLabel}
        className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-800"
        onClick={() => setMobileOpen((current) => !current)}
        type="button"
      >
        <IconMenu2 aria-hidden="true" className="size-5" />
      </button>
      <AnimatePresence>
        {panelOpen && (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="glass-header fixed inset-0 z-[var(--z-drawer)] flex h-dvh w-full flex-col bg-[var(--surface)] p-5 backdrop-blur-2xl"
            exit={{ opacity: 0, x: "-100%" }}
            initial={{ opacity: 0, x: "-100%" }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
          >
            <div className="mb-7 flex items-center justify-between">
              <a aria-label="GAP-IT Overview" className="flex items-center" href="/workspace">
                <BrandLogo className="h-auto w-[120px]" />
              </a>
              <button
                aria-label={actualCloseLabel}
                className="inline-flex size-10 items-center justify-center rounded-lg text-slate-600 transition hover:bg-blue-50 hover:text-blue-800"
                onClick={() => setMobileOpen(false)}
                type="button"
              >
                <IconX aria-hidden="true" className="size-5" />
              </button>
            </div>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SidebarLink({
  link,
  className,
  ...props
}: {
  link: SidebarLinkData;
  className?: string;
} & Omit<ComponentProps<"a">, "href" | "onClick">) {
  const { open, animate } = useSidebar();

  return (
    <a
      aria-current={link.active ? "page" : undefined}
      aria-label={!open ? link.label : undefined}
      className={cn(
        "group/sidebar relative flex min-h-10 items-center gap-3 rounded-xl px-2.5 py-2 text-sm transition-colors duration-200",
        link.active
          ? "bg-[var(--soft-teal)] font-semibold text-[var(--primary-dark)] shadow-none before:absolute before:bottom-2 before:left-0 before:top-2 before:w-0.5 before:rounded-full before:bg-[var(--primary)]"
          : "text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--text)]",
        className,
      )}
      href={link.href}
      onClick={link.onClick}
      title={!open ? link.label : undefined}
      {...props}
    >
      <span className="grid size-5 shrink-0 place-items-center">{link.icon}</span>
      <motion.span
        animate={{
          display: animate ? (open ? "inline-block" : "none") : "inline-block",
          opacity: animate ? (open ? 1 : 0) : 1,
        }}
        className="whitespace-nowrap"
        transition={{ duration: 0.15 }}
      >
        {link.label}
      </motion.span>
    </a>
  );
}

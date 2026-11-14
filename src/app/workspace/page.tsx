"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ComponentType, type Dispatch, type SetStateAction } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import {
  IconBell,
  IconChevronLeft,
  IconDatabase,
  IconMenu2,
  IconSearch,
  IconLogout,
  IconActivity,
  IconAlertTriangle,
  IconChartLine,
  IconCpu,
  IconDashboard,
  IconFileReport,
  IconHistory,
  IconClipboardCheck,
  IconRoute,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { createDemoData, migrateDemoData, type DemoData } from "@/lib/demo-data";
import { WorkspaceModule } from "@/components/workspace-module";
import { SearchInput } from "@/components/ui/primitives";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { LanguageSelector } from "@/components/ui/language-selector";
import { useT } from "@/lib/i18n/provider";
import type { Language } from "@/lib/i18n/types";
import type { TranslationKey } from "@/lib/i18n/types";
import { clearDemoSession, readDemoSession, type DemoSession } from "@/lib/auth/session";
import {
  roleCan,
  WORKSPACE_SECTION_PERMISSIONS,
  type PermissionModule,
} from "@/lib/auth/permissions";
import { getSavedTheme } from "@/lib/auth/theme";
import { MrSpotIt } from "@/components/mascots/mascots";
import { LoadingScreen } from "@/components/auth/loading-screen";
import {
  BrandLogo,
  Sidebar,
  SidebarBody,
  SidebarLink,
  useSidebarExpanded,
} from "@/components/ui/aceternity-sidebar";

const sectionMenuIcons = {
  overview: IconDashboard,
  "live-measurements": IconActivity,
  "instrument-management": IconCpu,
  "spc-analytics": IconChartLine,
  "spc-reports": IconFileReport,
  "part-inspection-setup": IconClipboardCheck,
  "alerts-quality-events": IconAlertTriangle,
  traceability: IconRoute,
  "history-data-explorer": IconHistory,
  "users-permissions": IconUsers,
  "system-settings": IconSettings,
} satisfies Record<string, ComponentType<{ className?: string }>>;

const sections = [
  {
    id: "overview",
    labelKey: "nav.overview",
    icon: sectionMenuIcons.overview,
    descriptionKey: "navDescription.overview",
  },
  {
    id: "live-measurements",
    labelKey: "nav.liveMeasurements",
    icon: sectionMenuIcons["live-measurements"],
    descriptionKey: "navDescription.liveMeasurements",
  },
  {
    id: "instrument-management",
    labelKey: "nav.instruments",
    icon: sectionMenuIcons["instrument-management"],
    descriptionKey: "navDescription.instruments",
  },
  {
    id: "spc-analytics",
    labelKey: "nav.spcAnalysis",
    icon: sectionMenuIcons["spc-analytics"],
    descriptionKey: "navDescription.spcAnalysis",
  },
  {
    id: "spc-reports",
    labelKey: "nav.spcReports",
    icon: sectionMenuIcons["spc-reports"],
    descriptionKey: "navDescription.spcReports",
  },
  {
    id: "part-inspection-setup",
    labelKey: "nav.partsInspection",
    icon: sectionMenuIcons["part-inspection-setup"],
    descriptionKey: "navDescription.partsInspection",
  },
  {
    id: "alerts-quality-events",
    labelKey: "nav.qualityEvents",
    icon: sectionMenuIcons["alerts-quality-events"],
    descriptionKey: "navDescription.qualityEvents",
  },
  {
    id: "traceability",
    labelKey: "nav.traceability",
    icon: sectionMenuIcons.traceability,
    descriptionKey: "navDescription.traceability",
  },
  {
    id: "history-data-explorer",
    labelKey: "nav.measurementHistory",
    icon: sectionMenuIcons["history-data-explorer"],
    descriptionKey: "navDescription.measurementHistory",
  },
  {
    id: "users-permissions",
    labelKey: "nav.userAccounts",
    icon: sectionMenuIcons["users-permissions"],
    descriptionKey: "navDescription.userAccounts",
  },
  {
    id: "system-settings",
    labelKey: "nav.systemSettings",
    icon: sectionMenuIcons["system-settings"],
    descriptionKey: "navDescription.systemSettings",
  },
] as const;

type SectionId = (typeof sections)[number]["id"];
const sectionPermissions: Record<SectionId, PermissionModule> =
  WORKSPACE_SECTION_PERMISSIONS;

function isSectionId(value: string | undefined): value is SectionId {
  return sections.some((section) => section.id === value);
}

function SectionNavigation({
  activeSection,
  onNavigate,
  role,
}: {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  role: DemoSession["role"];
}) {
  const { t } = useT();

  return (
    <nav aria-label={t("shell.qualitySections")} className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 overflow-y-auto">
      {sections.map((section) => {
        if (!roleCan(role, sectionPermissions[section.id], "view")) return null;
        const Icon = section.icon;
        return (
          <SidebarLink
            key={section.id}
            link={{
              label: t(section.labelKey),
              icon: <Icon aria-hidden="true" className="size-5 shrink-0" />,
              href: `/workspace?section=${encodeURIComponent(section.id)}`,
              active: activeSection === section.id,
              onClick: () => onNavigate(section.id),
            }}
          />
        );
      })}
    </nav>
  );
}

function WorkspaceSidebarContent({
  activeSection,
  onNavigate,
  role,
  session,
  roleLabel,
  onSignOut,
  theme,
  onToggleTheme,
  language,
  onLanguageChange,
}: {
  activeSection: SectionId;
  onNavigate: (sectionId: SectionId) => void;
  role: DemoSession["role"];
  session: DemoSession;
  roleLabel: string;
  onSignOut: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  language: Language;
  onLanguageChange: (language: Language) => void;
}) {
  const { t } = useT();
  const expanded = useSidebarExpanded();
  const initials = session.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase();
  const themeLabel = t("shell.switchTheme", { theme: t(theme === "dark" ? "shell.light" : "shell.dark") });

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className={`flex h-10 shrink-0 items-center ${expanded ? "justify-between px-1" : "justify-center"}`}>
        {expanded && (
          <a aria-label={t("auth.home")} className="flex min-w-0 items-center" href="/workspace" onClick={(event) => {
            event.preventDefault();
            onNavigate("overview");
          }}>
            <BrandLogo className="h-auto w-[160px]" />
          </a>
        )}
      </div>
      <SectionNavigation activeSection={activeSection} onNavigate={onNavigate} role={role} />
      <div className={`mt-auto border-t border-[var(--border)] pt-3 ${expanded ? "space-y-3" : "flex flex-col items-center gap-2"}`}>
        <div
          aria-label={`${session.name}, ${roleLabel}`}
          className={`flex min-h-11 items-center ${expanded ? "gap-3 px-1" : "flex-col gap-1"}`}
          title={`${t("shell.team")}, ${t("shell.workspaceMember")}`}
        >
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--soft-teal)] text-xs font-semibold text-[var(--primary-dark)]">
            {initials}
          </span>
          {expanded && (
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-semibold text-[var(--text)]">{session.name}</span>
              <span className="block truncate text-[11px] text-[var(--muted)]">{roleLabel}</span>
            </span>
          )}
        </div>
        {expanded && (
          <div className="flex min-w-0 items-center justify-between gap-2">
            <label className="min-w-0 flex-1">
              <span className="sr-only">{t("language.label")}</span>
              <select
                aria-label={t("language.label")}
                className="min-h-11 w-full min-w-0 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2 text-sm text-[var(--text)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]"
                onChange={(event) => onLanguageChange(event.target.value as Language)}
                value={language}
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
              </select>
            </label>
            <AnimatedThemeToggler
              className="size-11 shrink-0"
              isDark={theme === "dark"}
              label={themeLabel}
              onToggle={onToggleTheme}
            />
          </div>
        )}
        <SidebarLink
          link={{
            label: t("auth.signOut"),
            icon: <IconLogout aria-hidden="true" className="size-5" />,
            onClick: onSignOut,
          }}
          className="text-[var(--danger)] hover:bg-[var(--danger-surface)] hover:text-[var(--danger)]"
        />
      </div>
    </div>
  );
}

export default function Home() {
  const { t, language, setLanguage } = useT();
  const [activeSection, setActiveSection] = useState<SectionId>("overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moduleSearch, setModuleSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchCloseTimerRef = useRef<number | null>(null);
  const [data, setData] = useState<DemoData>(() => createDemoData(0));
  const [isHydrated, setIsHydrated] = useState(false);
  const [canPersistData, setCanPersistData] = useState(false);
  const [storageWarning, setStorageWarning] = useState(false);
  const [session, setSession] = useState<DemoSession | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [confirmSignOut, setConfirmSignOut] = useState(false);
  const [userMenuPosition, setUserMenuPosition] = useState({ top: 0, left: 0 });
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const activeUserTriggerRef = useRef<HTMLButtonElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const currentSection =
    sections.find((section) => section.id === activeSection) ?? sections[0];

  useEffect(() => {
    const current = readDemoSession();
    if (!current) {
      const returnTo = `${window.location.pathname}${window.location.search}`;
      window.location.replace(`/login?returnTo=${encodeURIComponent(returnTo)}`);
      return;
    }
    setSession(current);
    setAuthReady(true);
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem("gap-it-demo-data");
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        const migrated = migrateDemoData(parsed);
        if (migrated) {
          const savedTheme = getSavedTheme();
          setData({ ...migrated, settings: { ...migrated.settings, theme: savedTheme } });
          setCanPersistData(true);
        } else {
          const seeded = createDemoData();
          setData({ ...seeded, settings: { ...seeded.settings, theme: getSavedTheme() } });
          setCanPersistData(true);
          setStorageWarning(true);
        }
      } else {
        const seeded = createDemoData();
        setData({ ...seeded, settings: { ...seeded.settings, theme: getSavedTheme() } });
        setCanPersistData(true);
      }
    } catch {
      const seeded = createDemoData();
      setData({ ...seeded, settings: { ...seeded.settings, theme: getSavedTheme() } });
      setCanPersistData(true);
      setStorageWarning(true);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated || !canPersistData) return;
    try {
      window.localStorage.setItem("gap-it-demo-data", JSON.stringify(data));
    } catch {
      setCanPersistData(false);
      setStorageWarning(true);
    }
  }, [canPersistData, data, isHydrated]);

  const updateData: Dispatch<SetStateAction<DemoData>> = (update) => {
    setCanPersistData(true);
    setData(update);
  };

  useEffect(() => {
    if (!isHydrated) return;
    document.documentElement.classList.toggle("dark", data.settings.theme === "dark");
    document.documentElement.style.colorScheme = data.settings.theme;
    try {
      window.localStorage.setItem("gap-it-theme", data.settings.theme);
    } catch {
      setStorageWarning(true);
    }
  }, [data.settings.theme, isHydrated]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const rect = activeUserTriggerRef.current?.getBoundingClientRect();
    if (rect) setUserMenuPosition({ top: rect.bottom + 8, left: Math.max(12, rect.right - 260) });
    requestAnimationFrame(() => userMenuRef.current?.querySelector<HTMLButtonElement>("button")?.focus());
    const closeOutside = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !activeUserTriggerRef.current?.contains(event.target) &&
        !userMenuRef.current?.contains(event.target)
      ) setUserMenuOpen(false);
    };
    const closeEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setUserMenuOpen(false);
        activeUserTriggerRef.current?.focus();
      }
    };
    const reposition = () => {
      const buttonRect = activeUserTriggerRef.current?.getBoundingClientRect();
      if (buttonRect) setUserMenuPosition({ top: buttonRect.bottom + 8, left: Math.max(12, buttonRect.right - 260) });
    };
    document.addEventListener("pointerdown", closeOutside);
    document.addEventListener("keydown", closeEscape);
    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    return () => {
      document.removeEventListener("pointerdown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
    };
  }, [userMenuOpen]);

  useEffect(() => {
    if (searchOpen) searchInputRef.current?.focus();
  }, [searchOpen]);

  useEffect(
    () => () => {
      if (searchCloseTimerRef.current !== null) {
        window.clearTimeout(searchCloseTimerRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const handleSearchShortcut = (event: KeyboardEvent) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (event.key === "/" && !isTyping) {
        event.preventDefault();
        setSearchOpen(true);
      } else if (event.key === "Escape") {
        setSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleSearchShortcut);
    return () => window.removeEventListener("keydown", handleSearchShortcut);
  }, []);

  useEffect(() => {
    const querySection = new URLSearchParams(window.location.search).get("section");
    const initialHash = window.location.hash.slice(1);
    const sectionCandidate = querySection ?? initialHash;
    const initialSection = isSectionId(sectionCandidate) ? sectionCandidate : "overview";
    const appUrl = `${window.location.pathname}${window.location.search}`;

    window.history.replaceState(
      { gapIt: true, section: "overview" },
      "",
      appUrl,
    );
    window.history.pushState(
      { gapIt: true, rootGuard: true, section: "overview" },
      "",
      appUrl,
    );

    setActiveSection("overview");
    if (initialSection !== "overview") {
      window.history.pushState(
        { gapIt: true, section: initialSection },
        "",
        appUrl,
      );
      setActiveSection(initialSection);
    }

    const handlePopState = (event: PopStateEvent) => {
      const state = event.state as
        | { gapIt?: boolean; rootGuard?: boolean; section?: string }
        | null;

      if (state?.gapIt && isSectionId(state.section)) {
        setActiveSection(state.section);
        if (state.section === "overview" && !state.rootGuard) {
          window.history.pushState(
            { gapIt: true, rootGuard: true, section: "overview" },
            "",
            appUrl,
          );
        }
        return;
      }

      setActiveSection("overview");
      window.history.pushState(
        { gapIt: true, rootGuard: true, section: "overview" },
        "",
        appUrl,
      );
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigateToSection = (sectionId: SectionId) => {
    if (!session || !roleCan(session.role, sectionPermissions[sectionId], "view") || sectionId === activeSection) return;

    window.history.pushState(
      { gapIt: true, section: sectionId },
      "",
      `/workspace?section=${encodeURIComponent(sectionId)}`,
    );
    setActiveSection(sectionId);
  };

  const toggleTheme = () => {
    const theme = data.settings.theme === "light" ? "dark" : "light";
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.dispatchEvent(new Event("gap-it-theme-change"));
    try {
      window.localStorage.setItem("gap-it-theme", theme);
      window.localStorage.setItem("gap-it-demo-data", JSON.stringify({
        ...data,
        settings: { ...data.settings, theme },
      }));
    } catch {
      setStorageWarning(true);
    }
    setData((current) => ({
      ...current,
      settings: { ...current.settings, theme },
    }));
  };

  const completeSignOut = () => {
    setUserMenuOpen(false);
    setMobileOpen(false);
    clearDemoSession();
    window.dispatchEvent(new Event("gap-it-session-change"));
    window.location.assign("/login?signedOut=1");
  };

  const signOut = () => {
    if (unsavedChanges) {
      setConfirmSignOut(true);
      return;
    }
    completeSignOut();
  };
  const updateUnsavedChanges = useCallback((unsaved: boolean) => {
    setUnsavedChanges(unsaved);
  }, []);

  const toggleUserMenu = (trigger: HTMLButtonElement) => {
    if (!userMenuOpen) {
      activeUserTriggerRef.current = trigger;
      const rect = trigger.getBoundingClientRect();
      if (rect) setUserMenuPosition({ top: rect.bottom + 8, left: Math.max(12, rect.right - 260) });
    }
    setUserMenuOpen((open) => !open);
  };

  const searchResults = sections.filter((section) =>
    roleCan(session?.role ?? null, sectionPermissions[section.id], "view") &&
    `${t(section.labelKey)} ${t(section.descriptionKey)}`
      .toLowerCase()
      .includes(moduleSearch.trim().toLowerCase()),
  );

  if (!authReady || !session || !isHydrated) return <LoadingScreen />;
  const activeAllowed = roleCan(session.role, sectionPermissions[activeSection], "view");
  const roleLabel = t(session.role === "administrator" ? "auth.roleAdmin" : session.role === "operator" ? "auth.roleOperator" : session.role === "qualityEngineer" ? "auth.roleInspector" : "auth.role");

  return (
    <MotionConfig reducedMotion="user">
    <div className="app-shell flex h-dvh overflow-hidden">
      <Sidebar
        mobileOpen={mobileOpen}
        open={sidebarOpen}
        setMobileOpen={setMobileOpen}
        setOpen={setSidebarOpen}
      >
        <SidebarBody
          className="h-full justify-between gap-10"
          closeLabel={t("shell.closeMenu")}
          menuLabel={t("shell.openMenu")}
          showMobileBar={false}
        >
          <WorkspaceSidebarContent
              activeSection={activeSection}
              language={language}
              onLanguageChange={setLanguage}
              onNavigate={navigateToSection}
              onSignOut={signOut}
              onToggleTheme={toggleTheme}
              role={session.role}
              roleLabel={roleLabel}
              session={session}
              theme={data.settings.theme}
          />
        </SidebarBody>
      </Sidebar>

      <div className="flex h-full min-h-0 min-w-0 flex-1 flex-col">
        <header className="glass-header sticky top-0 z-[var(--z-sticky)] hidden h-[68px] shrink-0 items-center justify-between gap-6 border-b border-[var(--border)] bg-[var(--surface)]/90 px-5 backdrop-blur-2xl md:flex md:px-8">
          <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500 dark:text-blue-100/60">
            <IconDatabase aria-hidden="true" className="size-4 shrink-0 text-blue-600 dark:text-sky-400" />
            <span className="whitespace-nowrap">{t("shell.qualityOperations")}</span>
            <span aria-hidden="true" className="text-slate-300 dark:text-emerald-100/30">/</span>
            <span className="truncate font-semibold text-[var(--text)]">
              {t(currentSection.labelKey)}
            </span>
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <div
              className="relative flex items-center gap-2"
              onBlur={(event) => {
                if (
                  !(event.relatedTarget instanceof Node) ||
                  !event.currentTarget.contains(event.relatedTarget)
                ) {
                  if (searchCloseTimerRef.current !== null) {
                    window.clearTimeout(searchCloseTimerRef.current);
                  }
                  searchCloseTimerRef.current = window.setTimeout(() => {
                    searchCloseTimerRef.current = null;
                    setSearchOpen(false);
                  }, 150);
                }
              }}
              onFocus={() => {
                if (searchCloseTimerRef.current !== null) {
                  window.clearTimeout(searchCloseTimerRef.current);
                  searchCloseTimerRef.current = null;
                }
              }}
            >
              <button
                aria-label={t("shell.searchModules")}
                aria-expanded={searchOpen}
                aria-controls="workspace-search"
                className="grid size-10 place-items-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-700 dark:text-blue-100/70 dark:hover:bg-blue-100/[0.08] dark:hover:text-sky-300"
                onClick={() => setSearchOpen((open) => !open)}
                title={t("shell.searchShortcut")}
                type="button"
              >
                <IconSearch aria-hidden="true" className="size-[18px]" />
              </button>
              {searchOpen && (
                <div
                  className="relative w-[min(18rem,35vw)]"
                >
                  <label className="sr-only" htmlFor="workspace-search">{t("shell.searchModules")}</label>
                  <SearchInput
                  aria-label={t("shell.searchWorkspace")}
                    autoComplete="off"
                    id="workspace-search"
                    onChange={(event) => setModuleSearch(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" && searchResults[0]) {
                        navigateToSection(searchResults[0].id);
                        setModuleSearch("");
                        setSearchOpen(false);
                      }
                    }}
                    placeholder={t("shell.searchPlaceholder")}
                    ref={searchInputRef}
                    role="combobox"
                    aria-expanded={moduleSearch.trim().length > 0}
                    aria-controls="workspace-search-results"
                    value={moduleSearch}
                  />
                  {moduleSearch.trim() && (
                    <div
                      className="emerald-glass absolute right-0 top-full z-[var(--z-popover)] mt-2 max-h-72 w-[min(20rem,calc(100vw-2rem))] overflow-y-auto rounded-xl border border-[var(--border)] bg-[var(--surface)] p-1.5 shadow-xl"
                      id="workspace-search-results"
                      role="listbox"
                    >
                      {searchResults.length ? searchResults.map((section) => (
                        <button
                          className="flex min-h-11 w-full items-center gap-3 rounded-lg px-3 text-left text-sm text-slate-700 transition hover:bg-blue-50 hover:text-blue-800 dark:text-blue-50/80 dark:hover:bg-blue-300/10 dark:hover:text-sky-200"
                          key={section.id}
                          onMouseDown={(event) => event.preventDefault()}
                          onClick={() => {
                            navigateToSection(section.id);
                            setModuleSearch("");
                            setSearchOpen(false);
                          }}
                          role="option"
                          type="button"
                        >
                          <span className="text-blue-600 dark:text-sky-400">
                            <section.icon aria-hidden className="size-5" />
                          </span>
                          <span>{t(section.labelKey)}</span>
                        </button>
                      )) : (
                        <p className="px-3 py-4 text-center text-xs text-slate-500">{t("shell.noModulesFound")}</p>
                      )}
                    </div>
                  )}
                  </div>
              )}
            </div>
            <span className="hidden whitespace-nowrap rounded-full bg-amber-50 px-3 py-1.5 text-[10px] font-bold tracking-wide text-amber-800 dark:bg-amber-950 dark:text-amber-300 lg:inline-flex">
              {t("shell.demoBanner")}
            </span>
            {roleCan(session.role, "qualityEvents", "view") && <button
              aria-label={t("shell.openEvents", { n: data.events.filter((event) => event.status !== "resolved").length })}
              className="relative grid size-10 shrink-0 place-items-center rounded-xl text-slate-500 transition hover:bg-blue-50 hover:text-blue-800 dark:text-blue-100/70 dark:hover:bg-blue-100/[0.08] dark:hover:text-blue-200"
              onClick={() => navigateToSection("alerts-quality-events")}
              type="button"
            >
              <IconBell aria-hidden="true" className="size-[18px]" />
              {data.events.filter((event) => event.status !== "resolved").length > 0 && (
                <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-[var(--surface)]" />
              )}
            </button>}
            <AnimatedThemeToggler
              isDark={data.settings.theme === "dark"}
              label={t("shell.switchTheme", { theme: t(data.settings.theme === "light" ? "shell.dark" : "shell.light") })}
              onToggle={toggleTheme}
            />
            <LanguageSelector />
            <button aria-expanded={userMenuOpen} aria-haspopup="dialog" aria-controls="workspace-user-menu" aria-label={t("auth.signedInAs", { name: session.name })} className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] dark:bg-blue-400/15 dark:text-blue-200" onClick={(event) => toggleUserMenu(event.currentTarget)} ref={userButtonRef} type="button">
              {session.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
            </button>
          </div>
        </header>
        {userMenuOpen && createPortal(
          <div aria-label={t("auth.signedInAs", { name: session.name })} className="fixed z-[var(--z-popover)] w-[min(16rem,calc(100vw-1.5rem))] rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 text-[var(--text)] shadow-2xl" id="workspace-user-menu" ref={userMenuRef} role="dialog" style={{ top: userMenuPosition.top, left: userMenuPosition.left }}>
            <p className="truncate font-bold">{session.name}</p>
            <p className="mt-1 inline-flex rounded-full bg-[var(--surface-elevated)] px-2.5 py-1 text-xs font-semibold">{roleLabel}</p>
            <div className="mt-3 space-y-2 border-t border-[var(--border)] pt-3 text-sm">
              <label className="flex min-h-11 items-center justify-between gap-3"><span className="font-semibold">{t("language.label")}</span><select aria-label={t("language.label")} className="min-h-10 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2" onChange={(event) => setLanguage(event.target.value as Language)} value={language}><option value="en">English</option><option value="hi">हिन्दी</option><option value="ta">தமிழ்</option></select></label>
              <div className="flex min-h-11 items-center justify-between gap-3"><span className="font-semibold">{t("shell.switchTheme", { theme: t(data.settings.theme === "dark" ? "shell.light" : "shell.dark") })}</span><AnimatedThemeToggler className="size-11" isDark={data.settings.theme === "dark"} label={t("shell.switchTheme", { theme: t(data.settings.theme === "dark" ? "shell.light" : "shell.dark") })} onToggle={toggleTheme} /></div>
              <button className="mt-2 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[var(--danger-surface)] px-3 font-semibold text-[var(--danger)]" onClick={signOut} type="button"><IconLogout aria-hidden="true" size={17} />{t("auth.signOut")}</button>
            </div>
          </div>,
          document.body,
        )}
        {confirmSignOut && createPortal(
          <div className="fixed inset-0 z-[var(--z-dialog)] grid place-items-center bg-slate-950/55 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) setConfirmSignOut(false); }}>
            <section aria-labelledby="sign-out-confirm-title" aria-modal="true" className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 text-[var(--text)] shadow-2xl" role="dialog">
              <h2 className="text-lg font-bold" id="sign-out-confirm-title">{t("auth.signOutConfirmTitle")}</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{t("auth.signOutConfirmDescription")}</p>
              <div className="mt-5 flex flex-wrap justify-end gap-2">
                <button autoFocus className="min-h-11 rounded-xl border border-[var(--border)] px-4 font-semibold" onClick={() => setConfirmSignOut(false)} type="button">{t("dialog.cancel")}</button>
                <button className="min-h-11 rounded-xl bg-[var(--danger)] px-4 font-semibold text-white" onClick={completeSignOut} type="button">{t("auth.signOut")}</button>
              </div>
            </section>
          </div>,
          document.body,
        )}

        <main className="app-main hidden min-h-0 w-full flex-1 overflow-x-hidden overflow-y-auto px-4 py-6 md:block md:px-8 md:py-8">
          {storageWarning && <p className="mx-auto mb-3 max-w-screen-2xl rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200" role="status">{t("auth.storageUnavailable")}</p>}
          {activeAllowed ? <WorkspaceModule
              activeSection={activeSection}
              activeForStreaming
              data={data}
              onNavigate={navigateToSection}
              setData={updateData}
              role={session.role}
              onUnsavedChange={updateUnsavedChanges}
            /> : <NoAccess t={t} />}
        </main>

        <section className="workspace-mobile-frame app-main flex h-dvh min-h-0 flex-1 flex-col overflow-x-hidden md:hidden">
          <header className="workspace-mobile-header glass-header flex h-14 shrink-0 items-center gap-2 border-b border-[var(--border)] bg-[var(--surface)]/90 ps-[max(0.75rem,env(safe-area-inset-left))] pe-[max(0.75rem,env(safe-area-inset-right))] pt-[env(safe-area-inset-top)] backdrop-blur-2xl">
            <button
              aria-expanded={mobileOpen}
              aria-label={t("shell.openMenu")}
              className="grid size-10 shrink-0 place-items-center rounded-xl text-slate-600 hover:bg-blue-50 dark:text-blue-100/70 dark:hover:bg-blue-100/[0.08]"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <IconMenu2 aria-hidden="true" className="size-5" />
            </button>
            {activeSection !== "overview" ? (
              <button
                aria-label={t("shell.backToOverview")}
                className="inline-flex size-10 shrink-0 items-center justify-center rounded-xl text-slate-700 transition active:bg-slate-100"
                onClick={() => window.history.back()}
                type="button"
              >
                <IconChevronLeft aria-hidden="true" className="size-5" />
              </button>
            ) : (
              <a
                aria-label="GAP-IT Overview"
                className="flex shrink-0 items-center"
                href="/workspace"
                onClick={(event) => {
                  event.preventDefault();
                  navigateToSection("overview");
                }}
              >
                <BrandLogo className="h-auto w-[clamp(4rem,20vw,10rem)]" />
              </a>
            )}
            <div className={`${activeSection === "overview" ? "max-md:hidden " : ""}min-w-0 flex-1`}>
              <p className="truncate text-sm font-semibold text-[var(--text)]">
                {t(currentSection.labelKey)}
              </p>
              <p className={`${activeSection === "overview" ? "max-md:hidden " : ""}text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500 dark:text-emerald-100/55`}>
                {activeSection === "overview" ? t("shell.qualityOperations") : t("shell.qualityOperationsPath", { section: t(currentSection.labelKey) })}
              </p>
            </div>
            <div className="ms-auto flex shrink-0 items-center gap-2">
              {roleCan(session.role, "qualityEvents", "view") && <button
                aria-label={t("shell.openEvents", { n: data.events.filter((event) => event.status !== "resolved").length })}
                className="relative grid size-10 shrink-0 place-items-center rounded-xl text-slate-600 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-100/70 dark:hover:bg-blue-100/[0.08]"
                onClick={() => navigateToSection("alerts-quality-events")}
                type="button"
              >
                <IconBell aria-hidden="true" className="size-[18px]" />
                {data.events.filter((event) => event.status !== "resolved").length > 0 && (
                  <span aria-hidden="true" className="absolute right-2 top-2 size-2 rounded-full bg-rose-500 ring-2 ring-[var(--surface)]" />
                )}
              </button>}
              <AnimatedThemeToggler
                isDark={data.settings.theme === "dark"}
                label={t("shell.switchTheme", { theme: t(data.settings.theme === "light" ? "shell.dark" : "shell.light") })}
                onToggle={toggleTheme}
              />
              <LanguageSelector />
              <button aria-expanded={userMenuOpen} aria-haspopup="dialog" aria-controls="workspace-user-menu" aria-label={t("auth.signedInAs", { name: session.name })} className="grid size-11 shrink-0 place-items-center rounded-full bg-blue-100 text-xs font-bold text-blue-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] dark:bg-blue-400/15 dark:text-blue-200" onClick={(event) => toggleUserMenu(event.currentTarget)} type="button">
                {session.name.split(/\s+/).map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
              </button>
            </div>
          </header>

          <main className="app-main min-h-0 flex-1 overflow-x-hidden overflow-y-auto px-4 pb-[calc(1rem+env(safe-area-inset-bottom))] pt-5">
            {storageWarning && <p className="mb-3 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-200" role="status">{t("auth.storageUnavailable")}</p>}
            {activeAllowed ? <WorkspaceModule
              activeSection={activeSection}
              activeForStreaming={false}
              data={data}
              onNavigate={navigateToSection}
              setData={updateData}
              role={session.role}
              onUnsavedChange={updateUnsavedChanges}
            /> : <NoAccess t={t} />}
          </main>
        </section>
      </div>
    </div>
    </MotionConfig>
  );
}

function NoAccess({ t }: { t: (key: TranslationKey) => string }) {
  return (
    <section className="mx-auto flex min-h-[50vh] max-w-xl flex-col items-center justify-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-center text-[var(--text)]">
      <MrSpotIt size="lg" state="thinking" />
      <h1 className="text-xl font-bold">{t("auth.noAccess")}</h1>
    </section>
  );
}

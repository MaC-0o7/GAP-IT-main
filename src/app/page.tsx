"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { IconMail, IconMapPin, IconPhone } from "@tabler/icons-react";
import Link from "next/link";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import { BrandLogo } from "@/components/ui/sidebar";
import { LanguageSelector } from "@/components/ui/language-selector";
import { HomeGridScan } from "@/components/home/home-grid-scan";
import { HomeText, HomeTextRevealContext } from "@/components/home/home-text";
import {
  HomeAbout,
  HomeCallToAction,
  HomeFeatures,
  HomeHero,
  HomeProcess,
  HomeProblemSolution,
  HomeRoles,
  HomeSection,
  HomeStats,
} from "@/components/home/home-sections";
import { useT } from "@/lib/i18n/provider";
import { readDemoSession, clearDemoSession, type DemoSession } from "@/lib/auth/session";
import { getSavedTheme, setSavedTheme } from "@/lib/auth/theme";
import { siteInfo } from "@/lib/site-info";

export default function HomePage() {
  const { t } = useT();
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [session, setSession] = useState<DemoSession | null>(null);
  const [formError, setFormError] = useState("");
  const [sent, setSent] = useState(false);
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    const savedTheme = getSavedTheme();
    let activeTheme = savedTheme;
    let systemPreference = false;
    try {
      systemPreference = window.localStorage.getItem("gap-it-theme") === "system";
    } catch (error) {
      console.warn("Unable to read the saved theme preference.", error);
    }
    if (systemPreference) {
      activeTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", activeTheme === "dark");
      document.documentElement.style.colorScheme = activeTheme;
      window.dispatchEvent(new Event("gap-it-theme-change"));
    } else {
      setSavedTheme(savedTheme);
    }
    setTheme(activeTheme);
    setSession(readDemoSession());
    setYear(new Date().getFullYear());
    const refreshSession = () => setSession(readDemoSession());
    window.addEventListener("gap-it-session-change", refreshSession);
    window.addEventListener("storage", refreshSession);
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const refreshSystemTheme = () => {
      try {
        if (window.localStorage.getItem("gap-it-theme") !== "system") return;
      } catch (error) {
        console.warn("Unable to read the saved theme preference.", error);
        return;
      }
      const next = systemTheme.matches ? "dark" : "light";
      document.documentElement.classList.toggle("dark", next === "dark");
      document.documentElement.style.colorScheme = next;
      setTheme(next);
      window.dispatchEvent(new Event("gap-it-theme-change"));
    };
    systemTheme.addEventListener("change", refreshSystemTheme);
    return () => {
      window.removeEventListener("gap-it-session-change", refreshSession);
      window.removeEventListener("storage", refreshSession);
      systemTheme.removeEventListener("change", refreshSystemTheme);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    const originalThemeColor = document
      .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
      ?.getAttribute("content") ?? null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
    const updateHomeTheme = () => {
      let useSystemTheme = false;
      try {
        useSystemTheme = window.localStorage.getItem("gap-it-theme") === "system";
      } catch (error) {
        console.warn("Unable to read the saved theme preference.", error);
      }
      const dark = useSystemTheme ? systemTheme.matches : root.classList.contains("dark");
      root.classList.toggle("home-fullscreen-theme", true);
      const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (themeColor) themeColor.content = dark ? "#05020C" : "#134E4A";
    };
    root.classList.add("home-fullscreen-theme");
    const observer = new MutationObserver(updateHomeTheme);
    observer.observe(root, { attributes: true, attributeFilter: ["class"] });
    observer.observe(document.head, { childList: true, subtree: true });
    window.addEventListener("gap-it-theme-change", updateHomeTheme);
    window.addEventListener("storage", updateHomeTheme);
    systemTheme.addEventListener("change", updateHomeTheme);
    updateHomeTheme();
    return () => {
      observer.disconnect();
      window.removeEventListener("gap-it-theme-change", updateHomeTheme);
      window.removeEventListener("storage", updateHomeTheme);
      systemTheme.removeEventListener("change", updateHomeTheme);
      root.classList.remove("home-fullscreen-theme");
      const themeColor = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
      if (themeColor && originalThemeColor !== null) themeColor.content = originalThemeColor;
    };
  }, []);

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setSavedTheme(next);
  };

  const signOut = () => {
    clearDemoSession();
    window.dispatchEvent(new Event("gap-it-session-change"));
    window.location.assign("/login?signedOut=1");
  };

  const sendMessage = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError("");
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "").trim();
    const email = String(form.get("email") ?? "").trim();
    const message = String(form.get("message") ?? "").trim();
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message) {
      setFormError(t("auth.invalidContact"));
      return;
    }
    const subject = encodeURIComponent(`GAP-IT website message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name} (${email})`);
    window.location.href = `mailto:${siteInfo.email}?subject=${subject}&body=${body}`;
    setSent(true);
    event.currentTarget.reset();
  };

  return (
    <>
    <div className="relative z-10">
      <HomeGridScan />
      <main className="home-page overflow-x-clip bg-transparent text-[var(--text)]">
          <header className="home-site-nav relative z-[var(--z-sticky)] mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-2 px-4 py-2 sm:px-6" style={{ paddingTop: "max(.5rem, env(safe-area-inset-top))" }}>
            <Link aria-label={t("home.homeLink")} className="shrink-0" href="/"><BrandLogo className="h-auto w-[clamp(100px,16vw,150px)]" priority /></Link>
            <div className="flex shrink-0 items-center gap-2">
              <LanguageSelector />
              <AnimatedThemeToggler isDark={theme === "dark"} label={t("shell.switchTheme", { theme: t(theme === "dark" ? "shell.light" : "shell.dark") })} onToggle={toggleTheme} />
              {session ? (
                <Link className="home-get-started" href="/workspace"><HomeText as="span">{t("home.heroPrimary")}</HomeText></Link>
              ) : (
                <>
                  <Link className="home-get-started home-mobile-get-started" href="/login"><HomeText as="span">{t("home.heroPrimary")}</HomeText></Link>
                  <Link className="home-desktop-login inline-flex min-h-11 items-center rounded-xl bg-[var(--primary)] px-4 text-sm font-bold text-[var(--on-primary)]" href="/login"><HomeText as="span">{t("auth.login")}</HomeText></Link>
                </>
              )}
            </div>
          </header>

      <HomeHero workspaceHref={session ? "/workspace" : "/login"} />
      <HomeProblemSolution />
      <HomeFeatures />
      <HomeProcess />
      <HomeStats />
      <HomeRoles />
      <HomeCallToAction href={session ? "/workspace" : "/login"} />
      <HomeAbout />

      <HomeSection className="home-transparent-section home-contact-section grid max-w-7xl gap-[var(--section-gap)] px-5 py-[var(--section-gap)] sm:px-8 lg:grid-cols-[.9fr_1.1fr]" id="contact" labelledBy="home-contact-title" tint>
        <div>
          <p className="home-contact-label text-sm font-bold uppercase tracking-widest"><HomeText as="span">{t("auth.contact")}</HomeText></p>
          <HomeText as="h2" className="home-contact-heading mt-3 text-3xl font-black sm:text-4xl" id="home-contact-title">{t("auth.contact")}</HomeText>
          <HomeText as="p" className="mt-3 max-w-lg leading-relaxed" hover={false}>{t("auth.aboutIntro")}</HomeText>
          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <ContactCard icon={<IconMail />} title={t("auth.contactEmail")} value={siteInfo.email} />
            <ContactCard icon={<IconPhone />} title={t("auth.contactPhone")} value={siteInfo.phone} />
            <ContactCard icon={<IconMapPin />} title={t("auth.contactLocation")} value={siteInfo.location} />
          </div>
          <HomeText as="p" className="mt-3 text-xs text-[var(--muted)]" hover={false}>{t("auth.placeholderContact")}</HomeText>
        </div>
        <div className="home-contact-form">
          <form className="space-y-4" noValidate onSubmit={sendMessage}>
            <label className="block space-y-1.5 text-sm font-semibold" htmlFor="contact-name"><HomeText as="span" className="block">{t("auth.name")}</HomeText><input className="min-h-12 w-full rounded-xl px-4" id="contact-name" name="name" required /></label>
            <label className="block space-y-1.5 text-sm font-semibold" htmlFor="contact-email"><HomeText as="span" className="block">{t("auth.email")}</HomeText><input className="min-h-12 w-full rounded-xl px-4" id="contact-email" name="email" required type="email" /></label>
            <label className="block space-y-1.5 text-sm font-semibold" htmlFor="contact-message"><HomeText as="span" className="block">{t("auth.message")}</HomeText><textarea className="min-h-32 w-full resize-y rounded-xl p-4" id="contact-message" name="message" required /></label>
            {formError && <HomeText as="p" className="text-sm" role="alert">{formError}</HomeText>}
            {sent && <HomeText as="p" className="text-sm" role="status">{t("auth.messageSent")}</HomeText>}
            <button className="home-contact-submit min-h-12 w-full rounded-xl px-5 font-bold" type="submit"><HomeText as="span">{t("auth.send")}</HomeText></button>
          </form>
        </div>
      </HomeSection>
      </main>

      <HomeTextRevealContext.Provider value>
        <footer className="home-site-footer border-t border-[var(--border)] px-5 py-[var(--space-5)] sm:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <Link aria-label={t("home.homeLink")} className="w-fit" href="/"><BrandLogo className="h-auto w-28" /></Link>
            <nav aria-label={t("home.footerNavigation")} className="flex flex-wrap gap-x-5 gap-y-2">
              <a className="home-footer-link" href="#features"><HomeText as="span">{t("home.featuresTitle")}</HomeText></a>
              <a className="home-footer-link" href="#about"><HomeText as="span">{t("auth.about")}</HomeText></a>
              <a className="home-footer-link" href="#contact"><HomeText as="span">{t("auth.contact")}</HomeText></a>
              <Link className="home-footer-link" href="/login"><HomeText as="span">{t("auth.signIn")}</HomeText></Link>
            </nav>
            <HomeText as="p" className="home-footer-note" hover={false}>{t("home.footerCopyright", { year: year ?? "", brand: siteInfo.copyright, notice: t("shell.demoBanner") })}</HomeText>
          </div>
        </footer>
      </HomeTextRevealContext.Provider>
    </div>
    </>
  );
}

function ContactCard({ icon, title, value }: { icon: React.ReactNode; title: string; value: string }) {
  return <div className="flex min-h-16 items-center gap-3 py-2"><span aria-hidden="true">{icon}</span><div className="min-w-0"><p className="home-contact-label text-xs font-bold uppercase tracking-wide"><HomeText as="span">{title}</HomeText></p><p className="break-words text-sm font-semibold"><HomeText as="span">{value}</HomeText></p></div></div>;
}

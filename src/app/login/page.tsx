"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { AnimatedThemeToggler } from "@/registry/magicui/animated-theme-toggler";
import BorderGlow from "@/components/reactbits/BorderGlow/BorderGlow";
import { LoadingScreen } from "@/components/auth/loading-screen";
import { LanguageSelector } from "@/components/ui/language-selector";
import { BrandLogo } from "@/components/ui/sidebar";
import { useT } from "@/lib/i18n/provider";
import { authenticateDemoAccount, demoAccounts } from "@/lib/auth/demo-accounts";
import { clearDemoSession, readDemoSession, saveDemoSession } from "@/lib/auth/session";
import { getSavedTheme, setSavedTheme } from "@/lib/auth/theme";
import type { LatticeStatus } from "@/components/reactbits/LatticeLoader/LatticeLoader";

function returnPath(): string {
  const candidate = new URLSearchParams(window.location.search).get("returnTo");
  if (!candidate || !candidate.startsWith("/workspace") || candidate.startsWith("//")) return "/workspace";
  return candidate;
}

export default function LoginPage() {
  const { t, language } = useT();
  const [username, setUsername] = useState(demoAccounts[0]?.username ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [loadingStatus, setLoadingStatus] = useState<LatticeStatus | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [lockedUntil, setLockedUntil] = useState(0);
  const [remaining, setRemaining] = useState(0);
  const [mascotState, setMascotState] = useState<"idle" | "walking" | "happy" | "sad">("idle");
  const [isDark, setIsDark] = useState(false);
  const passwordRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (readDemoSession()) {
      window.location.replace(returnPath());
      return;
    }
    const savedTheme = getSavedTheme();
    setIsDark(savedTheme === "dark");
    setSavedTheme(savedTheme);
    if (new URLSearchParams(window.location.search).has("signedOut")) {
      clearDemoSession();
      setNotice(t("auth.signedOut"));
    }
  }, [t]);

  useEffect(() => {
    if (!lockedUntil) return;
    const update = () => {
      const seconds = Math.max(0, Math.ceil((lockedUntil - Date.now()) / 1000));
      setRemaining(seconds);
      if (!seconds) {
        setLockedUntil(0);
        setAttempts(0);
      }
    };
    update();
    const timer = window.setInterval(update, 250);
    return () => window.clearInterval(timer);
  }, [lockedUntil]);

  const toggleTheme = () => {
    const next = isDark ? "light" : "dark";
    setIsDark(next === "dark");
    setSavedTheme(next);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loadingStatus === "loading" || remaining > 0) return;
    setError("");
    const account = authenticateDemoAccount(username, password);
    if (!account) {
      const nextAttempts = attempts + 1;
      setAttempts(nextAttempts);
      setError(t("auth.incorrect"));
      setMascotState("sad");
      passwordRef.current?.focus();
      if (nextAttempts >= 5) setLockedUntil(Date.now() + 30_000);
      return;
    }
    const saved = saveDemoSession({
      role: account.role,
      name: account.name,
      signedInAt: new Date().toISOString(),
    });
    if (!saved) {
      setError(t("auth.signInError"));
      return;
    }
    window.dispatchEvent(new Event("gap-it-session-change"));
    setAttempts(0);
    setMascotState("happy");
    setLoadingStatus("loading");
    await new Promise((resolve) => window.setTimeout(resolve, 800));
    setLoadingStatus("done");
    await new Promise((resolve) => window.setTimeout(resolve, 500));
    window.location.assign(returnPath());
  };

  if (loadingStatus) {
    return (
      <LoadingScreen
        onRetry={() => window.location.reload()}
        onTimeout={() => setLoadingStatus("error")}
        status={loadingStatus}
      />
    );
  }
  const locked = remaining > 0;

  return (
    <main className="login-page relative z-10 isolate flex min-h-dvh flex-col overflow-hidden bg-transparent px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] text-[var(--text)]">
      <header className="relative z-10 mx-auto flex w-full max-w-6xl items-center justify-between gap-3">
        <Link aria-label="GAP-IT home" className="shrink-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]" href="/">
          <BrandLogo className="h-auto w-[clamp(100px,16vw,150px)]" />
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <AnimatedThemeToggler isDark={isDark} label={t("shell.switchTheme", { theme: t(isDark ? "shell.light" : "shell.dark") })} onToggle={toggleTheme} />
        </div>
      </header>
      <section className="relative z-10 mx-auto flex w-full max-w-lg flex-1 flex-col justify-center py-8">
        <BorderGlow
          animated
          backgroundColor="var(--glass-bg)"
          borderRadius={14}
          className="login-glass-card"
          colors={["var(--login-glow-1)", "var(--login-glow-2)", "var(--login-glow-3)"]}
          coneSpread={28}
          edgeSensitivity={59}
          glowColor="var(--login-glow-hsl)"
          glowIntensity={1.9}
          glowRadius={57}
          surfaceIsLight={!isDark}
        >
          <div style={{ padding: "2em" }}>
          <Link aria-label={t("auth.backHome")} className="login-back-home" href="/">
            <ArrowLeft aria-hidden="true" className="login-back-home-icon" size={18} />
            <span>Back to home</span>
          </Link>
          <form className="space-y-5 text-[var(--text)]" onSubmit={submit}>
            <div className="text-center">
              <h1 className="text-2xl font-bold sm:text-3xl">{t("auth.welcome")}</h1>
            </div>
            {notice && <p className="rounded-xl bg-[var(--success-surface)] p-3 text-sm text-[var(--success)]" role="status">{notice}</p>}
            <input autoComplete="username" id="username" name="username" type="hidden" value={username} />
            <div aria-label={t("auth.demoAccounts")} className="space-y-2" role="radiogroup">
              {demoAccounts.map((account) => {
                const label = account.role === "administrator"
                  ? t("roles.admin")
                  : account.role === "operator"
                    ? t("roles.operator")
                    : t("roles.inspector");
                const selected = username === account.username;
                return (
                  <button
                    aria-checked={selected}
                    aria-label={label}
                    className={`flex min-h-12 w-full items-center gap-3 rounded-xl border px-4 py-2 text-start text-sm font-semibold text-[var(--text)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] ${selected ? "border-[var(--primary)] bg-[var(--primary)]/10" : "border-[var(--border)] bg-[var(--surface)]/35 hover:bg-[var(--surface)]/60"}`}
                    key={account.username}
                    onClick={() => {
                      setUsername(account.username);
                      setPassword("");
                      setError("");
                    }}
                    role="radio"
                    type="button"
                  >
                    <span aria-hidden="true" className={`grid size-5 shrink-0 place-items-center rounded-full border ${selected ? "border-[var(--primary)]" : "border-[var(--muted)]"}`}>
                      {selected && <span className="size-2.5 rounded-full bg-[var(--primary)]" />}
                    </span>
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
            <label className="block space-y-1.5 text-sm font-semibold" htmlFor="password">
              <span className="block">{t("auth.password")}</span>
              <span className="login-password-field flex min-h-12 items-center rounded-xl border border-[var(--glass-border)] bg-[var(--surface)]/95">
                <input autoComplete="current-password" className="min-w-0 flex-1 bg-transparent px-4 text-[var(--text)] outline-none placeholder:text-[var(--muted)]" id="password" onChange={(event) => setPassword(event.target.value)} onKeyUp={(event) => setCapsLock(event.getModifierState("CapsLock"))} ref={passwordRef} required type={showPassword ? "text" : "password"} value={password} />
                <button aria-expanded={showPassword} className="min-h-11 shrink-0 rounded-lg px-3 text-sm font-semibold text-[var(--text)] hover:bg-[var(--surface-elevated)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)]" onClick={() => setShowPassword((value) => !value)} type="button">{t(showPassword ? "auth.hidePassword" : "auth.showPassword")}</button>
              </span>
            </label>
            {capsLock && <p className="text-xs text-amber-700 dark:text-amber-300">{t("auth.capsLock")}</p>}
            {error && <p role="alert" className="rounded-xl bg-[var(--danger-surface)] p-3 text-sm text-[var(--danger)]">{error}</p>}
            {locked && <p role="status" className="text-sm font-semibold text-[var(--danger)]">{t("auth.locked", { seconds: new Intl.NumberFormat(language === "ta" ? "ta-IN-u-nu-tamldec" : language === "hi" ? "hi-IN-u-nu-deva" : "en-IN-u-nu-latn").format(remaining) })}</p>}
            <button className="min-h-12 w-full rounded-xl bg-[var(--primary)] px-5 font-bold text-[var(--on-primary)] transition-colors hover:bg-[var(--primary-dark)] disabled:cursor-not-allowed disabled:opacity-50" disabled={locked || loadingStatus === "loading"} type="submit">{t("auth.signIn")}</button>
          </form>
          </div>
        </BorderGlow>
      </section>
    </main>
  );
}

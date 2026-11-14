"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { HomeText, HomeTextRevealContext } from "@/components/home/home-text";
import { HomeGridScan } from "@/components/home/home-grid-scan";
import { useT } from "@/lib/i18n/provider";
import type { TranslationKey } from "@/lib/i18n/types";

export function HomeSection({
  children,
  className = "",
  id,
  labelledBy,
  tint = false,
}: {
  children: ReactNode;
  className?: string;
  id: string;
  labelledBy: string;
  tint?: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const [introReady, setIntroReady] = useState(false);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduceMotion.matches) {
      setRevealed(true);
      setIntroReady(true);
      return;
    }

    const section = sectionRef.current;
    if (!section) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      observer.disconnect();
      setRevealed(true);
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!revealed || introReady) return;
    const timer = window.setTimeout(() => setIntroReady(true), 420);
    return () => window.clearTimeout(timer);
  }, [introReady, revealed]);

  return (
    <HomeTextRevealContext.Provider value={introReady}>
      <section
        aria-labelledby={labelledBy}
        className={`home-section ${tint ? "home-section-tint" : ""} ${className}`.trim()}
        id={id}
        ref={sectionRef}
      >
        <div className={`home-section-content ${revealed ? "is-revealed" : ""}`}>
          {children}
        </div>
      </section>
    </HomeTextRevealContext.Provider>
  );
}

type HomeCopyKey = Extract<TranslationKey, `home.${string}`>;

function SectionHeading({
  eyebrow,
  title,
  id,
}: {
  eyebrow: TranslationKey;
  title: TranslationKey;
  id: string;
}) {
  const { t } = useT();
  return (
    <header className="home-section-heading">
      <p className="home-section-eyebrow"><HomeText as="span">{t(eyebrow)}</HomeText></p>
      <HomeText as="h2" className="home-section-title" id={id}>{t(title)}</HomeText>
    </header>
  );
}

const featureCards: { title: HomeCopyKey; description: HomeCopyKey }[] = [
  { title: "home.featureInspectionsTitle", description: "home.featureInspectionsDescription" },
  { title: "home.featureIssuesTitle", description: "home.featureIssuesDescription" },
  { title: "home.featureReportsTitle", description: "home.featureReportsDescription" },
  { title: "home.featureDashboardsTitle", description: "home.featureDashboardsDescription" },
  { title: "home.featureAccessTitle", description: "home.featureAccessDescription" },
];

export function HomeHero({
  workspaceHref,
  children,
}: {
  workspaceHref: string;
  children: ReactNode;
}) {
  const { t } = useT();
  const router = useRouter();
  const prefetchWorkspace = () => router.prefetch(workspaceHref);
  return (
    <section aria-labelledby="home-hero-title" className="home-hero-section" id="home-hero">
      <div className="home-hero-background">
        <HomeGridScan />
      </div>
      {children}
      <div className="home-hero-content">
        <h1 className="home-hero-title" id="home-hero-title">GAP-IT</h1>
        <p className="home-hero-tagline">{t("auth.tagline")}</p>
        <h2 className="home-hero-heading">{t("home.heroTitle")}</h2>
        <p className="home-hero-description">{t("home.heroDescription")}</p>
        <div className="home-hero-actions">
          <Link className="home-primary-action" href={workspaceHref} onFocus={prefetchWorkspace} onMouseEnter={prefetchWorkspace} onTouchStart={prefetchWorkspace}>
            <HomeText as="span">{t("home.heroPrimary")}</HomeText>
          </Link>
          <a className="home-secondary-action" href="#features">
            <HomeText as="span">{t("home.heroSecondary")}</HomeText>
          </a>
        </div>
      </div>
    </section>
  );
}

export function HomeProblemSolution() {
  const { t } = useT();
  return (
    <HomeSection className="home-problem-section" id="problem" labelledBy="home-problem-title" tint>
      <div className="home-problem-grid">
        <div>
          <SectionHeading eyebrow="home.problemEyebrow" title="home.problemTitle" id="home-problem-title" />
          <HomeText as="p" className="home-section-copy" hover={false}>{t("home.problemDescription")}</HomeText>
        </div>
        <div className="home-solution">
          <p className="home-section-eyebrow"><HomeText as="span">{t("home.solutionEyebrow")}</HomeText></p>
          <HomeText as="h3" className="home-section-title">{t("home.solutionTitle")}</HomeText>
          <HomeText as="p" className="home-section-copy" hover={false}>{t("home.solutionDescription")}</HomeText>
        </div>
      </div>
    </HomeSection>
  );
}

export function HomeFeatures() {
  const { t, language } = useT();
  return (
    <HomeSection className="home-features-section" id="features" labelledBy="home-features-title">
      <SectionHeading eyebrow="home.featuresEyebrow" title="home.featuresTitle" id="home-features-title" />
      <div className="home-feature-grid">
        {featureCards.map(({ title, description }, index) => (
          <article className="home-feature-card" key={title}>
            <p className="home-card-index"><HomeText as="span">{new Intl.NumberFormat(language).format(index + 1)}</HomeText></p>
            <HomeText as="h3" className="home-card-title">{t(title)}</HomeText>
            <HomeText as="p" className="home-card-copy" hover={false}>{t(description)}</HomeText>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}

const processSteps: { title: HomeCopyKey; description: HomeCopyKey }[] = [
  { title: "home.stepCaptureTitle", description: "home.stepCaptureDescription" },
  { title: "home.stepReviewTitle", description: "home.stepReviewDescription" },
  { title: "home.stepRespondTitle", description: "home.stepRespondDescription" },
  { title: "home.stepImproveTitle", description: "home.stepImproveDescription" },
];

export function HomeProcess() {
  const { t, language } = useT();
  return (
    <HomeSection className="home-process-section" id="process" labelledBy="home-process-title" tint>
      <SectionHeading eyebrow="home.processEyebrow" title="home.processTitle" id="home-process-title" />
      <ol className="home-process-grid">
        {processSteps.map(({ title, description }, index) => (
          <li className="home-process-step" key={title}>
            <span aria-hidden="true" className="home-process-connector" />
            <p className="home-step-number"><HomeText as="span">{new Intl.NumberFormat(language).format(index + 1)}</HomeText></p>
            <HomeText as="h3" className="home-card-title">{t(title)}</HomeText>
            <HomeText as="p" className="home-card-copy" hover={false}>{t(description)}</HomeText>
          </li>
        ))}
      </ol>
    </HomeSection>
  );
}

export function HomeStats() {
  const { t, language } = useT();
  const stats: { value: number; label: HomeCopyKey }[] = [
    { value: 5, label: "home.statsModules" },
    { value: 4, label: "home.statsSteps" },
    { value: 3, label: "home.statsRoles" },
  ];
  return (
    <HomeSection className="home-stats-section" id="stats" labelledBy="home-stats-title">
      <div className="home-stats-heading">
        <p className="home-section-eyebrow"><HomeText as="span">{t("home.statsEyebrow")}</HomeText></p>
        <HomeText as="h2" className="home-section-title" id="home-stats-title">{t("home.statsTitle")}</HomeText>
      </div>
      <div className="home-stats-row">
        {stats.map(({ value, label }) => (
          <div className="home-stat" key={label}>
            <p className="home-stat-value"><HomeText as="span">{new Intl.NumberFormat(language).format(value)}</HomeText></p>
            <HomeText as="p" className="home-stat-label">{t(label)}</HomeText>
          </div>
        ))}
      </div>
    </HomeSection>
  );
}

const roleCards: { title: HomeCopyKey; description: HomeCopyKey }[] = [
  { title: "home.roleAdminTitle", description: "home.roleAdminDescription" },
  { title: "home.roleOperatorTitle", description: "home.roleOperatorDescription" },
  { title: "home.roleInspectorTitle", description: "home.roleInspectorDescription" },
];

export function HomeRoles() {
  const { t } = useT();
  return (
    <HomeSection className="home-roles-section" id="roles" labelledBy="home-roles-title" tint>
      <SectionHeading eyebrow="home.rolesEyebrow" title="home.rolesTitle" id="home-roles-title" />
      <div className="home-role-grid">
        {roleCards.map(({ title, description }) => (
          <article className="home-role-card" key={title}>
            <HomeText as="h3" className="home-card-title">{t(title)}</HomeText>
            <HomeText as="p" className="home-card-copy" hover={false}>{t(description)}</HomeText>
          </article>
        ))}
      </div>
    </HomeSection>
  );
}

export function HomeCallToAction({ href }: { href: string }) {
  const { t } = useT();
  return (
    <HomeSection className="home-cta-band" id="get-started" labelledBy="home-cta-title">
      <div className="home-cta-band-copy">
        <HomeText as="h2" className="home-section-title" id="home-cta-title">{t("home.ctaTitle")}</HomeText>
        <HomeText as="p" className="home-section-copy" hover={false}>{t("home.ctaDescription")}</HomeText>
      </div>
      <Link className="home-primary-action" href={href}>
        <HomeText as="span">{t("home.ctaButton")}</HomeText>
      </Link>
    </HomeSection>
  );
}

const aboutFeatures = [
  "aboutExperience.featureMeasurement",
  "aboutExperience.featureSpc",
  "aboutExperience.featureTraceability",
  "aboutExperience.featureDevices",
  "aboutExperience.featureEvents",
] as const;

export function HomeAbout() {
  const { t } = useT();
  return (
    <HomeSection className="home-about-section" id="about-overview" labelledBy="home-about-title" tint>
      <div className="home-about-grid">
        <div className="home-about-copy">
          <SectionHeading eyebrow="home.aboutEyebrow" title="aboutExperience.heading" id="home-about-title" />
          <HomeText as="p" className="home-section-copy" hover={false}>{t("aboutExperience.intro")}</HomeText>
          <ul className="home-about-list">
            {aboutFeatures.map((key) => (
              <li key={key}><HomeText as="span">{t(key)}</HomeText></li>
            ))}
          </ul>
        </div>
        <div aria-hidden="true" className="home-about-visual">
          <span className="home-about-visual-track" />
          <span className="home-about-visual-node home-about-visual-node-one" />
          <span className="home-about-visual-node home-about-visual-node-two" />
          <span className="home-about-visual-node home-about-visual-node-three" />
          <span className="home-about-visual-node home-about-visual-node-four" />
        </div>
      </div>
    </HomeSection>
  );
}

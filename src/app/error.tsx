"use client";

import dynamic from "next/dynamic";

const FuzzyText = dynamic(() => import("@/components/reactbits/FuzzyText/FuzzyText"), { ssr: false });
import { useT } from "@/lib/i18n/provider";

export default function ErrorPage({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  const { t } = useT();
  return (
    <main className="grid min-h-dvh place-items-center bg-[var(--bg)] px-5 py-12 text-center text-[var(--text)]">
      <section className="flex max-w-lg flex-col items-center gap-4 rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow-raised)]">
        <FuzzyText
          color="currentColor"
          colorSplit={0}
          direction="horizontal"
          baseIntensity={0.2}
          hoverIntensity={0.5}
          fuzzRange={30}
          sliceSize={1}
          fps={60}
          transitionDuration={0}
          intro
          introDuration={1400}
          letterSpacing={0}
          enableHover
          clickEffect={false}
          glitchMode={false}
          glitchInterval={2000}
          glitchDuration={200}
        >
          Error
        </FuzzyText>
        <p className="text-lg font-semibold">{t("auth.errorPageMessage")}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button className="inline-flex min-h-11 items-center justify-center rounded-xl bg-[var(--primary)] px-5 font-bold text-[var(--on-primary)]" onClick={reset} type="button">{t("auth.tryAgain")}</button>
          <a className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[var(--border)] px-5 font-bold" href="/workspace?section=overview">{t("auth.backOverview")}</a>
        </div>
      </section>
    </main>
  );
}

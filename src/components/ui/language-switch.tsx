"use client";

import { SegmentedControl } from "@/components/ui/primitives";
import { useT } from "@/lib/i18n/provider";
import type { Language } from "@/lib/i18n/types";

const options: { label: string; value: Language }[] = [
  { label: "English", value: "en" },
  { label: "தமிழ்", value: "ta" },
  { label: "हिन्दी", value: "hi" },
];

export function LanguageSwitch({
  className,
}: {
  className?: string;
}) {
  const { language, setLanguage, t } = useT();

  return (
    <SegmentedControl
      className={className}
      label={t("language.label")}
      onValueChange={(value) => {
        if (value === "en" || value === "ta" || value === "hi") {
          setLanguage(value);
        }
      }}
      options={options}
      value={language}
    />
  );
}

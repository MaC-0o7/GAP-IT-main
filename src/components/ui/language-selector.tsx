"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Check, Languages } from "lucide-react";
import { useT } from "@/lib/i18n/provider";
import type { Language } from "@/lib/i18n/types";
import "./language-selector.css";

const LANGUAGES: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "ml", label: "Malayalam", native: "മലയാളം" },
];

export function LanguageSelector({
  onChange,
}: {
  onChange?: (code: Language) => void;
}) {
  const { language, setLanguage, t } = useT();
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const rootRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLUListElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    setReady(true);
  }, []);

  const positionMenu = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = 190;
    const height = LANGUAGES.length * 44 + 12;
    const below = rect.bottom + 8;
    setPosition({
      top: below + height <= window.innerHeight ? below : Math.max(8, rect.top - height - 8),
      left: Math.max(8, Math.min(window.innerWidth - width - 8, rect.right - width)),
    });
  };

  useEffect(() => {
    if (!open) return;
    positionMenu();
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !rootRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };
    const handleKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && open) {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", positionMenu);
    window.addEventListener("scroll", positionMenu, true);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", positionMenu);
      window.removeEventListener("scroll", positionMenu, true);
    };
  }, [open]);

  const focusOption = (index: number) => {
    optionRefs.current[index]?.focus();
  };

  const openAt = (index: number) => {
    setOpen(true);
    requestAnimationFrame(() => focusOption(index));
  };

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    document.documentElement.lang = code;
    onChange?.(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ) => {
    if (event.key === "ArrowDown" || event.key === "ArrowRight") {
      event.preventDefault();
      focusOption((index + 1) % LANGUAGES.length);
    } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
      event.preventDefault();
      focusOption((index - 1 + LANGUAGES.length) % LANGUAGES.length);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusOption(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusOption(LANGUAGES.length - 1);
    }
  };

  const selectedIndex = LANGUAGES.findIndex(
    ({ code }) => code === language,
  );

  return (
    <div className="lang-selector" ref={rootRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t("language.label")}
        className="lang-btn"
        onClick={() => {
          if (open) {
            setOpen(false);
          } else {
            openAt(selectedIndex >= 0 ? selectedIndex : 0);
          }
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            event.preventDefault();
            openAt(selectedIndex >= 0 ? selectedIndex : 0);
          }
        }}
        ref={triggerRef}
        title={t("language.label")}
        type="button"
      >
        <Languages aria-hidden="true" size={20} />
      </button>

      {ready && open && createPortal(
        <ul
          aria-label={t("language.label")}
          className="lang-menu"
          ref={menuRef}
          role="listbox"
          style={{ top: position.top, left: position.left }}
        >
          {LANGUAGES.map(({ code, label, native }, index) => (
            <li key={code} className="lang-option-container">
              <button
                aria-selected={language === code}
                className={`lang-item ${language === code ? "active" : ""}`}
                onClick={() => selectLanguage(code)}
                onKeyDown={(event) => handleOptionKeyDown(event, index)}
                ref={(element) => {
                  optionRefs.current[index] = element;
                }}
                role="option"
                tabIndex={language === code ? 0 : -1}
                type="button"
              >
                <span>
                  {native} <small>{label}</small>
                </span>
                {language === code && <Check aria-hidden="true" size={16} />}
              </button>
            </li>
          ))}
        </ul>,
        document.body,
      )}
    </div>
  );
}

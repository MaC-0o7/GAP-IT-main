"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import { useT } from "@/lib/i18n/provider";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  rangeStart?: string;
  rangeEnd?: string;
};

function dateParts(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
}

function sameDay(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();
}

export function DatePicker({ value, onChange, className, rangeStart, rangeEnd }: DatePickerProps) {
  const { language, t } = useT();
  const selected = dateParts(value);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [viewDate, setViewDate] = useState(() => {
    const parts = dateParts(value);
    return parts ? new Date(parts.year, parts.month, 1) : new Date(2020, 0, 1);
  });
  const [today, setToday] = useState<Date | null>(null);
  const [focusDate, setFocusDate] = useState(() => {
    const parts = dateParts(value);
    return parts ? new Date(parts.year, parts.month, parts.day) : new Date(2020, 0, 1);
  });
  const [position, setPosition] = useState({ top: 0, left: 8, width: 336 });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const locale = language === "ta"
    ? "ta-IN-u-nu-tamldec"
    : language === "hi"
      ? "hi-IN-u-nu-deva"
      : language === "te"
        ? "te-IN-u-nu-latn"
        : language === "kn"
          ? "kn-IN-u-nu-latn"
          : language === "ml"
            ? "ml-IN-u-nu-latn"
      : "en-IN-u-nu-latn";
  const numberFormat = new Intl.NumberFormat(locale);
  const monthLabel = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" }).format(viewDate);
  const displayedDate = selected
    ? new Intl.DateTimeFormat(locale, { dateStyle: "long", timeZone: "UTC" })
        .format(new Date(Date.UTC(selected.year, selected.month, selected.day)))
    : t("datePicker.chooseDate");
  const weekdays = Array.from({ length: 7 }, (_, index) =>
    new Intl.DateTimeFormat(locale, { weekday: "short", timeZone: "UTC" })
      .format(new Date(Date.UTC(2024, 0, 7 + index))),
  );
  const firstWeekday = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay();
  const daysInMonth = new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate();

  useEffect(() => {
    setReady(true);
    const current = new Date();
    setToday(current);
    if (!value) {
      setViewDate(new Date(current.getFullYear(), current.getMonth(), 1));
      setFocusDate(new Date(current.getFullYear(), current.getMonth(), current.getDate()));
    }
  }, []);

  useEffect(() => {
    const parts = dateParts(value);
    if (parts) {
      setViewDate(new Date(parts.year, parts.month, 1));
      setFocusDate(new Date(parts.year, parts.month, parts.day));
    }
  }, [value]);

  const positionPopup = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0 || rect.height === 0) {
      setOpen(false);
      return;
    }
    const width = Math.min(336, window.innerWidth - 16);
    if (window.matchMedia("(max-width: 767px)").matches) {
      setPosition({ top: window.innerHeight / 2, left: window.innerWidth / 2, width });
      return;
    }
    const height = Math.min(440, window.innerHeight - 16);
    const below = rect.bottom + 8;
    const top = below + height <= window.innerHeight
      ? below
      : Math.max(8, rect.top - height - 8);
    setPosition({
      top: Math.min(top, window.innerHeight - height - 8),
      left: Math.max(8, Math.min(rect.left, window.innerWidth - width - 8)),
      width,
    });
  };

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) requestAnimationFrame(() => triggerRef.current?.focus());
  };

  const openCalendar = () => {
    const base = selected
      ? new Date(selected.year, selected.month, selected.day)
      : today ?? new Date();
    setViewDate(new Date(base.getFullYear(), base.getMonth(), 1));
    setFocusDate(base);
    positionPopup();
    setOpen(true);
    requestAnimationFrame(() => calendarRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus());
  };

  useEffect(() => {
    if (!open) return;
    positionPopup();
    const keyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
      }
    };
    const outside = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !calendarRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) close();
    };
    window.addEventListener("keydown", keyDown);
    window.addEventListener("resize", positionPopup);
    window.addEventListener("scroll", positionPopup, true);
    document.addEventListener("pointerdown", outside);
    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("resize", positionPopup);
      window.removeEventListener("scroll", positionPopup, true);
      document.removeEventListener("pointerdown", outside);
    };
  }, [open]);

  const changeMonth = (amount: number) => {
    setViewDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, 1));
    setFocusDate((current) => new Date(current.getFullYear(), current.getMonth() + amount, Math.min(current.getDate(), new Date(current.getFullYear(), current.getMonth() + amount + 1, 0).getDate())));
  };

  const chooseDay = (day: number) => {
    const year = viewDate.getFullYear();
    const month = String(viewDate.getMonth() + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    onChange(`${year}-${month}-${date}`);
    close();
  };

  const moveFocus = (dayOffset: number) => {
    const next = new Date(focusDate);
    next.setDate(next.getDate() + dayOffset);
    setFocusDate(next);
    setViewDate(new Date(next.getFullYear(), next.getMonth(), 1));
    requestAnimationFrame(() => calendarRef.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus());
  };

  const handleCalendarKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "ArrowLeft") { event.preventDefault(); moveFocus(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); moveFocus(1); }
    if (event.key === "ArrowUp") { event.preventDefault(); moveFocus(-7); }
    if (event.key === "ArrowDown") { event.preventDefault(); moveFocus(7); }
    if (event.key === "PageUp") { event.preventDefault(); changeMonth(-1); }
    if (event.key === "PageDown") { event.preventDefault(); changeMonth(1); }
  };

  return (
    <div>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={selected ? `${t("datePicker.selectedDate")}: ${displayedDate}` : t("datePicker.chooseDate")}
        className={`emerald-input mt-1 flex min-h-11 w-full items-center justify-between gap-2 rounded-lg border px-3 text-left text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${className ?? ""}`}
        onClick={() => open ? close(false) : openCalendar()}
        ref={triggerRef}
        type="button"
      >
        <span>{displayedDate}</span>
        <CalendarDays aria-hidden="true" className="size-4 text-slate-500" />
      </button>
      {ready && open && createPortal(
        <>
          <button aria-label={t("dialog.cancel")} className="fixed inset-0 z-[var(--z-popover)] bg-black/35 md:hidden" onClick={() => close()} tabIndex={-1} type="button" />
          <div
            aria-label={t("datePicker.chooseDate")}
            className="fixed z-[var(--z-popover)] max-h-[min(70dvh,28rem)] overflow-y-auto rounded-2xl border border-slate-200 bg-white p-3 text-slate-900 shadow-2xl dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:mt-0 max-md:-translate-x-1/2 max-md:-translate-y-1/2"
            ref={calendarRef}
            role="dialog"
            style={{ top: position.top, left: position.left, width: position.width }}
            onKeyDown={handleCalendarKeyDown}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <button aria-label={t("datePicker.previousMonth")} className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] dark:hover:bg-slate-800" onClick={() => changeMonth(-1)} type="button"><span aria-hidden="true">‹</span></button>
              <span className="text-center text-base font-bold">{monthLabel}</span>
              <button aria-label={t("datePicker.nextMonth")} className="grid size-11 shrink-0 place-items-center rounded-xl hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[var(--primary)] dark:hover:bg-slate-800" onClick={() => changeMonth(1)} type="button"><span aria-hidden="true">›</span></button>
            </div>
            <div className="grid grid-cols-7 gap-1 text-center">
              {weekdays.map((weekday, index) => <span className="py-1 text-xs font-bold text-slate-600 dark:text-slate-300" key={`${weekday}-${index}`}>{weekday}</span>)}
              {Array.from({ length: firstWeekday }, (_, index) => <span aria-hidden="true" key={`blank-${index}`} />)}
              {Array.from({ length: daysInMonth }, (_, index) => {
                const day = index + 1;
                const currentDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                const isSelected = selected?.year === viewDate.getFullYear() && selected.month === viewDate.getMonth() && selected.day === day;
                const isToday = today ? sameDay(today, currentDate) : false;
                const isFocused = sameDay(focusDate, currentDate);
                const rangeStartDate = rangeStart ? dateParts(rangeStart) : null;
                const rangeEndDate = rangeEnd ? dateParts(rangeEnd) : null;
                const rangeStartValue = rangeStartDate ? new Date(rangeStartDate.year, rangeStartDate.month, rangeStartDate.day).getTime() : null;
                const rangeEndValue = rangeEndDate ? new Date(rangeEndDate.year, rangeEndDate.month, rangeEndDate.day).getTime() : null;
                const currentValue = currentDate.getTime();
                const inRange = rangeStartValue !== null && rangeEndValue !== null &&
                  currentValue > Math.min(rangeStartValue, rangeEndValue) &&
                  currentValue < Math.max(rangeStartValue, rangeEndValue);
                const rangeEndpoint = rangeStartValue === currentValue || rangeEndValue === currentValue;
                return (
                  <button
                    aria-current={isToday ? "date" : undefined}
                    aria-label={`${numberFormat.format(day)} ${monthLabel}`}
                    aria-pressed={isSelected}
                    className={`grid size-11 place-items-center rounded-xl text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--primary)] ${
                      isSelected || rangeEndpoint
                        ? "bg-[var(--primary)] text-[var(--on-primary)] ring-2 ring-[var(--primary)]"
                        : inRange
                          ? "bg-[var(--soft-teal)] text-[var(--primary-dark)]"
                        : isToday
                          ? "border-2 border-[var(--secondary)] bg-white text-[var(--text)]"
                          : "text-[var(--text)] hover:bg-[var(--soft-teal)]"
                    }`}
                    key={day}
                    onClick={() => chooseDay(day)}
                    tabIndex={isFocused ? 0 : -1}
                    type="button"
                  >
                    {numberFormat.format(day)}
                  </button>
                );
              })}
            </div>
          </div>
        </>,
        document.body,
      )}
    </div>
  );
}

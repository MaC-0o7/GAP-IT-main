=== SPEC ===
GOAL: the user picks English, தமிழ் (Tamil) or हिन्दी (Hindi) and EVERYTHING visible changes to that language instantly, without reload, keeping the current page, filters and form values. Nothing user-facing may remain in another language except text the user typed themselves.

WHAT MUST CHANGE (all of it):
1. Interface text: navigation, page titles and descriptions, buttons, tabs, form labels, placeholders, helper and validation messages, table headers, badges, empty states, tooltips, dialogs, toasts, aria-labels, alt text, document title, the demo-data banner, the page language attribute.
2. Numbers: every number follows the language's numerals. Tamil uses Tamil digits (௦ ௧ ௨ ௩ ௪ ௫ ௬ ௭ ௮ ௯), Hindi uses Devanagari digits (० १ २ ३ ४ ५ ६ ७ ८ ९), English uses 0-9. This covers KPI totals, counts, percentages (for example 97%), readings, statistics (mean, standard deviation, Cp, Cpk values), limits, dates and times, page counts, chart ticks, chart tooltips and the number in the donut centre. Use one shared formatter (Intl.NumberFormat / Intl.DateTimeFormat with locales en-IN, ta-IN, hi-IN and numbering systems latn, tamldec, deva) and use it EVERYWHERE; no raw numbers rendered directly. Parsing: form inputs must accept native digits typed by the user and convert them for calculations. Add a "Digits" control in System Settings (Match language / 0-9) with default "Match language", so numbers can be switched back to 0-9.
3. Units and symbols: units are translated (mm becomes மி.மீ in Tamil, मिमी in Hindi; use the same pattern for any other unit found). Statistical symbols such as Cp, Cpk, Pp, Ppk keep their standard notation, but every word around them is translated. Abbreviations in words (SPC, LSL, USL, UCL, LCL, CL, CSV, PDF, MES) show the translated full name as the main text with the abbreviation in brackets, for example the Tamil/Hindi words for "Upper specification limit (USL)". Percent and other punctuation follow the locale.
4. Data content: all seeded demo data and its displayed content is translated: instrument names and types, gateway names and connection types, part names, characteristic names (Width, Length, Diameter, Height), line and station names, operator and user names (transliterated into Tamil and Hindi script), roles, statuses, severities, report names and history entries, quality-event titles, descriptions, notes, resolutions, the activity feed sentences, traceability stage names, and sample messages such as "Length measured 80.796 mm, outside specification". Identifiers such as P001, INS-001 and batch or serial codes are shown with the identifier letters kept but the digits following the numeral rule; if that hurts readability, keep identifiers in 0-9 and tell me in the report.
5. Charts: titles, axis labels, ticks, legends, tooltips, limit labels (LSL, USL, UCL, LCL, CL names), the 30-reading guard message, empty states.
6. Dates: month and weekday names, date and time formats, and relative times ("2 minutes ago") in the chosen language.
7. Files: exported CSV files use column headers, number formatting, date formatting and file names in the chosen language. Use UTF-8 with BOM so Tamil and Hindi open correctly in Excel. Report previews are translated.
8. Browser-controlled text: replace window.confirm, alert and prompt with in-app dialog components so their text and OK/Cancel buttons are translated. Replace native date pickers with a custom date picker (or a text input with translated month names) so the picker language follows the app. Page title and the web app manifest name/description follow the language where possible (dynamic manifest route).

ARCHITECTURE (no libraries):
- src/lib/i18n/en.ts is the typed source of truth; ta.ts and hi.ts use the same type (Dictionary = typeof en), so tsc fails if any key is missing.
- LanguageProvider + useT(): t("nav.overview"), t("events.count", { n }) with {placeholder} interpolation (values formatted through the number formatter before insertion). Separate keys for plural forms. A useFormat() hook exposes formatNumber, formatPercent, formatDate, formatTime, formatRelative, formatUnit.
- Demo content lives in a dictionary section demo.* (names, descriptions, notes, messages) keyed by stable IDs; seeded records reference these keys, never store sentences.
- Saved data (localStorage "gap-it-demo-data") stores codes, IDs and raw numeric values only, never translated text or formatted numbers. Migrate existing English strings to codes; if unknown, keep them as typed. Bump the storage version safely and do not lose user edits.
- Text the user types (new part names, notes, comments, new user names) is shown exactly as typed, because it cannot be auto-translated without an online translation service. Mention this limitation in the final report. Do not add any online translation service or API.
- Default language: saved choice (key "gap-it-language", try/catch), else browser language (ta*, hi*, else en). Set <html lang>. No flash on load.
- Language switch: segmented control "English", "தமிழ்", "हिन्दी" (each in its own script) in the top bar (compact menu on mobile) and in System Settings.
- Fonts: Noto Sans Tamil and Noto Sans Devanagari via next/font (self-hosted, display swap), applied by html[lang]; line-height about 1.6 for Tamil and Hindi; the existing theme fonts remain the Latin fonts.
- Layout: Tamil and Hindi text runs 20 to 40% longer. Fix truncation, overflow and alignment (buttons, tabs, table headers, badges, sidebar, cards, chart legends) at 360px, 768px and 1440px. Wrap or line-clamp; never hide meaning.

TRANSLATION QUALITY: natural, clear UI language, not word-for-word. Keep terms consistent using src/lib/i18n/glossary.md (create it, seeded with): Overview: கண்ணோட்டம் / अवलोकन | Live Measurements: நேரடி அளவீடுகள் / लाइव माप | Instruments & Gateways: கருவிகள் மற்றும் நுழைவாயில்கள் / उपकरण और गेटवे | SPC Analysis: SPC பகுப்பாய்வு / SPC विश्लेषण | SPC Reports: SPC அறிக்கைகள் / SPC रिपोर्ट | Parts & Inspection: பாகங்கள் மற்றும் ஆய்வு / पुर्ज़े और निरीक्षण | Quality Events: தர நிகழ்வுகள் / गुणवत्ता घटनाएँ | Traceability: கண்டறிதல் தன்மை / ट्रेसेबिलिटी | Measurement History: அளவீட்டு வரலாறு / माप इतिहास | User Accounts: பயனர் கணக்குகள் / उपयोगकर्ता खाते | System Settings: கணினி அமைப்புகள் / सिस्टम सेटिंग्स | Pass: தேர்ச்சி / उत्तीर्ण | Fail: தோல்வி / अनुत्तीर्ण | Online: ஆன்லைன் / ऑनलाइन | Offline: ஆஃப்லைன் / ऑफ़लाइन. After each module step, list in I18N_PROGRESS.md the 10 strings you are least sure about so a native speaker can check them.

AUDIT RULE (every step): after translating a module, search its files for anything still in the wrong language or digits: JSX text, placeholder=, aria-label=, title=, alt=, label props, toast and confirm strings, validation messages, Recharts name/label/tickFormatter/tooltip formatters, template strings, raw {number} renderings, .toFixed() and toLocaleString() calls, hard-coded "mm" or "%" strings, hard-coded dates. Route every one through t() or the formatters.

=== CHECKLIST ===
[x] 1. i18n core: dictionaries (en, ta, hi), provider, useT, useFormat (numbers with Tamil/Devanagari digits, dates, times, relative time, units), native-digit input parsing, html lang, persistence, fonts, language switch component, Digits setting
[x] 2. App shell: sidebar, top bar (language switch), mobile menu, page titles and descriptions, document title, demo banner, aria-labels, dynamic manifest name
[x] 3. Shared UI and data model: badges, statuses, severities, roles, units, empty states; in-app dialog component replacing confirm/alert/prompt; custom date picker; convert demo-data.ts and saved data to codes plus raw values; demo.* dictionary with translated names, descriptions, notes and transliterated person names; storage migration
[ ] 4. Overview (KPIs, donut, charts, instruments, activity feed all in the chosen language and digits)
[ ] 5. Live Measurements
[ ] 6. Instruments & Gateways
[ ] 7. SPC Analysis (chart labels, ticks, statistics, limit legends, the 30-reading guard message)
[ ] 8. SPC Reports (report names, filters, history, CSV headers and file names in the chosen language, UTF-8 with BOM)
[ ] 9. Parts & Inspection (forms and validation messages, native-digit input)
[ ] 10. Quality Events
[ ] 11. Traceability
[ ] 12. Measurement History
[ ] 13. User Accounts
[ ] 14. System Settings (language selector, digits control, appearance, measurement, reset-demo confirmation)
[ ] 15. Completeness audit: grep the whole src/ for leftover English text and raw 0-9 numbers; verify en, ta and hi have identical keys (tsc); walk every module in each language and compare with English; check 360px, 768px and 1440px for overflow; full build + tsc; final report with every modified file, known limitations and the least-sure translations

## Step record

- Step completed: 1
- Files modified: `src/lib/i18n/en.ts`, `src/lib/i18n/ta.ts`, `src/lib/i18n/hi.ts`, `src/lib/i18n/types.ts`, `src/lib/i18n/formatters.ts`, `src/lib/i18n/provider.tsx`, `src/components/ui/language-switch.tsx`, `src/app/layout.tsx`, `src/app/globals.css`, `I18N_PROGRESS.md`
- Check: `npm exec -- tsc --noEmit` passed
- Next: Step 2 — App shell.
- Step completed: 2
- Files modified: `src/lib/i18n/en.ts`, `src/lib/i18n/ta.ts`, `src/lib/i18n/hi.ts`, `src/app/page.tsx`, `src/components/ui/sidebar.tsx`, `src/components/workspace-module.tsx`, `I18N_PROGRESS.md`
- Check: `npm exec -- tsc --noEmit` passed
- Next: Step 3 — Shared UI and data model.
- Step completed: 3
- Files modified: `I18N_PROGRESS.md`, `src/app/page.tsx`, `src/components/workspace-module.tsx`, `src/components/ui/date-picker.tsx`, `src/components/ui/dialog.tsx`, `src/lib/demo-data.ts`, `src/lib/i18n/en.ts`, `src/lib/i18n/ta.ts`, `src/lib/i18n/hi.ts`, `src/lib/i18n/glossary.md`
- Check: `npm exec -- tsc --noEmit` passed
- Next: Step 4 — Overview.

## Translation review

### Step 3 — Shared UI and data model: verify these 10 phrases with native speakers

1. "Assembly gateway" — Tamil: "அசெம்ப்ளி நுழைவாயில்"; Hindi: "असेंबली गेटवे"
2. "Finishing gateway" — Tamil: "இறுதிப்பணி நுழைவாயில்"; Hindi: "फ़िनिशिंग गेटवे"
3. "Laser displacement" — Tamil: "லேசர் இடப்பெயர்வு அளவி"; Hindi: "लेज़र विस्थापन मापक"
4. "Reference gauge" — Tamil: "குறிப்பு அளவுகோல்"; Hindi: "संदर्भ गेज"
5. "Mounting bracket" — Tamil: "பொருத்து அடைப்பான்"; Hindi: "माउंटिंग ब्रैकेट"
6. "Rotor housing" — Tamil: "சுழலி உறை"; Hindi: "रोटर हाउसिंग"
7. "Valve stem" — Tamil: "வால்வு தண்டு"; Hindi: "वाल्व स्टेम"
8. "Out-of-tolerance measurement" — Tamil: "சகிப்புத்தன்மைக்கு வெளியான அளவீடு"; Hindi: "सहन-सीमा से बाहर माप"
9. "Investigating" — Tamil: "விசாரிக்கப்படுகிறது"; Hindi: "जाँच जारी"
10. "outside specification" — Tamil: "விவரக்குறிப்பு வரம்புக்கு வெளியே"; Hindi: "विनिर्देश सीमा से बाहर"

- Tamil: "கண்ணோட்டக் கட்டுப்பாட்டுப் பலகம்" (Overview Dashboard)
- Hindi: "अवलोकन डैशबोर्ड" (Overview Dashboard)
- Tamil: "தரச் செயல்பாடுகள்" (Quality Operations)
- Hindi: "गुणवत्ता संचालन" (Quality Operations)
- Tamil: "நுழைவாயில்கள்" (Gateways)
- Hindi: "गेटवे" (Gateways)
- Tamil: "கண்காணிப்பு" (Monitoring)
- Hindi: "मूविंग-रेंज चार्ट" (Moving-range chart)
- Tamil: "செயல்திறன் மதிப்பீடுகள்" (Capability estimates)
- Hindi: "திறன் மதிப்பீடுகள்" (Capability estimates)

## Repo notes
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/ui/sidebar.tsx`
- `src/components/ui/primitives.tsx`
- `src/components/workspace-module.tsx`
- `src/app/globals.css`
- `public/`

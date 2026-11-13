## Checklist

- [ ] 1. Baseline: run the type-check and `npm run build`; fix every error and warning. List every interactive component in the app (buttons, links, tabs, dropdowns, switches, segmented controls, search fields, date inputs, forms, dialogs, charts with controls, export actions) grouped by module in the Test matrix.
- [ ] 2. Global robustness: add src/app/error.tsx and src/app/not-found.tsx (translated, themed, with a "Try again" and "Back to Overview" action); make all localStorage reads and writes safe (try/catch, validate shape, recover from corrupt data); fix hydration issues (no Date.now, Math.random or window use during server render); make sure timers and intervals are cleaned up.
- [ ] 3. App shell and navigation: sidebar, mobile drawer or menu, top bar, active tab states, browser Back and Forward between sections (history), refresh keeps the current section, language switch (all three languages, persists), theme switch (light, dark, system, persists), notifications or user menu if present, the ripple background does not block any control.
- [ ] 4. Overview: KPI cards, date-range dropdown, charts, donut, device status, "View all" links, recent activity; all values derive from the shared demo data and update when data changes.
- [ ] 5. Live Measurements: start, pause and resume the simulated stream, filters (line, part, time), new readings appear and are saved, pass/fail logic against the specification limits, CSV export of the filtered data (file downloads, opens correctly, Tamil and Hindi text intact), the stream stops on leaving the page.
- [ ] 6. Instruments & Gateways: list, status badges, add or edit instrument, simulated status actions (they change only local demo records), search and filters, empty state.
- [ ] 7. SPC Analysis: part, characteristic and date filters, the individuals chart with control limits drawn apart from specification limits and a legend, histogram, statistics, the 30-reading guard for Cp/Cpk, empty and too-few-readings states.
- [ ] 8. SPC Reports: report type, part and date filters, Generate, previews, report history, CSV export, empty state.
- [ ] 9. Parts & Inspection: tabs (parts, inspection plans, sampling, results), create and edit part and characteristic with validation (nominal, LSL, USL, units), duplicate detection, status changes, search.
- [ ] 10. Quality Events: list and filters, create event, assignment, investigation notes, acknowledge, resolve and reopen, status and severity badges, persistence.
- [ ] 11. Traceability: search by part, batch, serial and measurement, results and timeline, links to related records, no-result state.
- [ ] 12. Measurement History: search, filters, date range (start not after end), pagination or scrolling, sorting, CSV export of exactly the filtered rows.
- [ ] 13. User Accounts: list, add and edit demo user, role and status controls, validation (email format, required name), confirmation for destructive actions, a clear note that roles are a demo and not real security.
- [ ] 14. System Settings: general, measurement, appearance (theme, language, digits) and demo-data settings, Save and cancel behaviour, "Reset demo workspace" with a confirmation dialog that really restores the seeded data, settings persist after refresh.
- [ ] 15. Cross-checks: repeat the key flows of every module in light and dark themes, in English, Tamil and Hindi, and at 360px and 390px; fix anything that breaks (clipped text, unreachable buttons, overflow, unreadable contrast).
- [ ] 16. Final pass: `npm run build` and the type-check pass with no errors; no console errors or warnings in any module; print the Test matrix summary (counts of OK, Fixed, Needs manual check), list every file modified, and list every "Needs manual check" item so I can click through it myself.

## Repo notes

- src/app/

## Test matrix

| Module | Element | Expected behaviour | Status OK / Fixed / Needs manual check | Note |
|---|---|---|---|---|
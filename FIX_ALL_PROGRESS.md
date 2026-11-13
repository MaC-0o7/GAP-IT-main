# Baseline validation

- `npm exec -- tsc --noEmit` — passed
- `npm run build` — passed

## Current checkpoint

- Completed checklist steps 1–3.
- Browser smoke checks covered the home and workspace at 360, 390, 768, and 1440 px; the mobile drawer exposes all 11 modules; the measurement-history calendar stays in the viewport and closes when its trigger is hidden after a breakpoint change; language and theme menus remain layered correctly.
- Tamil was also checked at 360 and 390 px without horizontal overflow.
- Next: step 4 — Overview and Live Measurements.

## Checklist

- [x] 1. Baseline: run the type-check and `npm run build`; fix every error and warning. Write the exact working commands at the top of FIX_ALL_PROGRESS.md.
- [x] 2. Global robustness: add src/app/error.tsx and src/app/not-found.tsx (translated, themed, "Try again" and "Back to Overview"); make every localStorage read and write safe; fix hydration issues (no Date.now, Math.random or window use during server render); clean up timers and listeners; remove duplicate or unused code that causes warnings.
- [x] 3. Global layout and layering: app shell, sidebar, mobile drawer, top bar, language and theme controls, shared popover/calendar/dropdown layering, z-index scale, safe areas, the ripple background not blocking any control, no horizontal scroll anywhere.
- [ ] 4. Overview and Live Measurements: all buttons, filters, charts, stream start/pause/resume, CSV export, cards and tables, layout checks.
- [ ] 5. Instruments & Gateways and Parts & Inspection: lists, add and edit forms with validation, tabs, status actions, search, empty states, layout checks.
- [ ] 6. SPC Analysis and SPC Reports: filters, calendars, charts and legends, the 30-reading guard, report generation, history and export, layout checks.
- [ ] 7. Quality Events, Traceability and Measurement History: create, assign, acknowledge, resolve flows, searches and filters, date ranges, pagination and sorting, CSV export of exactly the filtered rows, layout checks.
- [ ] 8. User Accounts and System Settings: add and edit user, roles and status, confirmation dialogs, settings save and cancel, language, theme and digits controls, "Reset demo workspace" that really restores the seeded data, layout checks.
- [ ] 9. Cross-check: repeat the main flows of all modules in light and dark, in English, Tamil and Hindi, and at 360px and 390px; fix what breaks.
- [ ] 10. Final pass: `npm run build` and the type-check pass with no errors; no console errors or warnings; print the Defect log summary (counts Fixed and Needs manual check), list every file modified, and list every "Needs manual check" item for me to click through.

## Repo notes

- src/app/
- src/components/

## Defect log

| Area | Problem | Fix | Status Fixed / Needs manual check |
|---|---|---|---|
| Global robustness | Error screens returned users to Home instead of the workspace overview; some timer callbacks could outlive their components; language selection wrote an unused duplicate preference key; browser-storage failures in language/theme/session helpers were hidden. | Add localized overview navigation, cancel UI timers/animations on cleanup, keep language persistence in the provider, surface storage errors, and show the workspace warning when theme storage fails. | Fixed |
| Global layering | The language menu's z-index scale was overridden, several shell layers used hard-coded z-index values, and the decorative ripple backdrop could receive pointer events. | Use the shared z-index variables for shell/menu layers and make the backdrop non-interactive. | Fixed |
| Global layering | A calendar opened on mobile remained in its portal after resizing to desktop, where its trigger was hidden. | Close the calendar when resize/scroll repositioning finds its trigger has no visible bounds. Confirmed responsive widths, mobile navigation, language/theme controls, and calendar positioning. | Fixed |

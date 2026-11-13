## Checklist

- [ ] 1. Diagnose SPC Reports: find the date fields and calendar there, and note which parent (overflow-hidden, overflow-auto, transform, backdrop-filter, filter, isolation, low z-index) clips or covers it. Note whether a shared Popover already exists. No code changes.
- [ ] 2. Fix the SPC Reports calendar using the portal approach above, so it displays fully on top of the report cards, preview and history table below it (both date fields: from and to).
- [ ] 3. Make the calendar clear: larger day numbers, strong contrast for selected, today and range days, translated month and weekday names, language digits, and the mobile bottom sheet.
- [ ] 4. Apply the same shared calendar and popover to the other places that use the same date control (other modules) only if they use the same component; do not change anything else.
- [ ] 5. Check at 360px, 390px, 768px and 1440px, in light and dark, in English, Tamil and Hindi: with the report table directly below the field, with the field near the bottom of the screen (it must flip above), and with a long date range selected. No clipping, no horizontal scroll, the ripple background does not block clicks.
- [ ] 6. Final pass: `npm run build` and the type-check, then list every file modified.

## Repo notes

- src/components/workspace-module.tsx
- src/components/ui/date-picker.tsx
- No shared Popover found
- src/app/globals.css

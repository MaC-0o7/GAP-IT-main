## Checklist

- [ ] 1. Diagnose: find every date input, calendar, date-range control and popup (dropdowns, selects, menus, tooltips, language and theme menus). Note in Repo notes which parent has overflow-hidden / overflow-auto, transform, backdrop-filter, filter, isolation or a low z-index that causes the popup to be covered or clipped. Make no code changes.
- [ ] 2. Create one shared Popover (portal + fixed positioning + flip + outside click + Escape + focus return + resize/scroll repositioning) in src/components/ui/, with a CSS z-index scale in globals.css.
- [ ] 3. Rebuild the calendar on top of the shared Popover (or fix the existing custom date picker to use it): solid themed surface, translated month and weekday names, language digits, keyboard support, mobile bottom sheet.
- [ ] 4. Apply the calendar everywhere it is used: Overview date range, Live Measurements time filter, SPC Analysis date range, SPC Reports date range, Measurement History date range, Quality Events and any other date field. Verify the popup is fully visible above the tables and charts below each field.
- [ ] 5. Apply the shared Popover to the other dropdowns and menus that can be clipped by tables or cards (select and dropdown controls, language menu, theme menu, user menu, tooltips).
- [ ] 6. Check at 360px, 390px, 768px and 1440px, in light and dark, in English, Tamil and Hindi, with a table directly below the field and with the field near the bottom of the screen (it must flip above). No horizontal scroll, no clipping, no layout shift, the ripple background does not block clicks on the popup.
- [ ] 7. Final pass: `npm run build` and the type-check, then list every file modified.

## Repo notes

src/components/ui/date-picker.tsx
src/components/ui/primitives.tsx
src/components/workspace-module.tsx
src/app/globals.css

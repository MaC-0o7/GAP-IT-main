=== CHECKLIST ===
[x] 1. Find the language switch and how it is placed on mobile (inside the top bar, inside the mobile menu, or a fixed/absolute floating button). Write what you found in the Repo notes: file, where it sits and which classes push it into the corner.
[x] 2. Fix the placement. If it is in the top bar: give the right side of the header a flex row with gap-2 and padding that includes the safe area (for example pe-[max(0.75rem,env(safe-area-inset-right))]), keep the language button as the last item with shrink-0, and stop it from touching the screen edge. If it is a floating button: position it with offsets that include the safe area (for example top-[max(0.75rem,env(safe-area-inset-top))] and right-[max(0.75rem,env(safe-area-inset-right))]) and give it a z-index above the page content but below dialogs. Do not let it cover the logo, the page title or other buttons.
[ ] 3. Make it compact on mobile: show a globe icon plus a short label of the current language (EN, தமிழ், हिन्दी) and hide the long text below md (max-md:hidden on the long label only). Keep the full segmented control or labels on md and up. Keep an accessible aria-label that is translated.
[ ] 4. Make the language menu open fully inside the screen: anchor it to the button, align it to the right edge on mobile, give it max-width calc(100vw - 2rem), solid or nearly opaque background, rounded corners and 44px-high options. It must close on selecting a language, on tapping outside and on Escape. Selecting a language keeps the current page and form values.
[ ] 5. Check at 360px, 390px, 768px and 1440px in light and dark, in English, Tamil and Hindi: button not in the corner, space around it, no overlap with the logo, theme switch or menu button, no clipping, no horizontal scroll, desktop unchanged. Fix only what fails.
[ ] 6. Final pass: run `npm run build` and the type-check, then list every file modified.

## Repo notes
- `src/components/ui/language-selector.tsx` — mobile top-bar language button, rendered as the final item in the header; its dropdown uses `lang-menu` CSS positioning.
- `src/app/page.tsx` — mobile top bar has `flex ... gap-2 ... px-3`; selector has no corner/floating positioning classes. A second full `LanguageSwitch` is also present inside the hamburger drawer.
- `src/components/ui/language-switch.tsx` — full-width segmented choices in the mobile drawer.
- `src/components/ui/language-selector.css` — button and dropdown placement styles.
- `src/components/ui/sidebar.tsx`
- `src/app/globals.css`

## Step record

- Task completed: 1 — Located both language controls and their mobile placements.
- Files changed: `LANG_BUTTON_PROGRESS.md` only
- Check: `node node_modules/typescript/bin/tsc --noEmit` passed
- Note: The top-bar control is the final flex item, not a floating button; its compact icon sits at the far end of a `px-3` mobile header. The drawer also has a full segmented language switch.
- Next: Task 2 — Add safe-area padding and spacing to the mobile top bar.
- Task completed: 2 — Added safe-area-aware header padding and grouped the right-side actions with consistent spacing.
- Files changed: `src/app/page.tsx`, `LANG_BUTTON_PROGRESS.md`
- Check: `node node_modules/typescript/bin/tsc --noEmit` passed
- Note: Mobile language control remains the last action with a safe 12px minimum right inset; desktop header is untouched.
- Next: Task 3 — Make the language button compact with a current-language label.

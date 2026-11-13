Type-check command: `node node_modules/typescript/bin/tsc --noEmit`

=== CHECKLIST ===
[x] 1. Created src/components/ui/background-ripple-effect.tsx, src/components/app-background.tsx and the globals.css animation/reduced-motion CSS.
[x] 2. Make the type-check work: run npm install if needed, then the tsc command above. Write the exact working command at the top of RIPPLE_PROGRESS.md. Also confirm src/lib/utils.ts exports cn and that globals.css contains the --animate-cell-ripple variable, the cell-ripple keyframes and the reduced-motion rule.
[ ] 3. SHOW THE BACKGROUND (this is why nothing appears yet): find the component that renders the main content area (the one that places the sidebar and the page content). Import { AppBackground } from "@/components/app-background" and render <AppBackground /> as the first child of the main content wrapper in the app shell, so it sits behind every page. Give that wrapper relative positioning and the page content relative z-10. Keep the frosted sidebar and top bar above it. Then find anything that hides it: any opaque background (bg-white, bg-background, bg-[#...], gradient layers, the old faint grid/pattern in globals.css) on the body, the main wrapper or full-width page containers that sit above the grid. Make those wrappers transparent so the grid shows; only cards, charts, tables and forms keep solid surfaces. Remove the old faint grid pattern so there is only one grid; keep the soft radial glows.
[ ] 4. Theme check: make sure the dark: variant follows the app's real theme switch. Look at how dark mode is applied (class "dark" or a data attribute on <html>) and make sure globals.css has a matching @custom-variant dark (for example @custom-variant dark (&:where(.dark, .dark *));). Confirm the light theme shows teal-tinted cells (#E6F7F5 fill, #B7E4DE border) and the dark theme shows purple-tinted cells (#1A1333 fill, #2A1F4D border, soft purple inner glow). Check text contrast over the grid on every module in both themes.
[ ] 5. Responsive and motion check at 360px, 390px, 768px and 1440px: no horizontal scroll, no layout shift, the ripple works when clicking a visible part of the grid, reduced-motion turns the animation off. If the grid looks busy on data-heavy pages (SPC Analysis, Measurement History), say so in the note but do not remove it.
[ ] 6. Final pass: run npm run build and the type-check, then list every file created or modified across all tasks.

## Step record

- Task completed: 1 — Created the ripple grid, app background wrapper, animation tokens and reduced-motion rule.
- Files changed: `src/components/ui/background-ripple-effect.tsx`, `src/components/app-background.tsx`, `src/app/globals.css`, `RIPPLE_PROGRESS.md`
- Check: `npm exec -- tsc --noEmit` passed
- Note: `src/lib/utils.ts` already existed; retained its `cn` helper. The grid component is ready for integration in Task 2.
- Task completed: 2 — Confirmed TypeScript check and ripple prerequisites.
- Files changed: `RIPPLE_PROGRESS.md` only; `src/lib/utils.ts` exports `cn`, and `globals.css` includes the animation variable, keyframes and reduced-motion rule.
- Check: `node node_modules/typescript/bin/tsc --noEmit` passed
- Note: TypeScript is installed; no install was needed. The command above is the working type-check command for later tasks.
- Next: Task 3 — Integrate AppBackground into the app content wrapper.

## Repo notes
- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/components/ui/sidebar.tsx`
- `src/app/globals.css`
- `src/lib/utils.ts`

# Home GridScan and Smoothness Progress

## Checklist

- [x] 1. Download GridScan without a CLI, confirm its dependencies are empty, and guard `WEBGL_lose_context` cleanup so it only runs in production.
- [ ] 2. Add a hydration-safe HomeGridScan that follows the active light, dark, or system theme, selects the specified colors, and uses DPR 1 below 768px.
- [ ] 3. Replace the Home hero's ShapeWaves with a full-screen GridScan hero; preserve header, translated tagline, navigation, and clickable About controls.
- [ ] 4. Keep the hero usable without WebGL2; respect reduced motion, pause when off-screen or hidden, and preserve About interactions.
- [ ] 5. Check responsive Home layouts, themes, and translations at the specified sizes/orientations; confirm only approved files have changed.
- [ ] 6. Add global motion tokens and reduced-motion behavior; replace broad transitions, improve touch/scroll behavior, and avoid permanent `will-change`.
- [ ] 7. Add non-blocking route transitions and prefetching; remove artificial loading delays and improve About/workspace transitions.
- [ ] 8. Lazy-load heavy effects, add low-power handling, pause inactive effects, and cap low-power canvas frame rates.
- [ ] 9. Improve workspace rendering, charts, live updates, tables, and section loading while preserving behavior.
- [ ] 10. Standardize component transitions, theme switching, fonts, and layout-stable image/chart placeholders.
- [ ] 11. Improve mobile smoothness, blur and viewport handling, and check Home, Login, Workspace, and About interactions.
- [ ] 12. Build and measure route bundles; record remaining large bundles, verification notes, and manual Lighthouse/phone steps.
- [ ] 13. Run final build and type-check; list changed files and all manual checks still needed.

## Repo notes

- Home page: `src/app/page.tsx`
- Header: `src/app/page.tsx`
- Hero: `src/app/page.tsx`
- ShapeWaves usages: `src/components/reactbits/ShapeWaves/ShapeWaves.tsx`
- Theme helper: `src/lib/auth/theme.ts`
- i18n files: `src/lib/i18n/`
- Global styles: `src/app/globals.css`
- Layout: `src/app/layout.tsx`
- Workspace page: `src/app/workspace/page.tsx`
- Workspace module: `src/components/workspace-module.tsx`
- Loading screen: `src/components/auth/loading-screen.tsx`

## Task 1 note

GridScan downloaded with no dependencies; context loss now runs only in production.

Files changed: `HOME_GRIDSCAN_PROGRESS.md`, `src/components/reactbits/GridScan/GridScan.tsx`

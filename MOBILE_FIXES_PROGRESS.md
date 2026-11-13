=== CHECKLIST ===
[x] 1. Top bar: hide the "Quality Operations" text beside the GAP-IT logo below md. Keep it from md up. (Skip and tick if already done.)
[x] 2. Top bar: hide the "Overview" label/button to the right of the logo below md, together with everything that opens from it (the dropdown, menu or list of remaining pages), so none of it is visible or tappable on mobile and Android. Keep it unchanged from md up. Do NOT remove the page's own heading in the content area.
[x] 3. Navigation check: confirm that mobile and Android users can still reach all 11 modules by another route (the existing sidebar drawer, hamburger button or bottom navigation). If one exists, leave it as it is. If none exists, tell me in the note and do not add anything yet.
[ ] 4. Header check at 360px, 390px, 768px and 1440px: logo and actions line up with no gaps or overflow; fix only spacing or alignment problems caused by the hidden elements.

## Step record

- Task completed: 1 — Top bar, Quality Operations text
- Files changed: `src/app/page.tsx`
- Check: `npm exec -- tsc --noEmit` passed
- Task completed: 2 — Top bar, Overview label
- Files changed: `src/app/page.tsx`
- Check: `npm exec -- tsc --noEmit` passed
- Note: The Overview label is hidden in the mobile top bar. Its navigation stays in the sidebar drawer; the content page heading is unchanged.
- Task completed: 3 — Navigation check
- Files changed: `MOBILE_FIXES_PROGRESS.md` only; no code change was needed
- Check: `npm exec -- tsc --noEmit` passed
- Note: The mobile hamburger opens the sidebar drawer, whose grouped navigation includes all 11 modules.
- Next: Task 4 — Check header alignment at 360px, 390px, 768px and 1440px.

## Repo notes
- `src/app/page.tsx`
- `src/components/ui/sidebar.tsx`
- `src/app/layout.tsx`

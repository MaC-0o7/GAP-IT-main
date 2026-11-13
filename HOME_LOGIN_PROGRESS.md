## Checklist

<<<<<<< HEAD
- [x] 1. Routes: move the workspace to /workspace, create / and /login placeholders, redirects, manifest start_url and scope, link updates, section history still works.
=======
- [ ] 1. Routes: move the workspace to /workspace, create / and /login placeholders, redirects, manifest start_url and scope, link updates, section history still works.
>>>>>>> c2d776c38fb62115423eb675283dd0259b69a963
- [ ] 2. Auth and roles: demo-accounts.ts, session helper, route guard, sign out, permissions.ts, usePermission hook.
- [ ] 3. Effects part 1: ShapeWaves and BorderGlow.
- [ ] 4. Effects part 2: ScrambledText and FuzzyText.
- [ ] 5. Mascots: Mr. Gap-It and Mr. Spot-It with all states.
- [ ] 6. BranchedMenu (desktop portal dropdown, mobile drawer, keyboard support).
- [ ] 7. Home page: header, hero, About, Contact (placeholders in site-info.ts), footer.
- [ ] 8. Login page: layout, form, demo account boxes, mascot track, wrong-password handling and 30-second lockout.
- [ ] 9. Loading screen, No-access screen and Not-found screen with mascots.
- [ ] 10. Role enforcement inside the workspace: sidebar filtering, button gating and read-only states, forbidden-section screen, user menu with role and Sign out.
- [ ] 11. Translations (English, Tamil, Hindi) for every new string, native digits; list the 10 least-sure translations in the progress file.
- [ ] 12. Cross-checks: both themes, three languages, 360/390/768/1440px, keyboard use, reduced motion, performance, console clean; fix what breaks.
- [ ] 13. Final pass: `npm run build` and the type-check; list every file created or modified, known limitations and every "Needs manual check" item.

## Repo notes

- src/app/
- src/components/workspace-module.tsx
- src/components/ui/sidebar.tsx
- src/components/ui/language-selector.tsx
- src/app/globals.css
- public/
<<<<<<< HEAD

## Task notes

Files changed:
- public/manifest.webmanifest
- src/app/page.tsx
- src/app/login/page.tsx
- src/app/workspace/page.tsx
- src/components/ui/sidebar.tsx

Moved the existing workspace route to /workspace and added public-home and login placeholders; updated workspace links and the manifest start URL.
=======
>>>>>>> c2d776c38fb62115423eb675283dd0259b69a963

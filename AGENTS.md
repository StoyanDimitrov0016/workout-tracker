# Repository Guidelines

## Project Structure & Module Organization

- `app/` holds the Expo Router screens and layouts (e.g., `(tabs)/`, `(auth)/`).
- `components/`, `hooks/`, and `constants/` contain shared UI pieces, hooks, and app constants.
- `assets/` stores images and other static resources.
- `convex/` contains backend schema/functions and generated client types (`_generated/`).
- Config and styling live at the repo root (`app.json`, `tailwind.config.js`, `global.css`).

## Build, Test, and Development Commands

- `npm install` installs dependencies.
- `npm run start` starts the Expo dev server.
- `npm run android` / `npm run ios` / `npm run web` run the app on specific targets.
- `npm run lint` runs ESLint (Expo config).
- `npm run format` / `npm run format:check` format or validate formatting with Prettier.
- `npm run reset-project` resets the starter scaffold (see `scripts/reset-project.js`).

## Coding Style & Naming Conventions

- TypeScript + React Native (Expo). Use 2-space indentation and semicolons.
- Prettier is the source of truth (see `.prettierrc`); run `npm run format` before PRs.
- Tailwind via NativeWind; prefer `className` for styling and keep utility order stable.
- File and folder names are lowercase with hyphens or parentheses for route groups (Expo Router).

## Testing Guidelines

- No test runner is configured in `package.json` yet.
- If you add tests, document the commands here and align file naming with the chosen tool�s defaults.

## Commit & Pull Request Guidelines

- Follow the existing commit style: `<type>: <short description>` (e.g., `feat: add tabs`, `deps: add Convex`, `chore: update config`).
- Keep commits focused and avoid mixing refactors with feature changes.
- PRs should include a clear description, linked issues (if any), and screenshots/GIFs for UI changes.

## Security & Configuration Tips

- Local secrets belong in `.env.local`; do not commit them.
- Double-check `app.json` and `convex/` changes for environment-specific values before merging.

# Repository Guidelines

## Project Structure & Module Organization

- `app/` contains Expo Router screens and layouts, including route groups like `(tabs)/` and `(auth)/`.
- Shared UI, hooks, and constants live in `components/`, `hooks/`, and `constants/`.
- `features/` holds domain-specific modules and screens.
- `assets/` stores images and other static files.
- `convex/` contains backend schema/functions and generated client types in `_generated/`.
- Root config and styling files include `app.json`, `global.css`, `tailwind.config.js`, and `eslint.config.js`.

## Build, Test, and Development Commands

- `npm install`: install dependencies.
- `npm run start`: start the Expo dev server.
- `npm run android` / `npm run ios` / `npm run web`: run the app on a specific platform.
- `npm run lint`: run ESLint with the Expo config.
- `npm run format` / `npm run format:check`: format or validate formatting with Prettier.
- `npm run reset-project`: reset the starter scaffold (see `scripts/reset-project.js`).

## Coding Style & Naming Conventions

- TypeScript + React Native (Expo). Use 2-space indentation and semicolons.
- Prettier is the source of truth (`.prettierrc`); run formatting before PRs.
- Tailwind via NativeWind; prefer `className` and keep utility order stable.
- File and folder names are lowercase with hyphens; route groups use parentheses.

## Testing Guidelines

- No test runner is configured yet. If you add one, document the command(s) here and follow the tool’s default naming patterns (for example, `*.test.ts` or `*.spec.ts`).

## Commit & Pull Request Guidelines

- Commit style: `<type>: <short description>` (e.g., `feat: add tabs`, `chore: update config`).
- Keep commits focused; avoid mixing refactors with feature changes.
- PRs should include a clear description, linked issues (if any), and screenshots/GIFs for UI changes.

## Security & Configuration Tips

- Local secrets belong in `.env.local`; do not commit them.
- Double-check `app.json` and `convex/` changes for environment-specific values before merging.

# Workout Tracker

Expo + React Native workout tracking app with Clerk authentication and Convex-backed workout, split, and measurement data.

## Development

Install dependencies:

```bash
npm install
```

Start the Expo dev server:

```bash
npm run start
```

Run a platform target directly:

```bash
npm run android
npm run ios
npm run web
```

## Quality checks

Lint the project:

```bash
npm run lint
```

Format the codebase:

```bash
npm run format
```

Check formatting without changing files:

```bash
npm run format:check
```

## Project notes

- App routes live in `app/` and domain features live in `features/`.
- Convex backend code lives in `convex/`.
- Current planning and follow-up work is tracked in `docs/roadmap.md`.
- Temporary dependency workarounds are tracked in `CLEANUP.md`.
- Local secrets should stay in `.env.local`.

More complete setup documentation can be added in a dedicated `docs/project-setup` pass.

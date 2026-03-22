# Workout Tracker Finish Roadmap

## Goal

Turn the current app into a reliable gym companion that supports:

- planning a split
- running a workout session in the gym
- saving workout history
- reviewing progress over time
- staying safe to operate without surprise backend usage

## Current State

The app already has the core product surface:

- auth with Clerk
- Convex backend
- split creation and editing
- weight logging
- circumference logging
- persisted workout sessions
- workout completion summary
- workout statistics
- workout history with session detail
- split target validation
- overview driven by the split and same-weekday workout history
- measurement save feedback
- backend usage guards
- feature-owned resource objects for statistics, sessions, measurements, and splits
- shared route-param validation
- thin tab route files with feature-owned screen components

The main remaining work is now maintenance, setup clarity, and selective polish.

## Delivery Order

### 1. Persist workout sessions

Create a real session model in Convex and refactor `Start session` to save and resume workouts.

Status:

- completed

Task file:

- [workout-session-persistence.md](./tasks/workout-session-persistence.md)

### 2. Build workout history and statistics

Use saved workout sessions to power:

- recent sessions
- exercise progression
- total sets, reps, and volume
- consistency by weekday

Status:

- completed

### 3. Tighten split-builder validation

Prevent invalid split targets from being saved silently.

Status:

- completed

### 4. Improve overview, measurements, and core workflow UX

Included:

- overview insights
- workout history detail access
- workout completion summary
- measurement save feedback
- session guardrails

Status:

- completed

### 5. Cleanup route and feature structure

Keep `app/` focused on routing and move actual screens/logic into feature modules.

Status:

- completed for tab index routes
- partially complete for dynamic routes

### 6. Add backend usage guards

Protect the app from accidental high usage and oversized payloads by enforcing:

- write-rate limits for daily measurement logging
- caps on split size and workout-session set growth
- hard query argument limits for user-facing history/trend endpoints

Status:

- completed

### 7. Complete setup and project documentation

Replace the starter README with real project docs covering:

- required env vars
- Clerk setup
- Convex setup
- seed flow
- local development commands
- how to share preview builds

Status:

- pending

### 8. Remaining structural cleanup

Focus only on high-value cleanup:

- move dynamic route screens into feature-owned screens
- centralize repeated loading/empty state UI where it pays off
- add shared loading and error states for Convex-backed screens
- make `ScreenWrapper` less prescriptive so list and fixed-footer screens do not fight a built-in `ScrollView`

Status:

- pending

### 9. Session workflow improvements

Keep only the meaningful product-facing improvement that still changes daily use:

- allow choosing the planned split day to start instead of only current/nearest logic

Status:

- pending

### 10. Future maintenance backlog

Keep these as separate, deliberate follow-up branches instead of mixing them into feature work:

- Expo SDK 55 migration
- dependency refresh across the Expo stack
- Clerk package review for newer supported package layout
- dynamic route screen extraction if the route tree still feels noisy
- harden growth-prone Convex queries and add pagination where history-style data can grow
- standardize form parsing around `form DTO schema -> parser -> domain schema`

Status:

- pending

## Branching

Suggested future branches:

- `feat/session-day-picker`
  Let the user explicitly choose which planned training day to start.
- `docs/project-setup`
  Replace the starter docs with real local setup, seeding, and preview-build instructions.
- `refactor/dynamic-route-screens`
  Move remaining dynamic route files into feature-owned screens and keep `app/` route-thin.
- `refactor/loading-error-states`
  Add shared loading/error screen states and route-level error boundaries for Convex-backed views.
- `refactor/session-autosave-boundary`
  Split the workout session autosave orchestration into clearer draft and persistence layers.
- `refactor/screen-wrapper-flexibility`
  Make the shared screen shell work for simple screens, lists, and fixed-footer layouts without forced scrolling.
- `chore/remove-starter-scaffold`
  Remove the Expo starter reset script and clean its references from `package.json`, `README`, and local guidance.
- `chore/expo-sdk-55-upgrade`
  Upgrade Expo and aligned native packages in a dedicated migration branch.
- `chore/dependency-refresh`
  Refresh non-Expo dependencies after the SDK upgrade settles.
- `refactor/query-hardening-and-pagination`
  Add explicit limits and pagination paths to the remaining growth-prone Convex queries.
- `refactor/form-dto-parsing`
  Standardize forms around `DTO schema -> parser -> domain schema`.

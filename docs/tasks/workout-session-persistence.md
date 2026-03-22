# Task: Workout Session Persistence

## Branch

- `feat/workout-session-persistence`

## Status

- completed

## Problem

The current `Start session` screen is backed by local React state only. Workout progress is not stored in Convex, cannot be resumed reliably, and cannot power history or statistics.

This makes the app unreliable for real gym use.

## Goal

Implement a persistent workout session flow that:

- starts a workout from the user's split
- keeps progress in Convex
- resumes an active session automatically
- allows the workout to be completed
- provides stored data for later statistics work

## Scope

### Backend

Add a `workoutSessions` table to Convex with enough structure to store:

- user identity
- source split id
- source weekday
- day title
- session status
- started and completed timestamps
- performed exercises
- performed sets

Each performed set should store actual workout data, not only targets:

- reps
- weightKg
- restSec

Each performed exercise should store:

- exerciseId
- exerciseName
- target set definitions
- logged sets
- completion flag

### Queries and mutations

Add the minimum API surface needed by the app:

- `getActive`
- `startFromUpcomingDay`
- `updateExerciseSet`
- `addExerciseSet`
- `toggleExerciseDone`
- `finish`
- optional: `discardActive`

### Frontend

Refactor `app/(tabs)/start-session/index.tsx` so that it:

- loads an active session if one exists
- starts a session when needed
- writes updates to Convex instead of keeping the source of truth only in component state
- finishes the session explicitly

## Design Rules

- only one active session per user
- session data must survive refresh or app restart
- preserve the current split-based workout shape where practical
- avoid over-designing history screens in this task
- keep schema flexible enough for future statistics work

## Suggested Data Shape

This is directional, not mandatory.

```ts
workoutSessions: {
  userToken: string;
  splitId?: Id<"splits">;
  weekday: number;
  title: string;
  status: "active" | "completed";
  startedAt: number;
  completedAt?: number;
  exercises: Array<{
    exerciseId: Id<"exercises">;
    exerciseName: string;
    targetSets: Array<{
      reps: number;
      restSec: number;
    }>;
    performedSets: Array<{
      reps: number | null;
      weightKg: number | null;
      restSec: number | null;
    }>;
    isDone: boolean;
  }>;
}
```

## Implementation Steps

1. Extend `convex/schema.ts` with `workoutSessions` and indexes for active-session lookup.
2. Add Convex query and mutation functions for session lifecycle and set updates.
3. Refactor session utilities as needed so upcoming-day selection remains reusable.
4. Update `Start session` to fetch active session data first.
5. Replace local-only writes with Convex mutations.
6. Add a finish action and completed state handling.
7. Verify that refresh/re-entry restores the active session correctly.

## Acceptance Criteria

- Starting a session creates a persisted record in Convex.
- Reopening the app or screen restores the active session.
- Editing reps, weight, rest, and completion state updates persisted data.
- Finishing a session marks it completed and removes it from the active-session query.
- The screen still works when the user has no split.

Implemented notes:

- persisted workout sessions landed in Convex
- the `Start session` flow now starts, resumes, autosaves, and finishes sessions
- statistics and workout history were built on top of this data model
- the session UI was refactored into smaller hooks/components after the initial delivery

## Out of Scope

- charts
- full statistics UI
- workout history list
- offline sync strategy
- multi-device conflict handling

## Risks

- too many tiny mutations could make the session screen noisy or fragile
- schema shape chosen here will affect future statistics work
- nested object patching in Convex may require full-array replacement for updates

## Notes

After this task lands, the next logical branch is:

- `feat/workout-statistics`

Follow-up branches completed after this task:

- `feat/workout-statistics`
- `fix/split-builder-validation`
- `feat/workout-history`

Current completed follow-up work after this task:

- `feat/workout-statistics`
- `fix/split-builder-validation`
- `feat/workout-history`
- `feat/overview-insights`
- cleanup/refactor passes for formatting, overview data, session domain, measurements, params, and tab screens

Current next priority after this task chain:

- no direct continuation required

Useful future maintenance branches after the main task chain:

- `feat/session-day-picker`
  Let users pick the planned training day instead of only using current/nearest logic.
- `docs/project-setup`
  Document env setup, seeding, and local/preview build flows.
- `refactor/dynamic-route-screens`
  Move remaining dynamic route implementations into feature-owned screens.
- `refactor/loading-error-states`
  Add shared loading/error UI patterns and proper route error boundaries.
- `refactor/session-autosave-boundary`
  Separate session draft state from autosave/persistence orchestration.
- `refactor/screen-wrapper-flexibility`
  Stop forcing every screen through the same scroll/keyboard shell when the layout needs differ.
- `chore/remove-starter-scaffold`
  Delete the unused starter reset script and remove its remaining references.
- `chore/expo-sdk-55-upgrade`
  Handle the next Expo SDK migration in isolation.
- `chore/dependency-refresh`
  Revisit package versions after the Expo migration.
- `refactor/query-hardening-and-pagination`
  Add explicit limits and pagination to the remaining growth-prone Convex reads.
- `refactor/form-dto-parsing`
  Standardize all forms around a DTO-parser-domain pipeline.

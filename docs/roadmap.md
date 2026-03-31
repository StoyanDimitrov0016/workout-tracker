# Roadmap

This file is the working backlog for the app.

It is based on real use after a training day, so some items are immediate UX fixes and some are bigger product ideas that should wait until the core flow is more stable.

We will keep updating this file as new ideas appear and priorities change.

## Now

- Prefill session values from the last matching training day
  Prefill reps and weights based on the latest completed session for the same planned weekday, not just the latest time the exercise was performed globally.

## Next

- Per-set completion persistence
  Decide whether the per-set checkbox should stay local-only during the active session or be persisted so interrupted or partial sessions can restore it later.

- Exercise substitutions
  Allow an exercise to have substitutions so the user can switch to a similar movement when equipment is busy or unavailable.

- Prefill strategy preference
  Let the user choose whether planned weights should be prefilled from the last time the exercise was done at all or from the last time it was done on the same planned training day. Add a small info explanation for the difference.

- Increase exercise variety
  Expand the exercise list substantially and review how muscle groups and exercise browsing should work.

- Search by muscle group
  Add an easier way to browse or filter exercises by muscle group instead of only searching by name.

- Cardio support
  Decide whether cardio should live as a dedicated session type or as a simplified exercise type with different inputs such as duration.

## Later

- Unit preference in settings
  Add a preferences/settings area from the user avatar entry point and allow switching between kg and lbs.

- Session duration estimate
  Estimate training duration based on set count, reps, rest, and a simple execution/loading factor.

- Supplement tracker
  Track supplements such as protein, creatine, magnesium, vitamin D3, and K2 with scheduled intake.

- Training model redesign
  Re-evaluate whether training days should be reusable blocks/modules that splits reference instead of storing all day configuration directly inside the split.

- Muscle group and exercise info
  Add richer metadata, guidance, or info modals for muscle groups and exercises.

- Full styling audit
  Do a complete visual and consistency pass across the app once the main flows are stable.

## Future Ideas

- Mesocycles and periodization
  Support deload weeks and longer-term program structure, either manually configured or suggested by the app.

- Weekly summary
  Show a simple weekly summary of completed training.

- Goals and targets
  Add user goals such as bulk, cut, power, or endurance and connect them to progress tracking.

## Done

- Exercise preferences in account settings
  - Added a user-level Preferences area inside the account modal.
  - Added a per-user, per-exercise preference mapping in Convex so each user can save one reference URL and one note for every exercise independently from any training split.
  - Added an Exercise Preferences screen and editor flow to create, update, and clear those saved exercise preferences from account settings.
  - Surfaced the saved reference URL and notes directly inside the active workout session flow so technique reminders and machine setup details are available when they matter.
  - Added placeholder disabled options for future unit and session-prefill preferences so the settings structure is already visible.

- Local per-set completion checkbox
  - Added a quick per-set checkbox inside the active workout session flow to help the user keep up with completed sets while training.
  - Kept the checkbox purely presentational and local to the active screen; it is not persisted to the database and is not restored after the session is finished.

- Loading states and measurements route stability
  - Added layout skeletons across the app tabs instead of relying only on generic loading spinners.
  - Fixed the repeated reload behavior when switching between Measurements sub-routes.
  - Added a custom shared context for the Measurements flow so route changes reuse loaded data instead of refetching every time.
  - It seems there is no direct `staleTime`-style alternative in Convex like there is in TanStack Query so this is the reason behind this Measurements data custom context.

- Navigation cleanup
  - Simplified the shared app header so it stays clean and does not compete with actual screen actions.
  - Moved the Training Split edit action out of the shared header and into the Training Split tab itself.
  - Removed redundant heading and subheading text from the main tab screens to reclaim vertical space.
  - Added an explicit back arrow in the nested Statistics workout screens so the user can return directly to the Statistics feed.
  - Softened the inner Measurements tab switch by using an outlined active state, keeping the primary focus on creating or updating entries.

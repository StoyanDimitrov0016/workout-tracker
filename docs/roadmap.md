# Roadmap

This file is the working backlog for the app.

It is based on real use after a training day, so some items are immediate UX fixes and some are bigger product ideas that should wait until the core flow is more stable.

We will keep updating this file as new ideas appear and priorities change.

## Now

- Exercise notes and reminders
  Add a short free-text note per exercise for machine setup, technique reminders, and small cues such as bench angle, chest support position, belt usage, or squat focus points.

- Exercise reference URL
  Allow one URL per exercise so the user can attach a technique reference, most likely a YouTube video or short.

- Prefill session values from the last matching training day
  Prefill reps and weights based on the latest completed session for the same planned weekday, not just the latest time the exercise was performed globally.

- Per-set completion checkbox
  Add a very simple way to mark that a set is done without relying only on the entered numbers.

- Better loading states
  Replace layout-level spinners with proper loading skeletons where it improves perceived performance.

## Next

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

- Navigation cleanup
  - Simplified the shared app header so it stays clean and does not compete with actual screen actions.
  - Moved the Training Split edit action out of the shared header and into the Training Split tab itself.
  - Removed redundant heading and subheading text from the main tab screens to reclaim vertical space.
  - Added an explicit back arrow in the nested Statistics workout screens so the user can return directly to the Statistics feed.
  - Softened the inner Measurements tab switch by using an outlined active state, keeping the primary focus on creating or updating entries.

# Release Notes

## 2026-03-31

#### Exercise Preferences

This release adds lightweight exercise-specific memory so the app can carry more context from one workout to the next without overcomplicating the training flow.

- Added one reference URL and one note per exercise per user.
- Added editing from account settings and direct access from the active workout flow.
- Surfaced saved notes and links inside workout sessions where setup cues and technique reminders are actually useful.

#### Loading And Measurements Stability

The app should now feel less jittery when moving between tabs, especially inside the Measurements area where the previous route changes were causing unnecessary reloads.

- Added loading skeletons across the main tabs.
- Reworked the Measurements flow so switching between Weight and Circumferences reuses loaded data instead of refetching everything.
- Reduced the visual heaviness of the Measurements sub-navigation and tightened the spacing below the header.

#### Header And Navigation Cleanup

The header is now treated more like app shell chrome and less like a place to stack screen-specific controls, which makes the app feel calmer and more intentional.

- Simplified the root tab headers so they stay minimal.
- Kept back navigation for nested screens where it actually helps.
- Fixed the Statistics nested flow so returning to the feed behaves correctly.
- Moved the Training Split edit action out of the header and into the screen itself.

#### Workout Planning And Session Tracking

The training flow also picked up a couple of practical improvements that help both planning and in-session tracking without forcing a larger model redesign yet.

- Added target weight support to split planning and workout targets.
- Added temporary per-set completion checkboxes during active sessions so progress is easier to track set by set.

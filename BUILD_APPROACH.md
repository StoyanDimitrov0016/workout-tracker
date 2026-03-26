# Build Approach

## What the Expo Go warning actually means

The warning does **not** mean Expo Go is being shipped inside your production app.

It means Expo detected that the app is mainly developed and tested with Expo Go, and that is a weak signal for production readiness because Expo Go does not match a real release build closely enough when native modules are involved.

For this app, that warning is fair.

Why:
- the app uses native dependencies like `@clerk/expo`, `expo-secure-store`, `react-native-reanimated`, `react-native-gesture-handler`, and other Expo native modules
- Expo SDK 55 runs on the New Architecture, which makes native/codegen issues surface earlier
- the recent Android build failure came from Clerk native codegen, which Expo Go would not have caught the same way

So the warning is about **testing parity**, not about Expo Go being bundled into the release artifact.

## Recommended workflow for this app

Use three levels of builds:

1. Local fast iteration

Use Expo Go only for quick UI and JavaScript iteration when you want speed.

Good for:
- styling
- routing
- simple state changes
- non-native UI work

Bad for:
- trusting release readiness
- validating native-module behavior
- validating Android/iOS production builds

2. Internal device testing

Use the `preview` EAS profile when you want to install the app on your phone or share it with a friend.

Current config:
- `preview`
- internal distribution
- Android APK output

This is the right profile for:
- installing the app directly on Android devices
- testing a near-release build
- sharing with a friend without store submission

For your current goal, this is the best fit.

3. Real release build

Use the `production` EAS profile only when you actually want a store-style release build.

That profile should be treated as:
- stricter
- slower
- closer to what users would get in the store

For this project right now, production builds are useful mainly as a final confidence check.

## What I would do for this repo

Short version:
- keep Expo Go for fast local iteration
- use `preview` builds for actual phone testing and friend sharing
- use `production` builds occasionally to catch release-only native issues

That is the balanced setup for a side project like this.

## Important caveat in the current config

Your `eas.json` has a `development` profile with:

```json
"developmentClient": true
```

but the project does not currently include `expo-dev-client` in `package.json`.

That means the repo is not really set up for the full recommended "development build" workflow yet.

So right now your practical split is:
- Expo Go for fast iteration
- `preview` build for real-device/internal testing
- `production` build for release validation

That is still workable.

## Recommendation for your immediate goal

If you only want:
- install the app on your phone
- maybe share it with one friend
- avoid unnecessary process overhead

then use the `preview` build profile, not `production`.

Why:
- it is internal distribution
- it produces an Android APK
- it is easier to install directly
- it still exercises the native build path that Expo Go misses

## Cleanup worth doing later

1. Remove `android.versionCode` from `app.json`.

Reason:
- EAS already uses remote app versioning
- keeping a local `android.versionCode` is now misleading noise

2. Decide whether to add `expo-dev-client`.

If you want a more correct native-development loop, add it later and use a real development build instead of relying on Expo Go for everything.

3. Keep using real EAS builds for native validation.

This app has already shown that release-only native failures are possible even when JavaScript development feels fine.

## Bottom line

You are not "putting a developer version into prod."

What is happening is:
- Expo Go is okay for fast local work
- Expo Go is not enough to trust release readiness for this app
- `preview` is the right build target for your current personal-use and friend-sharing scenario
- `production` should be used only when you want an actual release-grade check

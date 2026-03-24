# Cleanup Notes

## Clerk Expo Android Codegen Patch

This project currently uses `patch-package` to patch `@clerk/expo@3.1.4` during install.

Why this exists:
- Android release builds on Expo SDK 55 / React Native 0.83 fail during `:clerk_expo:generateCodegenSchemaFromJavaScript`.
- The failure comes from Clerk's published `NativeClerkModule` spec, not from app code.
- The current patch changes the module lookup in `node_modules/@clerk/expo/src/specs/NativeClerkModule.ts` to the codegen-safe `TurboModuleRegistry.get<Spec>("ClerkExpo")` form.

Tracked files:
- `package.json`
- `patches/@clerk+expo+3.1.4.patch`

When to remove it:
1. Check whether Clerk has released a version that fixes the Android codegen failure on Expo SDK 55 / React Native 0.83.
2. Remove `patch-package` from `package.json`.
3. Remove `patches/@clerk+expo+3.1.4.patch`.
4. Run a clean install.
5. Confirm Android release builds succeed without the patch.

Suggested removal check:

```bash
npx npm@10.9.3 ci --include=dev
```

If install and Android release builds both succeed without the patch, the workaround can be deleted.

## Solana Mobile Native Autolinking Disable

This project currently disables React Native autolinking for `@solana-mobile/mobile-wallet-adapter-protocol` in `react-native.config.js`.

Why this exists:
- `@clerk/expo` pulls Solana wallet packages transitively through `@clerk/clerk-js`.
- The app does not use Solana wallet features.
- The transitive Solana React Native Android module introduces native build inputs that are not needed by this app.
- On Expo SDK 55, that extra Android native dependency chain is the likely source of the Kotlin serialization metadata mismatch seen in EAS builds.

Tracked files:
- `react-native.config.js`

When to remove it:
1. Check whether Clerk no longer pulls the Solana React Native package into native builds, or whether the upstream Android dependency issue has been fixed.
2. Remove the override from `react-native.config.js`.
3. Run a clean install and a fresh Android EAS build.
4. Confirm Android release builds still succeed without the override.

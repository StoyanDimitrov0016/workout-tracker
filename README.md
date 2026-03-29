# Workout Tracker

Mobile workout tracker built with Expo, React Native, Clerk, and Convex.

The app is focused on a practical training flow:

- create a weekly training split
- define per-set reps, target weight, and rest
- start planned workout sessions and log performed sets
- track body weight and circumference measurements
- review recent workouts and basic training statistics

## Stack

- Expo + React Native
- Expo Router
- TypeScript
- NativeWind
- Clerk authentication
- Convex backend

## Main Features

- Training split builder with per-exercise set targets
- Planned workout start flow
- Active session logging with per-set reps, weight, and rest
- Workout history and session detail screens
- Weight and circumference measurement tracking
- Overview and statistics screens

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and fill in real values:

```bash
cp .env.example .env.local
```

3. Start the app:

```bash
npm run start
```

You can also launch a specific target:

```bash
npm run android
npm run ios
npm run web
```

## Environment Variables

The app expects these values in `.env.local`:

- `CLERK_JWT_ISSUER_DOMAIN`
- `CONVEX_DEPLOYMENT`
- `EXPO_PUBLIC_CONVEX_URL`
- `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `EXPO_PUBLIC_CONVEX_SITE_URL`

Use [.env.example](/Users/stoyan.dim/repositories/workout-tracker/.env.example) as the template.

## Development Commands

```bash
npm run lint
npm run format
npm run format:check
```

## Project Structure

- [app](/Users/stoyan.dim/repositories/workout-tracker/app): Expo Router screens and layouts
- [features](/Users/stoyan.dim/repositories/workout-tracker/features): domain features such as splits, sessions, measurements, overview, and statistics
- [components](/Users/stoyan.dim/repositories/workout-tracker/components): shared UI building blocks
- [convex](/Users/stoyan.dim/repositories/workout-tracker/convex): backend schema, queries, and mutations
- [docs](/Users/stoyan.dim/repositories/workout-tracker/docs): planning notes and follow-up docs

## Notes

- Local secrets belong in `.env.local`.

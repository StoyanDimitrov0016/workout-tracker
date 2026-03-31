/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as auth from "../auth.js";
import type * as circumferences from "../circumferences.js";
import type * as exercisePreferences from "../exercisePreferences.js";
import type * as exercises from "../exercises.js";
import type * as muscles from "../muscles.js";
import type * as seed from "../seed.js";
import type * as splits from "../splits.js";
import type * as usageLimits from "../usageLimits.js";
import type * as weights from "../weights.js";
import type * as workoutSessionDomain from "../workoutSessionDomain.js";
import type * as workoutSessions from "../workoutSessions.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  circumferences: typeof circumferences;
  exercisePreferences: typeof exercisePreferences;
  exercises: typeof exercises;
  muscles: typeof muscles;
  seed: typeof seed;
  splits: typeof splits;
  usageLimits: typeof usageLimits;
  weights: typeof weights;
  workoutSessionDomain: typeof workoutSessionDomain;
  workoutSessions: typeof workoutSessions;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};

/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as admin from "../admin.js";
import type * as adminAccess from "../adminAccess.js";
import type * as adminGuard from "../adminGuard.js";
import type * as analytics from "../analytics.js";
import type * as auth from "../auth.js";
import type * as cms from "../cms.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as inquiries from "../inquiries.js";
import type * as pageMedia from "../pageMedia.js";
import type * as pageVisibility from "../pageVisibility.js";
import type * as visualPages from "../visualPages.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  admin: typeof admin;
  adminAccess: typeof adminAccess;
  adminGuard: typeof adminGuard;
  analytics: typeof analytics;
  auth: typeof auth;
  cms: typeof cms;
  files: typeof files;
  http: typeof http;
  inquiries: typeof inquiries;
  pageMedia: typeof pageMedia;
  pageVisibility: typeof pageVisibility;
  visualPages: typeof visualPages;
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

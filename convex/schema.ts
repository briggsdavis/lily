import { authTables } from "@convex-dev/auth/server";
import { defineSchema } from "convex/server";

export default defineSchema({
  ...authTables,
  // Add application tables here as product features are introduced.
});

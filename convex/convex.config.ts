import { defineApp } from "convex/server"
import { v } from "convex/values"

const app = defineApp({
  env: {
    ADMIN_ALLOWED_EMAILS: v.optional(v.string()),
  },
})

export default app

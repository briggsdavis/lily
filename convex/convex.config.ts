import resend from "@convex-dev/resend/convex.config.js"
import { defineApp } from "convex/server"
import { v } from "convex/values"

const app = defineApp({
  env: {
    ADMIN_ALLOWED_EMAILS: v.optional(v.string()),
    EMAIL_FROM: v.optional(v.string()),
    RESEND_API_KEY: v.optional(v.string()),
  },
})

app.use(resend)

export default app

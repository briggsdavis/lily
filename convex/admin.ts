import { getAuthUserId } from "@convex-dev/auth/server"
import { v } from "convex/values"
import { query } from "./_generated/server"
import { isAllowedAdminEmail } from "./adminAccess"

export const viewer = query({
  args: {},
  returns: v.union(v.object({ email: v.string() }), v.null()),
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (userId === null) {
      return null
    }

    const user = await ctx.db.get("users", userId)
    if (user?.email === undefined || !isAllowedAdminEmail(user.email)) {
      return null
    }

    return { email: user.email }
  },
})

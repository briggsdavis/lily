import { getAuthUserId } from "@convex-dev/auth/server"
import type { MutationCtx, QueryCtx } from "./_generated/server"
import { ADMIN_ACCESS_DENIED, isAllowedAdminEmail } from "./adminAccess"

export async function requireAdmin(ctx: QueryCtx | MutationCtx) {
  const userId = await getAuthUserId(ctx)
  if (userId === null) throw new Error(ADMIN_ACCESS_DENIED)

  const user = await ctx.db.get("users", userId)
  if (!user?.email || !isAllowedAdminEmail(user.email)) throw new Error(ADMIN_ACCESS_DENIED)
  return user.email
}

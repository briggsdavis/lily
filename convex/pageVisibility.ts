import { v, ConvexError } from "convex/values"
import { query, mutation } from "./_generated/server"
import { requireAdmin } from "./adminGuard"

export const disabled = query({
  args: {},
  returns: v.array(v.string()),
  handler: async (ctx) =>
    (await ctx.db.query("pageVisibility").collect())
      .filter((row) => !row.enabled)
      .map((row) => row.path),
})

export const set = mutation({
  args: { path: v.string(), enabled: v.boolean() },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    if (!/^\/(?:|about|events|catering|contact|menu(?:\/[a-z0-9-]+)?)$/.test(args.path))
      throw new ConvexError("Invalid page")
    const row = await ctx.db
      .query("pageVisibility")
      .withIndex("by_path", (q) => q.eq("path", args.path))
      .unique()
    if (row) await ctx.db.patch(row._id, { enabled: args.enabled })
    else await ctx.db.insert("pageVisibility", args)
    return null
  },
})

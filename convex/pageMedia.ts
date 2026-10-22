import { ConvexError, v } from "convex/values"
import { mediaSlots, mediaFileKind } from "../src/lib/page-media"
import { query, mutation } from "./_generated/server"
import { requireAdmin } from "./adminGuard"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return Promise.all(
      (await ctx.db.query("pageMedia").collect()).map(async (row) => ({
        key: row.key,
        kind: row.kind,
        url: await ctx.storage.getUrl(row.storageId),
      })),
    )
  },
})
export const save = mutation({
  args: { key: v.string(), storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const slot = mediaSlots.find((slot) => slot.key === args.key)
    if (!slot) throw new ConvexError("Unknown image location")
    const file = await ctx.db.system.get(args.storageId)
    if (!file) throw new ConvexError("Upload missing")
    const kind = mediaFileKind(file.contentType ?? "", file.size, slot.video)
    if (!kind) throw new ConvexError("Invalid file type or size")
    const existing = await ctx.db
      .query("pageMedia")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique()
    const value = { ...args, kind }
    if (existing) await ctx.db.patch(existing._id, value)
    else await ctx.db.insert("pageMedia", value)
    return null
  },
})

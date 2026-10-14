import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { requireAdmin } from "./adminGuard"

export const generateUploadUrl = mutation({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return ctx.storage.generateUploadUrl()
  },
})

export const resolveUpload = mutation({
  args: { storageId: v.id("_storage") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.storage.getUrl(args.storageId)
  },
})

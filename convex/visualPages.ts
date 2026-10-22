import { ConvexError, v } from "convex/values"
import { mediaSlots, mediaFileKind } from "../src/lib/page-media"
import { normalizeHex, pageFieldKinds, validPageLink } from "../src/lib/visual-page"
import { query, mutation } from "./_generated/server"
import { requireAdmin } from "./adminGuard"
const pageValidator = v.union(v.literal("home"), v.literal("about"))
export const published = query({
  args: { page: pageValidator },
  handler: async (ctx, { page }) => {
    const doc = await ctx.db
      .query("pageDocuments")
      .withIndex("by_page", (q) => q.eq("page", page))
      .unique()
    return { fields: doc?.fields ?? {}, revision: doc?.revision ?? 0 }
  },
})
export const colors = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return (await ctx.db.query("pageColors").collect()).map((row) => row.hex)
  },
})
export const save = mutation({
  args: {
    page: pageValidator,
    revision: v.number(),
    fields: v.record(v.string(), v.string()),
    media: v.array(v.object({ key: v.string(), storageId: v.id("_storage") })),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const existing = await ctx.db
      .query("pageDocuments")
      .withIndex("by_page", (q) => q.eq("page", args.page))
      .unique()
    if ((existing?.revision ?? 0) !== args.revision)
      throw new ConvexError(
        "This page changed while you were editing. Reload the published page before saving.",
      )
    if (Object.keys(args.fields).length > 250 || args.media.length > 40)
      throw new ConvexError("Too many fields")
    if (new TextEncoder().encode(JSON.stringify(args.fields)).byteLength > 500000)
      throw new ConvexError("This page contains too much text. Shorten the content before saving.")
    const palette = new Set<string>()
    for (const [key, value] of Object.entries(args.fields)) {
      const baseKey = key.endsWith(".href") ? key.slice(0, -5) : key
      const kind = Object.hasOwn(pageFieldKinds[args.page], baseKey)
        ? pageFieldKinds[args.page][baseKey]
        : undefined
      if (!kind || (key.endsWith(".href") && kind !== "button"))
        throw new ConvexError("Unknown page field")
      if (kind === "button" && !key.endsWith(".href") && !value.trim())
        throw new ConvexError("Button text cannot be empty")
      if (value.length > 10000) throw new ConvexError("Text is too long")
      if (key.endsWith(".href") && !validPageLink(value)) throw new ConvexError("Invalid link")
      if (kind === "color") {
        const color = normalizeHex(value)
        if (!color) throw new ConvexError("Invalid hex color")
        palette.add(color)
      }
    }
    const seen = new Set<string>()
    for (const media of args.media) {
      const slot = mediaSlots.find((slot) => slot.key === media.key && slot.page === args.page)
      if (!slot || seen.has(media.key)) throw new ConvexError("Invalid media location")
      seen.add(media.key)
      const file = await ctx.db.system.get(media.storageId)
      const kind = file ? mediaFileKind(file.contentType ?? "", file.size, slot.video) : null
      if (!kind) throw new ConvexError("Invalid media file")
      const current = await ctx.db
        .query("pageMedia")
        .withIndex("by_key", (q) => q.eq("key", media.key))
        .unique()
      if (current) await ctx.db.patch(current._id, { storageId: media.storageId, kind })
      else await ctx.db.insert("pageMedia", { ...media, kind })
    }
    for (const hex of palette) {
      const color = await ctx.db
        .query("pageColors")
        .withIndex("by_hex", (q) => q.eq("hex", hex))
        .unique()
      if (!color) await ctx.db.insert("pageColors", { hex })
    }
    const revision = args.revision + 1
    if (existing) await ctx.db.patch(existing._id, { fields: args.fields, revision })
    else await ctx.db.insert("pageDocuments", { page: args.page, fields: args.fields, revision })
    return revision
  },
})

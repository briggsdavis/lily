import { paginationOptsValidator } from "convex/server"
import { v } from "convex/values"
import { imageLimitMb, mediaFileKind } from "../src/lib/page-media"
import { normalizeHex, validPageLink } from "../src/lib/visual-page"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./adminGuard"
import { announcementFields, popupFields } from "./marketingModel"

export const list = query({
  args: {},
  handler: async (ctx) => {
    await requireAdmin(ctx)
    return {
      announcements: await ctx.db.query("announcements").order("desc").collect(),
      popups: await ctx.db.query("popups").order("desc").collect(),
    }
  },
})
export const published = query({
  args: {},
  handler: async (ctx) => {
    const announcement = await ctx.db
      .query("announcements")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first()
    const popup = await ctx.db
      .query("popups")
      .withIndex("by_active", (q) => q.eq("active", true))
      .first()
    return {
      announcement,
      popup: popup
        ? { ...popup, imageUrl: popup.imageId ? await ctx.storage.getUrl(popup.imageId) : null }
        : null,
    }
  },
})
export const saveAnnouncement = mutation({
  args: { ...announcementFields, id: v.optional(v.id("announcements")) },
  handler: async (ctx, { id, ...value }) => {
    await requireAdmin(ctx)
    if (!value.text.trim() || value.text.length > 500 || !validPageLink(value.link))
      throw new Error("Enter announcement text (up to 500 characters) and a valid link.")
    const textColor = normalizeHex(value.textColor),
      backgroundColor = normalizeHex(value.backgroundColor)
    if (!textColor || !backgroundColor) throw new Error("Choose valid hex colors.")
    if (id && !(await ctx.db.get(id))) throw new Error("Announcement no longer exists.")
    if (value.active)
      for (const row of await ctx.db
        .query("announcements")
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect())
        if (row._id !== id) await ctx.db.patch(row._id, { active: false })
    const data = {
      ...value,
      text: value.text.trim(),
      textColor,
      backgroundColor,
      updatedAt: Date.now(),
    }
    if (!id) return ctx.db.insert("announcements", data)
    await ctx.db.patch(id, data)
    return id
  },
})
export const savePopup = mutation({
  args: { ...popupFields, id: v.optional(v.id("popups")) },
  handler: async (ctx, { id, ...value }) => {
    await requireAdmin(ctx)
    if (
      !value.title.trim() ||
      !value.body.trim() ||
      value.title.length > 200 ||
      value.body.length > 5000
    )
      throw new Error("Title and body are required (maximum 200 and 5,000 characters).")
    if (
      Boolean(value.buttonText.trim()) !== Boolean(value.buttonLink) ||
      (value.buttonLink && !validPageLink(value.buttonLink))
    )
      throw new Error("A button needs both text and a valid link.")
    if (value.layout !== "none") {
      if (!value.imageId) throw new Error("Upload an image.")
      const file = await ctx.db.system.get(value.imageId)
      if (!file || mediaFileKind(file.contentType ?? "", file.size, false) !== "image")
        throw new Error(`Choose an uploaded image up to ${imageLimitMb} MB.`)
    }
    if (id && !(await ctx.db.get(id))) throw new Error("Pop-up no longer exists.")
    if (value.active)
      for (const row of await ctx.db
        .query("popups")
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect())
        if (row._id !== id) await ctx.db.patch(row._id, { active: false })
    const data = {
      ...value,
      imageId: value.layout === "none" ? undefined : value.imageId,
      imageAlt: value.imageAlt.trim() || value.title.trim(),
      title: value.title.trim(),
      body: value.body.trim(),
      buttonText: value.buttonText.trim(),
      updatedAt: Date.now(),
    }
    if (!id) return ctx.db.insert("popups", data)
    await ctx.db.patch(id, data)
    return id
  },
})
export const setActive = mutation({
  args: {
    id: v.union(v.id("announcements"), v.id("popups")),
    kind: v.union(v.literal("announcements"), v.literal("popups")),
    active: v.boolean(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const id = ctx.db.normalizeId(args.kind, args.id)
    if (!id || !(await ctx.db.get(id))) throw new Error("Item no longer exists.")
    if (args.active)
      for (const row of await ctx.db
        .query(args.kind)
        .withIndex("by_active", (q) => q.eq("active", true))
        .collect())
        if (row._id !== id) await ctx.db.patch(row._id, { active: false })
    await ctx.db.patch(id, { active: args.active, updatedAt: Date.now() })
  },
})
export const remove = mutation({
  args: { id: v.union(v.id("announcements"), v.id("popups")) },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)
    await ctx.db.delete(id)
  },
})
export const emails = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db.query("marketingEmails").order("desc").paginate(args.paginationOpts)
  },
})
export const capture = mutation({
  args: { popupId: v.id("popups"), email: v.string() },
  handler: async (ctx, args) => {
    const popup = await ctx.db.get(args.popupId)
    if (!popup?.active || !popup.captureEmail)
      throw new Error("This email form is no longer available.")
    const email = args.email.trim().toLowerCase()
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      throw new Error("Enter a valid email address.")
    if (
      !(await ctx.db
        .query("marketingEmails")
        .withIndex("by_popupId_and_email", (q) => q.eq("popupId", args.popupId).eq("email", email))
        .first())
    )
      await ctx.db.insert("marketingEmails", {
        popupId: args.popupId,
        popupTitle: popup.title,
        email,
      })
    return null
  },
})
export const imageUrl = query({
  args: { id: v.id("_storage") },
  handler: async (ctx, { id }) => {
    await requireAdmin(ctx)
    return ctx.storage.getUrl(id)
  },
})

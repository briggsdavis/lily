import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./adminGuard"

const menuItem = v.object({
  description: v.string(),
  key: v.string(),
  price: v.string(),
  title: v.string(),
})
const menuSection = v.object({
  backgroundColor: v.union(
    v.literal("cream"),
    v.literal("espresso"),
    v.literal("mauve"),
    v.literal("dark-maroon"),
  ),
  image: v.string(),
  imageAlt: v.string(),
  imageSide: v.union(v.literal("left"), v.literal("right")),
  items: v.array(menuItem),
  key: v.string(),
  title: v.string(),
})

export const publicMenuPages = query({
  args: {},
  handler: async (ctx) =>
    ctx.db
      .query("menuPages")
      .withIndex("by_archived_order", (q) => q.eq("archived", false))
      .collect(),
})

export const adminMenuPages = query({
  args: { archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db
      .query("menuPages")
      .withIndex("by_archived_order", (q) => q.eq("archived", args.archived))
      .collect()
  },
})

export const saveMenuPage = mutation({
  args: {
    archived: v.boolean(),
    description: v.string(),
    heroImage: v.string(),
    heroImageAlt: v.string(),
    id: v.optional(v.id("menuPages")),
    order: v.number(),
    sections: v.array(menuSection),
    slug: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const slug = args.slug.trim().toLowerCase()
    const duplicate = await ctx.db
      .query("menuPages")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique()
    if (duplicate && duplicate._id !== args.id)
      throw new Error("A menu page already uses this slug")
    if (!args.title.trim() || !slug || !args.heroImage.trim())
      throw new Error("Title, slug, and hero image are required")
    if (args.sections.length === 0) throw new Error("Add at least one menu section")
    const { id, ...page } = args
    const value = { ...page, slug, updatedAt: Date.now() }
    if (id) {
      await ctx.db.patch(id, value)
      return id
    }
    return ctx.db.insert("menuPages", value)
  },
})

export const reorderMenuPages = mutation({
  args: { ids: v.array(v.id("menuPages")) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await Promise.all(
      args.ids.map((id, order) => ctx.db.patch(id, { order, updatedAt: Date.now() })),
    )
    return null
  },
})

export const setMenuArchived = mutation({
  args: { archived: v.boolean(), id: v.id("menuPages") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.patch(args.id, { archived: args.archived, updatedAt: Date.now() })
    return null
  },
})

export const adminEvents = query({
  args: { archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db
      .query("events")
      .withIndex("by_archived_date", (q) => q.eq("archived", args.archived))
      .collect()
  },
})

export const publicEvents = query({
  args: {},
  handler: async (ctx) =>
    (
      await ctx.db
        .query("events")
        .withIndex("by_active_date", (q) => q.eq("active", true))
        .collect()
    ).filter((event) => !event.archived),
})

export const initializeContent = mutation({
  args: {
    events: v.array(
      v.object({
        active: v.boolean(),
        archived: v.boolean(),
        buttonLabel: v.optional(v.string()),
        buttonLink: v.optional(v.string()),
        date: v.string(),
        description: v.string(),
        leftImage: v.string(),
        leftImageAlt: v.string(),
        recurrence: v.union(v.literal("none"), v.literal("weekly"), v.literal("monthly")),
        rightImage: v.string(),
        rightImageAlt: v.string(),
        time: v.string(),
        title: v.string(),
      }),
    ),
    pages: v.array(
      v.object({
        archived: v.boolean(),
        description: v.string(),
        heroImage: v.string(),
        heroImageAlt: v.string(),
        order: v.number(),
        sections: v.array(menuSection),
        slug: v.string(),
        title: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const [existingPages, existingEvents] = await Promise.all([
      ctx.db.query("menuPages").first(),
      ctx.db.query("events").first(),
    ])
    if (!existingPages)
      await Promise.all(
        args.pages.map((page) => ctx.db.insert("menuPages", { ...page, updatedAt: Date.now() })),
      )
    if (!existingEvents)
      await Promise.all(
        args.events.map((event) => ctx.db.insert("events", { ...event, updatedAt: Date.now() })),
      )
    return null
  },
})

export const saveEvent = mutation({
  args: {
    active: v.boolean(),
    archived: v.boolean(),
    buttonLabel: v.optional(v.string()),
    buttonLink: v.optional(v.string()),
    date: v.string(),
    description: v.string(),
    id: v.optional(v.id("events")),
    leftImage: v.string(),
    leftImageAlt: v.string(),
    recurrence: v.union(v.literal("none"), v.literal("weekly"), v.literal("monthly")),
    rightImage: v.string(),
    rightImageAlt: v.string(),
    time: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const { id, ...event } = args
    const value = { ...event, updatedAt: Date.now() }
    if (id) {
      await ctx.db.patch(id, value)
      return id
    }
    return ctx.db.insert("events", value)
  },
})

export const setEventArchived = mutation({
  args: { archived: v.boolean(), id: v.id("events") },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    await ctx.db.patch(args.id, { archived: args.archived, updatedAt: Date.now() })
    return null
  },
})

export const clearArchive = mutation({
  args: {
    collection: v.union(
      v.literal("menu"),
      v.literal("events"),
      v.literal("contact"),
      v.literal("catering"),
    ),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    if (args.collection === "menu") {
      const rows = await ctx.db.query("menuPages").collect()
      await Promise.all(rows.filter((row) => row.archived).map((row) => ctx.db.delete(row._id)))
    } else if (args.collection === "events") {
      const rows = await ctx.db.query("events").collect()
      await Promise.all(rows.filter((row) => row.archived).map((row) => ctx.db.delete(row._id)))
    } else if (args.collection === "contact") {
      const rows = await ctx.db.query("contactInquiries").collect()
      await Promise.all(rows.filter((row) => row.archived).map((row) => ctx.db.delete(row._id)))
    } else {
      const rows = await ctx.db.query("cateringInquiries").collect()
      await Promise.all(rows.filter((row) => row.archived).map((row) => ctx.db.delete(row._id)))
    }
    return null
  },
})

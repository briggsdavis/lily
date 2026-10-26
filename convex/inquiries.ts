import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./adminGuard"
import { notifyInbox } from "./emails"

export const submitContact = mutation({
  args: {
    date: v.optional(v.string()),
    email: v.string(),
    guests: v.optional(v.number()),
    message: v.optional(v.string()),
    name: v.string(),
    phone: v.string(),
    reason: v.union(v.literal("reservation"), v.literal("events"), v.literal("general")),
    specialRequests: v.optional(v.string()),
    time: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("contactInquiries", {
      ...args,
      archived: false,
      createdAt: Date.now(),
      read: false,
    })
    await notifyInbox(ctx, {
      fields: [
        ["Reason", args.reason],
        ["Name", args.name],
        ["Email", args.email],
        ["Phone", args.phone],
        ["Date", args.date],
        ["Time", args.time],
        ["Guests", args.guests],
        ["Message", args.message],
        ["Special requests", args.specialRequests],
      ],
      idempotencyKey: `contact:${id}`,
      replyTo: args.email,
      subject: `New ${args.reason} inquiry from ${args.name}`,
    })
    return id
  },
})

export const submitCatering = mutation({
  args: {
    deliveryAddress: v.optional(v.string()),
    dietaryNotes: v.optional(v.string()),
    dietaryRestrictions: v.array(v.string()),
    email: v.string(),
    eventDate: v.string(),
    fulfillment: v.union(v.literal("onsite"), v.literal("offsite")),
    fullName: v.string(),
    guestCount: v.number(),
    menuSelection: v.string(),
    occasion: v.optional(v.string()),
    phone: v.string(),
    serviceTime: v.string(),
    specialInstructions: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("cateringInquiries", {
      ...args,
      archived: false,
      createdAt: Date.now(),
      read: false,
    })
    await notifyInbox(ctx, {
      fields: [
        ["Name", args.fullName],
        ["Email", args.email],
        ["Phone", args.phone],
        ["Event date", args.eventDate],
        ["Service time", args.serviceTime],
        ["Guests", args.guestCount],
        ["Occasion", args.occasion],
        ["Fulfillment", args.fulfillment === "onsite" ? "On site" : "Off site"],
        ["Delivery address", args.deliveryAddress],
        ["Menu", args.menuSelection],
        ["Dietary restrictions", args.dietaryRestrictions.join(", ")],
        ["Dietary notes", args.dietaryNotes],
        ["Special instructions", args.specialInstructions],
      ],
      idempotencyKey: `catering:${id}`,
      replyTo: args.email,
      subject: `New catering inquiry from ${args.fullName}`,
    })
    return id
  },
})

export const listContact = query({
  args: { archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db
      .query("contactInquiries")
      .withIndex("by_archived_created", (q) => q.eq("archived", args.archived))
      .order("desc")
      .collect()
  },
})

export const listCatering = query({
  args: { archived: v.boolean() },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    return ctx.db
      .query("cateringInquiries")
      .withIndex("by_archived_created", (q) => q.eq("archived", args.archived))
      .order("desc")
      .collect()
  },
})

export const setContactState = mutation({
  args: {
    archived: v.optional(v.boolean()),
    id: v.id("contactInquiries"),
    read: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const { id, ...state } = args
    await ctx.db.patch(id, state)
    return null
  },
})

export const setCateringState = mutation({
  args: {
    archived: v.optional(v.boolean()),
    id: v.id("cateringInquiries"),
    read: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const { id, ...state } = args
    await ctx.db.patch(id, state)
    return null
  },
})

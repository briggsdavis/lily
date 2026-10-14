import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

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

export default defineSchema({
  ...authTables,
  analyticsEvents: defineTable({
    path: v.string(),
    sessionId: v.string(),
    timestamp: v.number(),
  }).index("by_timestamp", ["timestamp"]),
  cateringInquiries: defineTable({
    archived: v.boolean(),
    createdAt: v.number(),
    deliveryAddress: v.optional(v.string()),
    dietaryNotes: v.optional(v.string()),
    dietaryRestrictions: v.array(v.string()),
    email: v.string(),
    eventDate: v.string(),
    fulfillment: v.union(v.literal("delivery"), v.literal("pickup")),
    fullName: v.string(),
    guestCount: v.number(),
    menuSelection: v.string(),
    phone: v.string(),
    read: v.boolean(),
    serviceTime: v.string(),
    specialInstructions: v.optional(v.string()),
  })
    .index("by_archived_created", ["archived", "createdAt"])
    .index("by_read_created", ["read", "createdAt"]),
  contactInquiries: defineTable({
    archived: v.boolean(),
    createdAt: v.number(),
    date: v.optional(v.string()),
    email: v.string(),
    guests: v.optional(v.number()),
    message: v.optional(v.string()),
    name: v.string(),
    phone: v.string(),
    read: v.boolean(),
    reason: v.union(v.literal("reservation"), v.literal("events"), v.literal("general")),
    specialRequests: v.optional(v.string()),
    time: v.optional(v.string()),
  })
    .index("by_archived_created", ["archived", "createdAt"])
    .index("by_read_created", ["read", "createdAt"]),
  events: defineTable({
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
    updatedAt: v.number(),
  })
    .index("by_archived_date", ["archived", "date"])
    .index("by_active_date", ["active", "date"]),
  menuPages: defineTable({
    archived: v.boolean(),
    description: v.string(),
    heroImage: v.string(),
    heroImageAlt: v.string(),
    order: v.number(),
    sections: v.array(menuSection),
    slug: v.string(),
    title: v.string(),
    updatedAt: v.number(),
  })
    .index("by_archived_order", ["archived", "order"])
    .index("by_slug", ["slug"]),
})

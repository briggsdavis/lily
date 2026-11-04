import { v } from "convex/values"
export const announcementFields = {
  text: v.string(),
  link: v.string(),
  textColor: v.string(),
  backgroundColor: v.string(),
  active: v.boolean(),
}
export const popupFields = {
  title: v.string(),
  body: v.string(),
  layout: v.union(v.literal("top"), v.literal("left"), v.literal("right"), v.literal("none")),
  imageId: v.optional(v.id("_storage")),
  imageAlt: v.string(),
  buttonText: v.string(),
  buttonLink: v.string(),
  captureEmail: v.boolean(),
  active: v.boolean(),
}

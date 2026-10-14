import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAdmin } from "./adminGuard"

export const trackPageView = mutation({
  args: { path: v.string(), sessionId: v.string() },
  handler: async (ctx, args) =>
    ctx.db.insert("analyticsEvents", { ...args, timestamp: Date.now() }),
})

export const dashboard = query({
  args: { days: v.union(v.literal(7), v.literal(30), v.literal(90), v.literal(180)) },
  handler: async (ctx, args) => {
    await requireAdmin(ctx)
    const since = Date.now() - args.days * 86_400_000
    const visits = await ctx.db
      .query("analyticsEvents")
      .withIndex("by_timestamp", (q) => q.gte("timestamp", since))
      .collect()
    const contact = await ctx.db.query("contactInquiries").collect()
    const catering = await ctx.db.query("cateringInquiries").collect()
    const points = Array.from({ length: args.days }, (_, index) => {
      const start = new Date()
      start.setHours(0, 0, 0, 0)
      start.setDate(start.getDate() - (args.days - index - 1))
      const end = start.getTime() + 86_400_000
      const dailyVisits = visits.filter(
        (visit) => visit.timestamp >= start.getTime() && visit.timestamp < end,
      )
      return {
        date: start.toISOString().slice(0, 10),
        eventViews: dailyVisits.filter((visit) => visit.path.startsWith("/events")).length,
        inquiries:
          contact.filter((item) => item.createdAt >= start.getTime() && item.createdAt < end)
            .length +
          catering.filter((item) => item.createdAt >= start.getTime() && item.createdAt < end)
            .length,
        menuViews: dailyVisits.filter((visit) => visit.path.startsWith("/menu")).length,
        pageViews: dailyVisits.length,
        uniqueVisitors: new Set(dailyVisits.map((visit) => visit.sessionId)).size,
      }
    })
    return {
      metrics: {
        eventViews: visits.filter((visit) => visit.path.startsWith("/events")).length,
        inquiries:
          contact.filter((item) => item.createdAt >= since).length +
          catering.filter((item) => item.createdAt >= since).length,
        menuViews: visits.filter((visit) => visit.path.startsWith("/menu")).length,
        pageViews: visits.length,
        uniqueVisitors: new Set(visits.map((visit) => visit.sessionId)).size,
      },
      newCatering: catering.filter((item) => !item.read && !item.archived).length,
      newContact: contact.filter((item) => !item.read && !item.archived).length,
      points,
    }
  },
})

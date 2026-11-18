import { v } from "convex/values"
import { internalMutation } from "./_generated/server"

const day = 24 * 60 * 60 * 1000
const storageUuid = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/g

// Deletes stored files that nothing references. Files are referenced either by
// id (pageMedia, popups) or by URL inside content strings (menus, events,
// page documents). Files newer than a day are kept so unpublished drafts survive.
export const deleteUnused = internalMutation({
  args: { dryRun: v.optional(v.boolean()) },
  handler: async (ctx, { dryRun }) => {
    const ids = new Set<string>()
    const uuids = new Set<string>()
    for (const row of await ctx.db.query("pageMedia").collect()) ids.add(row.storageId)
    for (const row of await ctx.db.query("popups").collect()) if (row.imageId) ids.add(row.imageId)
    for (const table of ["menuPages", "events", "pageDocuments", "announcements", "popups"] as const)
      for (const row of await ctx.db.query(table).collect())
        for (const uuid of JSON.stringify(row).match(storageUuid) ?? []) uuids.add(uuid)

    let deleted = 0
    let bytes = 0
    for (const file of await ctx.db.system.query("_storage").collect()) {
      if (ids.has(file._id) || Date.now() - file._creationTime < day) continue
      const uuid = (await ctx.storage.getUrl(file._id))?.match(storageUuid)?.[0]
      if (!uuid || uuids.has(uuid)) continue
      if (!dryRun) await ctx.storage.delete(file._id)
      deleted++
      bytes += file.size
    }
    return { deleted, megabytes: Math.round(bytes / 1024 / 1024) }
  },
})

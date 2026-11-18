import { env } from "./_generated/server"
import type { Id } from "./_generated/dataModel"

type StorageReader = { storage: { getUrl: (id: Id<"_storage">) => Promise<string | null> } }

// Public file URL. When MEDIA_BASE_URL is set, files are served through the
// R2-backed media domain (github.com/ntedvs/media) instead of directly from Convex.
export async function mediaUrl(ctx: StorageReader, id: Id<"_storage">) {
  const url = await ctx.storage.getUrl(id)
  if (!url || !env.MEDIA_BASE_URL) return url
  return url.replace(env.CONVEX_CLOUD_URL, env.MEDIA_BASE_URL)
}

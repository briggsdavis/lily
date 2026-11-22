import { ConvexHttpClient } from "convex/browser"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { isPageEnabled, visibilityRef } from "@/lib/page-visibility"

const getDisabledPages = unstable_cache(
  async () => {
    const url = process.env.NEXT_PUBLIC_CONVEX_URL
    if (!url) return []
    return await new ConvexHttpClient(url).query(visibilityRef, {})
  },
  ["page-visibility"],
  { revalidate: 60 },
)

export async function requirePageEnabled(path: string) {
  let disabled: string[] = []
  try {
    disabled = await getDisabledPages()
  } catch {
    return
  }
  if (!isPageEnabled(path, disabled)) notFound()
}

import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"
import { ConvexHttpClient } from "convex/browser"
import { NextResponse } from "next/server"
import { isPageEnabled, visibilityRef } from "@/lib/page-visibility"

const authMiddleware = process.env.NEXT_PUBLIC_CONVEX_URL ? convexAuthNextjsMiddleware() : null

export default async function proxy(
  ...args: Parameters<ReturnType<typeof convexAuthNextjsMiddleware>>
) {
  const pathname = args[0].nextUrl.pathname
  const url = process.env.NEXT_PUBLIC_CONVEX_URL
  if (
    url &&
    /^\/(?:$|about(?:\/|$)|events(?:\/|$)|catering(?:\/|$)|contact(?:\/|$)|menu(?:\/|$))/.test(
      pathname,
    )
  ) {
    try {
      const disabled = await new ConvexHttpClient(url).query(visibilityRef, {})
      if (!isPageEnabled(pathname, disabled)) {
        return new NextResponse("Page not found", {
          status: 404,
          headers: { "Cache-Control": "no-store" },
        })
      }
    } catch {
      return new NextResponse("Temporarily unavailable", {
        status: 503,
        headers: { "Cache-Control": "no-store" },
      })
    }
  }
  return authMiddleware?.(...args)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

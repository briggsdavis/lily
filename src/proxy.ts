import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"
import { NextResponse } from "next/server"

const authMiddleware = process.env.NEXT_PUBLIC_CONVEX_URL ? convexAuthNextjsMiddleware() : null

export default function proxy(...args: Parameters<ReturnType<typeof convexAuthNextjsMiddleware>>) {
  return authMiddleware ? authMiddleware(...args) : NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/api/auth"],
}

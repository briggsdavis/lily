import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

const authMiddleware = process.env.NEXT_PUBLIC_CONVEX_URL ? convexAuthNextjsMiddleware() : null

export default function proxy(...args: Parameters<ReturnType<typeof convexAuthNextjsMiddleware>>) {
  return authMiddleware?.(...args)
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}

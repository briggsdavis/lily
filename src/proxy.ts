import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

export default convexAuthNextjsMiddleware()

export const config = {
  // Run on all routes except static assets and Next.js internals.
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}

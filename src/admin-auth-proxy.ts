import { convexAuthNextjsMiddleware } from "@convex-dev/auth/nextjs/server"

// Reserved for a future server deployment of the private admin area.
export default convexAuthNextjsMiddleware()

export const config = {
  matcher: ["/admin/:path*", "/api/:path*"],
}

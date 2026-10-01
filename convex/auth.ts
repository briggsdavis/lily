import { Password } from "@convex-dev/auth/providers/Password"
import { convexAuth } from "@convex-dev/auth/server"
import { ADMIN_ACCESS_DENIED, isAllowedAdminEmail, normalizeEmail } from "./adminAccess"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [
    Password({
      profile(params) {
        if (typeof params.email !== "string") {
          throw new Error("Email is required")
        }

        const email = normalizeEmail(params.email)
        if (!isAllowedAdminEmail(email)) {
          throw new Error(ADMIN_ACCESS_DENIED)
        }

        return { email }
      },
    }),
  ],
})

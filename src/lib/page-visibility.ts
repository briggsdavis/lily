import { makeFunctionReference } from "convex/server"

export const visibilityRef = makeFunctionReference<"query", Record<string, never>, string[]>(
  "pageVisibility:disabled",
)
export const setVisibilityRef = makeFunctionReference<
  "mutation",
  { path: string; enabled: boolean },
  null
>("pageVisibility:set")

export function isPageEnabled(path: string, disabled: readonly string[]) {
  const pathname = path.split(/[?#]/)[0].replace(/\/$/, "") || "/"
  return !disabled.some(
    (entry) => pathname === entry || (entry !== "/" && pathname.startsWith(`${entry}/`)),
  )
}

"use client"

import { usePathname } from "next/navigation"
import { useQuery } from "convex/react"
import { createContext, useContext, type ReactNode } from "react"
import { isPageEnabled, visibilityRef } from "@/lib/page-visibility"

const VisibilityContext = createContext<readonly string[]>([])
export const useDisabledPages = () => useContext(VisibilityContext)

function ConnectedVisibility({ children }: { children: ReactNode }) {
  const disabled = useQuery(visibilityRef, {})
  const pathname = usePathname()
  if (!pathname.startsWith("/admin") && disabled === undefined) {
    return <main aria-busy="true" className="min-h-dvh bg-cream" />
  }
  if (!pathname.startsWith("/admin") && disabled && !isPageEnabled(pathname, disabled)) {
    return <main className="grid min-h-dvh place-content-center bg-cream px-6 text-center text-deep-brown"><h1 className="text-3xl">Page not found</h1><p className="mt-4">This page is unavailable.</p></main>
  }
  return <VisibilityContext.Provider value={disabled ?? []}>{children}</VisibilityContext.Provider>
}

export function PageVisibilityProvider({ children }: { children: ReactNode }) {
  return process.env.NEXT_PUBLIC_CONVEX_URL ? (
    <ConnectedVisibility>{children}</ConnectedVisibility>
  ) : (
    children
  )
}

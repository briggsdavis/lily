"use client"

import { useQuery } from "convex/react"
import { createContext, useContext, type ReactNode } from "react"
import { visibilityRef } from "@/lib/page-visibility"

const VisibilityContext = createContext<readonly string[]>([])
export const useDisabledPages = () => useContext(VisibilityContext)

function ConnectedVisibility({ children }: { children: ReactNode }) {
  const disabled = useQuery(visibilityRef, {})
  return <VisibilityContext.Provider value={disabled ?? []}>{children}</VisibilityContext.Provider>
}

export function PageVisibilityProvider({ children }: { children: ReactNode }) {
  return process.env.NEXT_PUBLIC_CONVEX_URL ? (
    <ConnectedVisibility>{children}</ConnectedVisibility>
  ) : (
    children
  )
}

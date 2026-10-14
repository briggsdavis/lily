"use client"

import { useMutation } from "convex/react"
import { usePathname } from "next/navigation"
import { useEffect } from "react"
import { trackPageViewRef } from "@/lib/admin-api"

export function AnalyticsTracker() {
  const pathname = usePathname()
  const track = useMutation(trackPageViewRef)

  useEffect(() => {
    if (pathname.startsWith("/admin")) return
    let sessionId = window.sessionStorage.getItem("lily:analytics-session")
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      window.sessionStorage.setItem("lily:analytics-session", sessionId)
    }
    void track({ path: pathname, sessionId })
  }, [pathname, track])

  return null
}

"use client"

import { AdminAuth } from "@/components/admin-auth"
import { ConvexClientProvider } from "@/components/convex-client-provider"

export function AdminRuntime() {
  return (
    <ConvexClientProvider>
      <AdminAuth />
    </ConvexClientProvider>
  )
}

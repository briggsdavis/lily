"use client"

import dynamic from "next/dynamic"
import type { ReactNode } from "react"

const AdminRuntime = dynamic(
  () => import("@/components/admin-runtime").then((module) => module.AdminRuntime),
  {
    loading: () => <p className="text-sm">Loading the admin area...</p>,
    ssr: false,
  },
)

export function AdminClient({ children }: { children?: ReactNode }) {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return (
      <div className="grid min-h-dvh place-items-center bg-cream px-5 text-deep-brown">
        <p className="max-w-md border border-deep-brown/20 p-8 text-sm">
          The admin area is not configured in this environment.
        </p>
      </div>
    )
  }

  return <AdminRuntime>{children}</AdminRuntime>
}

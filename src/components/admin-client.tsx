"use client"

import dynamic from "next/dynamic"

const AdminRuntime = dynamic(
  () => import("@/components/admin-runtime").then((module) => module.AdminRuntime),
  {
    loading: () => <p className="text-sm">Loading the admin area...</p>,
    ssr: false,
  },
)

export function AdminClient() {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    return <p className="max-w-md text-sm">The admin area is not configured in this environment.</p>
  }

  return <AdminRuntime />
}

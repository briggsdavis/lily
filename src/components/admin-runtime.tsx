"use client"

import type { ReactNode } from "react"
import { AdminAuth } from "@/components/admin-auth"

export function AdminRuntime({ children }: { children?: ReactNode }) {
  return <AdminAuth>{children}</AdminAuth>
}

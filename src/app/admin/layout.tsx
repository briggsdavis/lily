import type { ReactNode } from "react"
import { AdminClient } from "@/components/admin-client"
import { AdminShell } from "@/components/admin-shell"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AdminClient>
      <AdminShell>{children}</AdminShell>
    </AdminClient>
  )
}

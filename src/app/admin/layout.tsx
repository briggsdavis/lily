import type { ReactNode } from "react"
import { AdminClient } from "@/components/admin-client"
import { AdminShell } from "@/components/admin-shell"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="contents [&_a[href]]:cursor-pointer [&_button:disabled]:cursor-not-allowed [&_button:not(:disabled)]:cursor-pointer [&_input[type=checkbox]:not(:disabled)]:cursor-pointer [&_input[type=file]:not(:disabled)]:cursor-pointer [&_input[type=radio]:not(:disabled)]:cursor-pointer [&_label:has(input[type=checkbox]:not(:disabled))]:cursor-pointer [&_label:has(input[type=file]:not(:disabled))]:cursor-pointer [&_label:has(input[type=radio]:not(:disabled))]:cursor-pointer [&_select:disabled]:cursor-not-allowed [&_select:not(:disabled)]:cursor-pointer">
      <AdminClient>
        <AdminShell>{children}</AdminShell>
      </AdminClient>
    </div>
  )
}

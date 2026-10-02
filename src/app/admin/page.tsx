import type { Metadata } from "next"
import { AdminAuth } from "@/components/admin-auth"

export const metadata: Metadata = {
  title: "Admin",
}

export default function AdminPage() {
  return (
    <section className="space-y-12">
      <div>
        <p className="mb-3 text-xs font-semibold tracking-[0.14em] uppercase opacity-65">
          Private area
        </p>
        <h1 className="font-display text-[clamp(3rem,10vw,7rem)] leading-[0.95] font-medium tracking-[-0.06em]">
          Admin
        </h1>
      </div>
      <AdminAuth />
    </section>
  )
}

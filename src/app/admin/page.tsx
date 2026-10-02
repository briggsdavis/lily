import { Metadata } from "next"
import { AdminAuth } from "@/components/admin-auth"

export const metadata: Metadata = {
  title: "Admin",
}

export default function AdminPage() {
  return (
    <div className="px-5 py-16 md:px-8 md:py-24 xl:px-16 xl:py-40">
      <section className="space-y-12">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase opacity-65">Private area</p>
          <h1 className="font-display text-5xl font-medium md:text-7xl xl:text-8xl">Admin</h1>
        </div>
        <AdminAuth />
      </section>
    </div>
  )
}

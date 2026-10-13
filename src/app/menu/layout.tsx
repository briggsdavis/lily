import type { Metadata } from "next"
import type { ReactNode } from "react"
import { MenuGallery } from "@/components/menu-gallery"

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Lily's seasonal menu of considered plates, handmade pasta, market vegetables, desserts, and garden-led cocktails.",
}

export default function MenuLayout({ children }: { children: ReactNode }) {
  return (
    <section className="min-h-svh bg-espresso text-pink" data-nav-tone="dark">
      <MenuGallery />
      <div className="px-page">{children}</div>
    </section>
  )
}

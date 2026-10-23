"use client"

import { useQuery } from "convex/react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { menuCategories } from "@/data/menu"
import { publicMenuPagesRef } from "@/lib/admin-api"
import { isPageEnabled, visibilityRef } from "@/lib/page-visibility"

function MenuDestination({ slugs, disabled }: { slugs: string[]; disabled: string[] }) {
  const router = useRouter()
  const slug = slugs.find((value) => isPageEnabled(`/menu/${value}`, disabled))
  useEffect(() => {
    if (slug) router.replace(`/menu/${slug}`)
  }, [router, slug])
  return <div className="px-page py-40 text-center text-cream">{slug ? "Opening menu…" : "The menu is currently unavailable."}</div>
}

function ConnectedMenuLanding() {
  const pages = useQuery(publicMenuPagesRef, {})
  const disabled = useQuery(visibilityRef, {})
  if (!pages || !disabled) return <div className="min-h-svh" />
  return <MenuDestination slugs={pages.length ? pages.map((page) => page.slug) : menuCategories.map((page) => page.slug)} disabled={disabled} />
}

export function MenuLanding() {
  return process.env.NEXT_PUBLIC_CONVEX_URL ? <ConnectedMenuLanding /> : <MenuDestination slugs={menuCategories.map((page) => page.slug)} disabled={[]} />
}

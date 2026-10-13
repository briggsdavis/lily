"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const tones: Record<string, string> = {
  menu: "bg-espresso text-pink",
  events: "bg-dark-maroon text-cream",
  catering: "bg-espresso text-cream",
  contact: "bg-burgundy text-pink",
}

export function SiteBackground({ children }: { children: ReactNode }) {
  const section = usePathname().split("/")[1]
  const tone = tones[section] ?? "bg-cream text-orange-brown"

  return <div className={`flex min-h-dvh flex-col ${tone}`}>{children}</div>
}

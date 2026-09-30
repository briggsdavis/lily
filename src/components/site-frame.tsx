"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"

const routes = [
  { href: "/", label: "Home", tone: "bg-cream text-orange-brown" },
  { href: "/menu", label: "Menu", tone: "bg-dark-green text-pink" },
  { href: "/events", label: "Events", tone: "bg-dark-green text-cream" },
  { href: "/about", label: "About", tone: "bg-cream text-orange-brown" },
  { href: "/contact", label: "Contact", tone: "bg-burgundy text-pink" },
] as const

export function SiteFrame({ children }: { children: ReactNode }) {
  const section = `/${usePathname().split("/")[1]}`
  const current = routes.find((route) => route.href === section)

  return (
    <div className={`min-h-dvh ${(current ?? routes[0]).tone}`}>
      <header className="flex flex-col items-start gap-4 px-[clamp(1.25rem,4vw,4rem)] py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <Link className="font-bold tracking-[0.08em] uppercase" href="/">
          Lily
        </Link>
        <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-4 text-sm">
          {routes.map((route) => (
            <Link
              aria-current={route === current ? "page" : undefined}
              className="underline-offset-[0.3em] hover:underline focus-visible:underline aria-[current=page]:underline"
              href={route.href}
              key={route.href}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="px-[clamp(1.25rem,4vw,4rem)] py-[clamp(4rem,12vw,10rem)]">{children}</main>
    </div>
  )
}

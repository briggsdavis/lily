"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const routes = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Navbar() {
  const current = "/" + usePathname().split("/")[1]

  return (
    <header className="flex flex-col items-start gap-4 px-5 py-6 md:flex-row md:items-center md:justify-between md:gap-8 md:px-8 xl:px-16">
      <Link className="font-bold uppercase" href="/">
        Lily
      </Link>

      <nav aria-label="Main" className="flex flex-wrap gap-x-6 gap-y-4 text-sm">
        {routes.map((route) => (
          <Link
            aria-current={route.href === current ? "page" : undefined}
            className="animated-underline"
            href={route.href}
            key={route.href}
          >
            {route.label}
          </Link>
        ))}
      </nav>
    </header>
  )
}

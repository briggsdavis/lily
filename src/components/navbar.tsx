"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { TransitionLink } from "@/components/transition-link"

const routes = [
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Navbar() {
  const current = "/" + usePathname().split("/")[1]
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 8)
    update()
    window.addEventListener("scroll", update, { passive: true })
    return () => window.removeEventListener("scroll", update)
  }, [])

  return (
    <header
      className="hero-intro-header fixed inset-x-0 top-0 z-60 grid grid-cols-[1fr_auto_1fr] items-center bg-transparent px-page py-5 transition-colors duration-500 ease-lily data-scrolled:bg-burgundy data-scrolled:text-cream"
      data-scrolled={scrolled || undefined}
      data-site-chrome
    >
      <TransitionLink aria-label="Lily home" className="justify-self-start" href="/">
        <Image
          alt=""
          className="size-10 md:size-12"
          height={48}
          preload
          src="/FAVICON-VALLEY.svg"
          width={48}
        />
      </TransitionLink>

      <nav aria-label="Main" className="border-hand relative px-8 py-3">
        <ul className="flex items-center gap-6 md:gap-10">
          {routes.map((route) => (
            <li key={route.href}>
              <TransitionLink
                aria-current={route.href === current ? "page" : undefined}
                className="animated-underline font-display text-sm font-bold uppercase md:text-base"
                href={route.href}
              >
                {route.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </nav>

      <TransitionLink
        className="animated-underline justify-self-end font-display text-sm font-bold uppercase md:text-base"
        href="/contact?reason=reservation"
      >
        Reserve
      </TransitionLink>
    </header>
  )
}

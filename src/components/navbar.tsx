"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useState } from "react"
import { TransitionLink } from "@/components/transition-link"

const routes = [
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Navbar() {
  const pathname = usePathname()
  const current = "/" + pathname.split("/")[1]
  const [menuOpen, setMenuOpen] = useState(false)
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    if (!menuOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [menuOpen])

  return (
    <header className="hero-intro-header pointer-events-none fixed inset-x-0 top-0 z-60 flex justify-center px-3 py-5 md:px-4">
      <nav
        aria-label="Main"
        className="border-hand pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-[3px] bg-transparent px-3 py-3 text-cream backdrop-blur-md md:w-auto md:max-w-full md:[scrollbar-width:none] md:overflow-x-auto md:px-7 md:py-4 md:backdrop-blur-none md:[&::-webkit-scrollbar]:hidden"
        data-site-chrome
      >
        <div className="flex items-center md:hidden">
          <TransitionLink
            aria-current={current === "/" ? "page" : undefined}
            href="/"
            onNavigate={closeMenu}
          >
            <Image
              alt="Lily — home"
              className="h-auto w-[4.6rem]"
              height={767}
              preload
              src="/PRIMARY-HORIZONTAL-CREAM.png"
              width={2329}
            />
          </TransitionLink>

          <div className="ml-auto flex items-center gap-2">
            <TransitionLink
              className="rounded-full border border-cream/70 px-3 py-2 text-[0.65rem] font-bold uppercase"
              href="/contact?reason=reservation"
              onNavigate={closeMenu}
            >
              Reserve
            </TransitionLink>
            <button
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              className="grid size-9 cursor-pointer place-items-center rounded-full border border-cream/70"
              onClick={toggleMenu}
              type="button"
            >
              <span className="relative block h-3.5 w-4" aria-hidden="true">
                <span
                  className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "top-1.5 rotate-45" : "top-0.5"}`}
                />
                <span
                  className={`absolute top-1.5 left-0 h-px w-4 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
                />
                <span
                  className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "top-1.5 -rotate-45" : "top-2.5"}`}
                />
              </span>
            </button>
          </div>
        </div>

        {menuOpen ? (
          <ul
            className="mt-3 grid gap-1 border-t border-cream/30 pt-3 md:hidden"
            id="mobile-navigation"
          >
            {routes.map((route) => (
              <li key={route.href}>
                <TransitionLink
                  aria-current={route.href === current ? "page" : undefined}
                  className="flex min-h-10 items-center justify-between py-1 font-display text-lg"
                  href={route.href}
                  onNavigate={closeMenu}
                >
                  {route.label}
                  <span aria-hidden="true">↗</span>
                </TransitionLink>
              </li>
            ))}
          </ul>
        ) : null}

        <ul className="hidden w-max items-center gap-8 md:flex">
          <li className="shrink-0 border-r border-cream/30 pr-2 md:pr-8">
            <TransitionLink aria-current={current === "/" ? "page" : undefined} href="/">
              <Image
                alt="Lily — home"
                className="h-auto w-[3.15rem] md:w-[5.6rem]"
                height={767}
                preload
                src="/PRIMARY-HORIZONTAL-CREAM.png"
                width={2329}
              />
            </TransitionLink>
          </li>
          {routes.map((route) => (
            <li className="shrink-0" key={route.href}>
              <TransitionLink
                aria-current={route.href === current ? "page" : undefined}
                className="animated-underline font-display text-[0.6rem] font-bold uppercase md:text-base"
                href={route.href}
              >
                {route.label}
              </TransitionLink>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}

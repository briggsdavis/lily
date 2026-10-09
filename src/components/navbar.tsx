"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
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

  return (
    <header className="hero-intro-header pointer-events-none fixed inset-x-0 top-0 z-60 flex justify-center px-3 py-5 md:px-4">
      <nav
        aria-label="Main"
        className="border-hand pointer-events-auto relative max-w-full overflow-x-auto rounded-[3px] bg-transparent px-2.5 py-3 text-cream shadow-lg shadow-burgundy/15 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:px-7 md:py-4"
        data-site-chrome
      >
        <ul className="flex w-max items-center gap-2 md:gap-8">
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

"use client"

import Image from "next/image"
import { useDisabledPages } from "@/components/page-visibility"
import { TransitionLink } from "@/components/transition-link"
import { isPageEnabled } from "@/lib/page-visibility"

const marqueeRoutes = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/catering", label: "Catering" },
  { href: "/events", label: "Events" },
  { href: "/menu", label: "Menu" },
] as const

function MarqueeGroup({ copy = false }: { copy?: boolean }) {
  const disabled = useDisabledPages()
  const routes = marqueeRoutes.filter((route) => isPageEnabled(route.href, disabled))
  return (
    <div
      aria-hidden={copy || undefined}
      className={`reserve-navigation-group flex shrink-0 items-center gap-[0.22em] pr-[0.22em] ${copy ? "reserve-navigation-copy" : ""}`}
    >
      {routes.map((route) => (
        <div className="flex shrink-0 items-center gap-[0.22em]" key={route.href}>
          <TransitionLink
            aria-hidden={copy || undefined}
            className="cursor-pointer font-header-stencil leading-[0.78] uppercase transition-opacity duration-300 ease-out hover:opacity-75 focus-visible:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-[0.08em] focus-visible:outline-current"
            href={route.href}
            tabIndex={copy ? -1 : undefined}
          >
            {route.label}
          </TransitionLink>
          <Image
            alt=""
            aria-hidden="true"
            className="size-[0.72em] shrink-0 object-contain"
            height={1254}
            sizes="12vw"
            src="/images/social-work.png"
            width={1254}
          />
        </div>
      ))}
    </div>
  )
}

export function ReserveNavigationMarquee({ size = "standard" }: { size?: "large" | "standard" }) {
  return (
    <nav
      aria-label="Explore Lily"
      className={`relative z-10 -mx-5 overflow-hidden text-cream md:-mx-10 lg:-mx-16 ${size === "large" ? "pt-5 pb-16 text-[22vw] md:pt-7 md:pb-14" : "pt-5 pb-10 text-[16vw] md:py-7"}`}
    >
      <div className="reserve-navigation-track flex w-max items-center motion-reduce:w-auto">
        <MarqueeGroup />
        <MarqueeGroup copy />
      </div>
    </nav>
  )
}

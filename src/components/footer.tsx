"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import { TransitionLink } from "@/components/transition-link"

const year = new Date().getFullYear()
const routes = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Footer() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const trigger = triggerRef.current
    const footer = footerRef.current
    if (!trigger || !footer || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const bounds = trigger.getBoundingClientRect()
      const travel = Math.min(window.innerHeight * 0.42, bounds.height)
      const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / travel))
      const lift = (1 - progress) * Math.min(144, window.innerHeight * 0.16)
      footer.style.transform = `translate3d(0, ${lift}px, 0)`
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <div className="relative z-20 -mt-[12svh]" ref={triggerRef}>
      <footer
        className="flex min-h-[50svh] flex-col bg-cream px-page py-8 text-burgundy will-change-transform md:py-10"
        data-nav-tone="light"
        ref={footerRef}
      >
        <div className="flex flex-col gap-4 border-t border-burgundy/35 pt-4 text-xs sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col items-start gap-2">
            <p>© {year} Lily. All rights reserved.</p>
            <a
              className="animated-underline"
              href="https://socialsatisfaction.agency"
              rel="noopener noreferrer"
              target="_blank"
            >
              Made by Social Satisfaction
            </a>
          </div>
          <div className="flex flex-col gap-1 sm:text-right">
            <a
              className="animated-underline w-max sm:self-end"
              href="mailto:hello@lilyrestaurant.com"
            >
              hello@lilyrestaurant.com
            </a>
            <a className="animated-underline w-max sm:self-end" href="tel:+17245024572">
              (724) 502-4572
            </a>
            <address className="mt-1 not-italic">
              500 Grandview Crossing Dr, Gibsonia, PA 15044
            </address>
          </div>
        </div>

        <div className="mt-auto grid items-end gap-12 pt-14 sm:grid-cols-[1fr_auto] md:gap-20">
          <TransitionLink aria-label="Lily home" className="block w-28 md:w-36" href="/">
            <Image
              alt="Lily Kitchen and Cocktails"
              className="block h-auto w-full"
              height={882}
              sizes="(max-width: 768px) 7rem, 9rem"
              src="/beige-primary-logo.png"
              width={890}
            />
          </TransitionLink>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-x-10 gap-y-1 sm:justify-self-end md:gap-x-16"
          >
            {routes.map((route) => (
              <TransitionLink
                className="animated-underline w-max font-display text-2xl md:text-3xl"
                href={route.href}
                key={route.href}
              >
                {route.label}
              </TransitionLink>
            ))}
          </nav>
        </div>
      </footer>
    </div>
  )
}

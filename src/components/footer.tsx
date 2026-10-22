"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { TransitionLink } from "@/components/transition-link"
import { hasReserveCta, siteRoutes } from "@/data/site-navigation"

const year = new Date().getFullYear()

export function Footer() {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const footerRef = useRef<HTMLElement>(null)
  const pathname = usePathname()
  const overlapsReserve = hasReserveCta(pathname)

  useEffect(() => {
    const footer = footerRef.current
    const wrapper = wrapperRef.current
    if (!footer || !wrapper) return
    if (!overlapsReserve || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      footer.style.transform = ""
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const bounds = wrapper.getBoundingClientRect()
      const progress = Math.min(1, Math.max(0, (window.innerHeight - bounds.top) / 240))
      footer.style.transform = `translate3d(0, ${(1 - progress) * 56}px, 0)`
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
  }, [overlapsReserve])

  return (
    <div className={`relative z-20 ${overlapsReserve ? "-mt-10 md:-mt-14" : ""}`} ref={wrapperRef}>
      <footer
        className="bg-grey px-page py-10 text-cream will-change-transform md:py-12"
        data-nav-tone="dark"
        ref={footerRef}
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col items-center gap-9 border-y border-cream/30 py-8 text-center lg:flex-row lg:items-center lg:justify-between lg:gap-12 lg:text-left">
            <TransitionLink aria-label="Lily home" className="block w-48 shrink-0 md:w-56" href="/">
              <Image
                alt="Lily Kitchen and Cocktails"
                className="block h-auto w-full"
                height={767}
                loading="eager"
                sizes="(max-width: 768px) 12rem, 14rem"
                src="/images/primary-horizontal-cream.png"
                width={2329}
              />
            </TransitionLink>

            <nav aria-label="Footer" className="flex flex-wrap justify-center gap-x-7 gap-y-3">
              {siteRoutes.map((route) => (
                <TransitionLink
                  className="animated-underline w-max font-body text-sm font-semibold tracking-[0.14em] text-pink uppercase md:text-base"
                  href={route.href}
                  key={route.href}
                >
                  {route.label}
                </TransitionLink>
              ))}
            </nav>

            <div className="flex shrink-0 flex-col items-center gap-1 text-xs lg:items-end lg:text-right">
              <p>hello@lilyrestaurant.com</p>
              <p>(724) 502-4572</p>
              <p>Tue-Sat, 4:30-9:00 PM</p>
              <address className="not-italic">
                500 Grandview Crossing Dr, Gibsonia, PA 15044
              </address>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2 pt-5 text-center text-xs text-cream/65 sm:flex-row sm:justify-between sm:text-left">
            <p>© {year} Lily. All rights reserved.</p>
            <div className="flex flex-wrap justify-center gap-x-5 gap-y-1">
              <TransitionLink className="animated-underline" href="/privacy">
                Privacy
              </TransitionLink>
              <a
                className="animated-underline"
                href="https://socialsatisfaction.agency"
                rel="noopener noreferrer"
                target="_blank"
              >
                Made by Social Satisfaction
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

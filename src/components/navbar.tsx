"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { TransitionLink } from "@/components/transition-link"

const routes = [
  { delay: "animate-delay-110", href: "/", label: "Home" },
  { delay: "animate-delay-175", href: "/menu", label: "Menu" },
  { delay: "animate-delay-240", href: "/events", label: "Events" },
  { delay: "animate-delay-305", href: "/catering", label: "Catering" },
  { delay: "animate-delay-370", href: "/about", label: "About" },
  { delay: "animate-delay-435", href: "/contact", label: "Contact" },
] as const

export function Navbar() {
  const current = "/" + usePathname().split("/")[1]
  const [open, setOpen] = useState(false)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const actionsRef = useRef<HTMLDivElement>(null)
  const [useCreamLogo, setUseCreamLogo] = useState(
    current === "/" || current === "/menu" || current === "/events" || current === "/contact",
  )
  const [useCreamControls, setUseCreamControls] = useState(
    current === "/" || current === "/menu" || current === "/events",
  )
  const closeMenu = useCallback(() => setOpen(false), [])
  const toggleMenu = useCallback(() => setOpen((value) => !value), [])

  useEffect(() => {
    if (window.location.pathname.split("/")[1] !== current.slice(1)) return

    const darkBackgrounds = new Set(["rgb(59, 65, 65)", "rgb(85, 58, 61)"])
    let frame = 0

    function lightOnDark(element: HTMLElement | null) {
      if (!element) return false
      const bounds = element.getBoundingClientRect()
      const x = bounds.left + bounds.width / 2
      const y = bounds.top + bounds.height / 2
      const layers = document.elementsFromPoint(x, y)

      for (const layer of layers) {
        if (layer.closest("[data-site-chrome]")) continue

        const tone = layer.closest<HTMLElement>("[data-nav-tone]")?.dataset.navTone
        if (tone) return tone !== "light"

        const background = window.getComputedStyle(layer).backgroundColor
        if (background === "rgba(0, 0, 0, 0)" || background === "transparent") continue

        return darkBackgrounds.has(background)
      }

      return false
    }

    function updateControlColor() {
      setUseCreamLogo(lightOnDark(logoRef.current))
      setUseCreamControls(lightOnDark(actionsRef.current))
      frame = 0
    }

    function requestControlColorUpdate() {
      if (frame) return
      frame = window.requestAnimationFrame(updateControlColor)
    }

    updateControlColor()
    window.addEventListener("scroll", requestControlColorUpdate, { passive: true })
    window.addEventListener("resize", requestControlColorUpdate)
    return () => {
      window.removeEventListener("scroll", requestControlColorUpdate)
      window.removeEventListener("resize", requestControlColorUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [current])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [open])

  useEffect(() => {
    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [])

  const lightLogo = open || useCreamLogo
  const lightControls = open || useCreamControls

  return (
    <>
      <header
        className={`hero-intro-header fixed inset-x-0 top-0 z-60 flex items-center justify-between px-page py-5 transition-colors duration-320 ${lightControls ? "text-warm-white" : "text-brand-brown"}`}
        data-site-chrome
      >
        <Link aria-label="Lily home" className="block w-28 md:w-36 lg:w-44" href="/" ref={logoRef}>
          <span className="relative block aspect-[2329/767]">
            <Image
              alt={lightLogo ? "" : "Lily Kitchen and Cocktails"}
              className={`object-contain transition-opacity duration-320 ${lightLogo ? "opacity-0" : "opacity-100"}`}
              fill
              priority
              sizes="(max-width: 768px) 7rem, (max-width: 1024px) 9rem, 11rem"
              src="/PRIMARY-HORIZONTAL-BROWN.png"
            />
            <Image
              alt={lightLogo ? "Lily Kitchen and Cocktails" : ""}
              className={`object-contain transition-opacity duration-320 ${lightLogo ? "opacity-100" : "opacity-0"}`}
              fill
              priority
              sizes="(max-width: 768px) 7rem, (max-width: 1024px) 9rem, 11rem"
              src="/PRIMARY-HORIZONTAL-CREAM.png"
            />
          </span>
        </Link>

        <div className="flex items-center gap-4 lg:gap-6" ref={actionsRef}>
          <TransitionLink
            aria-current={current === "/contact" ? "page" : undefined}
            className="animated-underline text-xs font-bold uppercase"
            href="/contact?reason=reservation"
          >
            Reserve
          </TransitionLink>
          <button
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="group relative z-70 grid size-12 cursor-pointer place-content-center gap-2 rounded-full border border-current"
            onClick={toggleMenu}
            type="button"
          >
            <span className="block h-px w-5 bg-current transition-transform duration-350 group-aria-expanded:translate-y-1 group-aria-expanded:rotate-45" />
            <span className="block h-px w-5 bg-current transition-transform duration-350 group-aria-expanded:-translate-y-1 group-aria-expanded:-rotate-45" />
          </button>
        </div>
      </header>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-50 bg-zinc-900/90 text-cream backdrop-blur-xl transition-all duration-450 ${open ? "visible opacity-100" : "invisible opacity-0"}`}
        data-site-chrome
      >
        <div className="grid min-h-full content-end items-end gap-8 px-page pt-28 pb-8 md:grid-cols-5 md:gap-16 md:pb-16 lg:gap-32">
          <nav aria-label="Main" className="flex flex-col items-start md:col-span-3">
            <p className="mb-5 eyebrow">Explore Lily</p>
            {routes.map((route) => (
              <TransitionLink
                aria-current={route.href === current ? "page" : undefined}
                className={`block w-full border-t border-cream/30 pt-1 pb-2 font-display text-4xl transition-colors duration-250 hover:text-pink focus-visible:text-pink aria-[current=page]:text-pink md:text-5xl lg:text-6xl ${open ? `animate-menu-item ${route.delay}` : "opacity-0"}`}
                href={route.href}
                key={route.href}
                onNavigate={closeMenu}
              >
                {route.label}
              </TransitionLink>
            ))}
          </nav>

          <div
            className={`flex max-w-sm flex-col items-start gap-1 pb-3 text-base md:col-span-2 md:gap-3 lg:text-lg ${open ? "animate-menu-item animate-delay-360" : "opacity-0"}`}
          >
            <p className="eyebrow">Visit</p>
            <address className="my-1.5 not-italic md:mt-2 md:mb-4">
              500 Grandview Crossing Dr
              <br />
              Gibsonia, PA 15044
            </address>
            <a href="tel:+17245024572">(724) 502-4572</a>
            <a href="mailto:hello@lilyrestaurant.com">hello@lilyrestaurant.com</a>
            <div className="mt-1.5 md:mt-6">
              <p>Tue–Thu · 5:00 PM–11:00 PM</p>
              <p>Fri–Sun · 12:00 PM–12:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

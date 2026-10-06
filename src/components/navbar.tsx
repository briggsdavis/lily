"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { TransitionLink } from "@/components/transition-link"

const routes = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Navbar() {
  const current = "/" + usePathname().split("/")[1]
  const [open, setOpen] = useState(false)
  const actionsRef = useRef<HTMLDivElement>(null)
  const home = current === "/"
  const [useCreamControls, setUseCreamControls] = useState(
    current === "/menu" || current === "/events",
  )

  useEffect(() => {
    const darkBackgrounds = new Set(["rgb(59, 65, 65)", "rgb(85, 58, 61)"])
    let frame = 0

    function updateControlColor() {
      const actions = actionsRef.current
      if (!actions) return

      const bounds = actions.getBoundingClientRect()
      const x = bounds.left + bounds.width / 2
      const y = bounds.top + bounds.height / 2
      const layers = document.elementsFromPoint(x, y)
      let nextUseCream = false

      for (const layer of layers) {
        if (layer.closest("[data-site-chrome]")) continue

        const background = window.getComputedStyle(layer).backgroundColor
        if (background === "rgba(0, 0, 0, 0)" || background === "transparent") continue

        nextUseCream = darkBackgrounds.has(background)
        break
      }

      setUseCreamControls(nextUseCream)
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

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-60 flex items-center justify-between px-page py-5 transition-colors duration-320 ${open || useCreamControls ? "text-cream" : "text-orange-brown"}`}
        data-site-chrome
      >
        <Link
          aria-label="Lily home"
          className={`block w-16 md:w-20 lg:w-24 ${home ? "animate-drop-in animate-delay-600" : ""}`}
          href="/"
        >
          <Image
            alt="Lily Kitchen and Cocktails"
            className="block h-auto w-full"
            height={882}
            priority={home}
            src="/beige-primary-logo.png"
            width={890}
          />
        </Link>

        <div className="flex items-center gap-4 lg:gap-6" ref={actionsRef}>
          <TransitionLink
            aria-current={current === "/contact" ? "page" : undefined}
            className={`animated-underline text-xs font-bold uppercase ${home ? "animate-drop-in animate-delay-700" : ""}`}
            href="/contact?reason=reservation"
          >
            Reserve
          </TransitionLink>
          <button
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className={`group relative z-70 grid size-12 cursor-pointer place-content-center gap-2 rounded-full border border-current ${home ? "animate-drop-in animate-delay-820" : ""}`}
            onClick={() => setOpen((value) => !value)}
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
            {routes.map((route, index) => (
              <TransitionLink
                aria-current={route.href === current ? "page" : undefined}
                className={`block w-full border-t border-cream/30 pt-1 pb-2 font-display text-4xl transition-colors duration-250 hover:text-pink focus-visible:text-pink aria-[current=page]:text-pink md:text-5xl lg:text-6xl ${open ? "animate-menu-item" : "opacity-0"}`}
                href={route.href}
                key={route.href}
                onNavigate={() => setOpen(false)}
                style={{ "--animate-delay": `${110 + index * 65}ms` } as React.CSSProperties}
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

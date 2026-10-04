"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { TransitionLink } from "@/components/transition-link"

const routes = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

export function Navbar() {
  const current = "/" + usePathname().split("/")[1]
  const [open, setOpen] = useState(false)
  const [useCreamControls, setUseCreamControls] = useState(
    current === "/menu" || current === "/events",
  )

  useEffect(() => {
    const darkBackgrounds = new Set(["rgb(59, 65, 65)", "rgb(85, 58, 61)"])
    let frame = 0

    function updateControlColor() {
      const actions = document.querySelector<HTMLElement>(".site-header__actions")
      if (!actions) return

      const bounds = actions.getBoundingClientRect()
      const x = bounds.left + bounds.width / 2
      const y = bounds.top + bounds.height / 2
      const layers = document.elementsFromPoint(x, y)
      let nextUseCream = false

      for (const layer of layers) {
        if (layer.closest(".site-header") || layer.closest(".menu-overlay")) continue

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
        className={`site-header ${current === "/" ? "site-header--home" : ""} ${useCreamControls ? "site-header--cream-controls" : "site-header--brown-controls"}`}
      >
        <Link aria-label="Lily home" className="brand-mark" href="/">
          <Image
            alt="Lily Kitchen and Cocktails"
            height={882}
            priority={current === "/"}
            src="/beigeprimarylogo.png"
            width={890}
          />
        </Link>

        <div className="site-header__actions">
          <TransitionLink
            aria-current={current === "/contact" ? "page" : undefined}
            className="site-header__contact animated-underline"
            href="/contact?reason=reservation"
          >
            Reserve
          </TransitionLink>
          <button
            aria-expanded={open}
            aria-label={open ? "Close navigation" : "Open navigation"}
            className="menu-toggle"
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span />
            <span />
          </button>
        </div>
      </header>

      <div aria-hidden={!open} className={`menu-overlay ${open ? "is-open" : ""}`}>
        <div className="menu-overlay__inner">
          <nav aria-label="Main" className="menu-overlay__nav">
            <p className="eyebrow">Explore Lily</p>
            {routes.map((route, index) => (
              <TransitionLink
                aria-current={route.href === current ? "page" : undefined}
                className="menu-overlay__link"
                href={route.href}
                key={route.href}
                onNavigate={() => setOpen(false)}
                style={{ "--item-index": index } as React.CSSProperties}
              >
                <span>0{index + 1}</span>
                {route.label}
              </TransitionLink>
            ))}
          </nav>

          <div className="menu-overlay__contact">
            <p className="eyebrow">Visit</p>
            <address>
              214 Smallman Street
              <br />
              Pittsburgh, PA 15222
            </address>
            <a href="tel:+14125550142">(412) 555-0142</a>
            <a href="mailto:hello@lilyrestaurant.com">hello@lilyrestaurant.com</a>
            <div className="menu-overlay__hours">
              <p>Tue–Thu · 5:00 PM–11:00 PM</p>
              <p>Fri–Sun · 12:00 PM–12:00 AM</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

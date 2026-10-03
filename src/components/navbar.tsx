"use client"

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
      <header className="site-header">
        <Link aria-label="Lily home" className="brand-mark" href="/">
          <span>Lily</span>
          <small>Kitchen &amp; Cocktails</small>
        </Link>

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
              14 Garden Row<br />
              Madrid, 28004
            </address>
            <a href="tel:+34915550142">+34 915 550 142</a>
            <a href="mailto:hello@lilyrestaurant.com">hello@lilyrestaurant.com</a>
            <div className="menu-overlay__hours">
              <p>Tue–Thu · 18:00–00:00</p>
              <p>Fri–Sun · 13:00–00:30</p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

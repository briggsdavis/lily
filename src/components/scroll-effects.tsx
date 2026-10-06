"use client"

import { usePathname } from "next/navigation"
import { useLayoutEffect } from "react"

export function ScrollEffects() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = document.documentElement
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    root.classList.add("reveal-ready")

    if (reduceMotion) {
      revealItems.forEach((item) => item.classList.add("is-visible"))
      return () => root.classList.remove("reveal-ready")
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-visible")
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -10%", threshold: 0.08 },
    )

    const revealTimer = window.setTimeout(() => {
      revealItems.forEach((item) => observer.observe(item))
    }, 90)

    return () => {
      window.clearTimeout(revealTimer)
      observer.disconnect()
      root.classList.remove("reveal-ready")
    }
  }, [pathname])

  return null
}

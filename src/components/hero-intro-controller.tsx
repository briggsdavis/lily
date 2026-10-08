"use client"

import { usePathname } from "next/navigation"
import { useLayoutEffect } from "react"

const cleanupDelay = 2400

export function HeroIntroController() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = document.documentElement
    if (pathname !== "/") {
      root.classList.remove("hero-intro-pending", "hero-intro-running")
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      root.classList.remove("hero-intro-pending", "hero-intro-running")
      return
    }

    root.classList.add("hero-intro-pending")
    root.classList.remove("hero-intro-running")

    const startFrame = window.requestAnimationFrame(() => {
      root.classList.add("hero-intro-running")
    })

    const timer = window.setTimeout(() => {
      root.classList.remove("hero-intro-pending", "hero-intro-running")
    }, cleanupDelay)

    return () => {
      window.cancelAnimationFrame(startFrame)
      window.clearTimeout(timer)
      root.classList.remove("hero-intro-pending", "hero-intro-running")
    }
  }, [pathname])

  return null
}

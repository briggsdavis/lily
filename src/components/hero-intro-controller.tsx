"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const storageKey = "lily-hero-intro-seen"

export function HeroIntroController() {
  const pathname = usePathname()

  useEffect(() => {
    if (pathname !== "/") return

    const root = document.documentElement
    if (!root.classList.contains("hero-intro-pending")) return

    root.classList.add("hero-intro-running")
    window.sessionStorage.setItem(storageKey, "true")

    const timer = window.setTimeout(() => {
      root.classList.remove("hero-intro-pending", "hero-intro-running")
    }, 3050)

    return () => {
      window.clearTimeout(timer)
      root.classList.remove("hero-intro-pending", "hero-intro-running")
    }
  }, [pathname])

  return null
}

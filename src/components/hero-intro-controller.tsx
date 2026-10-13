"use client"

import Image from "next/image"
import { usePathname } from "next/navigation"
import { useLayoutEffect } from "react"

const cleanupDelay = 4350
const introStorageKey = "lily:hero-intro-seen"

function hasSeenIntro() {
  try {
    return window.sessionStorage.getItem(introStorageKey) === "true"
  } catch {
    return false
  }
}

function rememberIntro() {
  try {
    window.sessionStorage.setItem(introStorageKey, "true")
  } catch {
    // The intro can still run when browser storage is unavailable.
  }
}

export function HeroIntroController() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = document.documentElement
    if (pathname !== "/") {
      root.classList.remove("hero-intro-pending", "hero-intro-running")
      return
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || hasSeenIntro()) {
      root.classList.remove("hero-intro-pending", "hero-intro-running")
      return
    }

    root.classList.add("hero-intro-pending")
    root.classList.remove("hero-intro-running")

    const startFrame = window.requestAnimationFrame(() => {
      root.classList.add("hero-intro-running")
    })

    const timer = window.setTimeout(() => {
      rememberIntro()
      root.classList.remove("hero-intro-pending", "hero-intro-running")
    }, cleanupDelay)

    return () => {
      window.cancelAnimationFrame(startFrame)
      window.clearTimeout(timer)
      root.classList.remove("hero-intro-pending", "hero-intro-running")
    }
  }, [pathname])

  if (pathname !== "/") return null

  return (
    <div
      aria-hidden="true"
      className="hero-intro-overlay pointer-events-none invisible fixed inset-0 z-100 overflow-hidden opacity-0"
    >
      <div className="hero-intro-curtain absolute inset-0" />
      <div className="hero-intro-mark-path absolute top-1/2 left-1/2 z-10">
        <Image
          alt=""
          className="hero-intro-mark h-auto w-[min(13vw,4.5rem)] sm:w-[min(10vw,5.5rem)] lg:w-[min(8.5vw,6rem)]"
          height={1254}
          priority
          sizes="(max-width: 639px) 13vw, (max-width: 1023px) 10vw, 8.5vw"
          src="/Social Work.png"
          width={1254}
        />
      </div>
    </div>
  )
}

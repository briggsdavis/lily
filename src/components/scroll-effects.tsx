"use client"

import { useLayoutEffect } from "react"
import { usePathname } from "next/navigation"

export function ScrollEffects() {
  const pathname = usePathname()

  useLayoutEffect(() => {
    const root = document.documentElement
    const revealItems = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const parallaxItems = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"))
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

    let frame = 0
    function updateParallax() {
      const viewportCenter = window.innerHeight / 2
      parallaxItems.forEach((item) => {
        const bounds = item.getBoundingClientRect()
        const speed = Number(item.dataset.parallax ?? 0.06)
        const distance = viewportCenter - (bounds.top + bounds.height / 2)
        item.style.setProperty("--parallax-y", `${distance * speed}px`)
      })
      frame = 0
    }

    function requestParallaxUpdate() {
      if (frame) return
      frame = window.requestAnimationFrame(updateParallax)
    }

    updateParallax()
    window.addEventListener("scroll", requestParallaxUpdate, { passive: true })
    window.addEventListener("resize", requestParallaxUpdate)

    return () => {
      window.clearTimeout(revealTimer)
      observer.disconnect()
      window.removeEventListener("scroll", requestParallaxUpdate)
      window.removeEventListener("resize", requestParallaxUpdate)
      if (frame) window.cancelAnimationFrame(frame)
      root.classList.remove("reveal-ready")
    }
  }, [pathname])

  return null
}

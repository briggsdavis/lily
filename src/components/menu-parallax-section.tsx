"use client"

import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function MenuParallaxSection({ children, index }: { children: ReactNode; index: number }) {
  const sectionRef = useRef<HTMLElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const overlapsPrevious = index > 0

  useEffect(() => {
    const section = sectionRef.current
    const panel = panelRef.current
    if (
      !section ||
      !panel ||
      !overlapsPrevious ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return
    }

    let animationFrame = 0
    let listening = false

    const update = () => {
      animationFrame = 0
      const top = section.getBoundingClientRect().top
      const distance = window.innerHeight * 0.85
      const progress = clamp((window.innerHeight - top) / distance)
      const offset = (1 - progress) * window.innerHeight * 0.12
      panel.style.transform = `translate3d(0, ${offset}px, 0)`
    }
    const schedule = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update)
    }
    const startListening = () => {
      if (listening) return
      listening = true
      window.addEventListener("scroll", schedule, { passive: true })
      window.addEventListener("resize", schedule)
      schedule()
    }
    const stopListening = () => {
      if (!listening) return
      listening = false
      window.cancelAnimationFrame(animationFrame)
      animationFrame = 0
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }

    startListening()
    if (!("IntersectionObserver" in window)) return stopListening

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startListening() : stopListening()),
      { rootMargin: "25% 0px" },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      stopListening()
    }
  }, [overlapsPrevious])

  return (
    <section
      className={`relative -mx-5 md:-mx-10 lg:-mx-16 ${
        overlapsPrevious ? "z-20 -mt-12 md:-mt-20 lg:-mt-24" : "z-10"
      }`}
      ref={sectionRef}
    >
      <div
        className={`px-5 py-14 will-change-transform md:px-10 md:py-20 lg:px-16 lg:py-24 ${
          index === 0 ? "bg-espresso" : "bg-espresso shadow-[0_-24px_48px_rgba(20,18,16,0.3)]"
        }`}
        data-reveal
        ref={panelRef}
      >
        {children}
      </div>
    </section>
  )
}

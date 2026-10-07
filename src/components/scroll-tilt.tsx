"use client"

import { ReactNode, useEffect, useRef } from "react"

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => 1 - (1 - value) ** 2

export function ScrollTilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const apply = (tilt: number) => {
      element.style.transform = `rotate(${tilt * 8}deg)`
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(0)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const height = window.innerHeight
      // Starts tilting as the top enters the bottom of the viewport, flat around mid-screen.
      // Measure the untransformed top via the offset parent so the tilt doesn't skew the reading.
      const parent = element.offsetParent ?? document.body
      const top = parent.getBoundingClientRect().top + element.offsetTop
      const progress = clamp((height - top) / (height * 0.8))
      apply(1 - ease(progress))
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <div
      className={`origin-top-left will-change-transform ${className ?? ""}`}
      ref={ref}
      style={{ transform: "rotate(8deg)" }}
    >
      {children}
    </div>
  )
}

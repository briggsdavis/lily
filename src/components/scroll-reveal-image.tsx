"use client"

import Image from "next/image"
import { CSSProperties, useEffect, useRef } from "react"
import { PillLink } from "@/components/pill-button"

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => value * value * (3 - 2 * value)
const initialProgress = { "--open": 0, "--meet": 0, "--reserve": 0 } as CSSProperties
const revealClip = { clipPath: "inset(0 calc((1 - var(--open)) * 50%))" }
const leftWordPosition = { transform: "translateX(calc((1 - var(--meet)) * -100vw))" }
const rightWordPosition = { transform: "translateX(calc((1 - var(--meet)) * 100vw))" }
const reserveButtonStyle = {
  filter: "blur(calc((1 - var(--reserve)) * 12px))",
  opacity: "var(--reserve)",
  transform: "translateY(calc((1 - var(--reserve)) * 1rem))",
} as CSSProperties

export function ScrollRevealImage() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const apply = (open: number, meet: number, reserve: number) => {
      section.style.setProperty("--open", String(open))
      section.style.setProperty("--meet", String(meet))
      section.style.setProperty("--reserve", String(reserve))
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1, 1, 1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      const sectionTop = section.getBoundingClientRect().top
      const revealStart = viewport * 0.88
      const scrolledIntoReveal = revealStart - sectionTop

      const open = ease(clamp(scrolledIntoReveal / (viewport * 1.15)))
      const meet = ease(clamp((scrolledIntoReveal - viewport * 0.55) / (viewport * 0.85)))
      const reserve = ease(clamp((scrolledIntoReveal - viewport * 1.1) / (viewport * 0.5)))

      apply(open, meet, reserve)
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
    <section
      className="relative h-[280svh] bg-mauve"
      data-nav-tone="image"
      ref={sectionRef}
      style={initialProgress}
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        <div
          className="absolute inset-0 overflow-hidden will-change-[clip-path]"
          style={revealClip}
        >
          <Image
            alt="Lily's dining room in the evening"
            className="object-cover"
            fill
            sizes="100vw"
            src="/lily-romantic-interior-9x16.webp"
          />
        </div>

        <p className="absolute inset-0 flex flex-col items-center justify-center px-page text-center font-display text-4xl font-medium whitespace-nowrap text-cream md:text-6xl xl:flex-row xl:gap-[0.2em] 2xl:text-7xl">
          <span className="block will-change-transform" style={leftWordPosition}>
            Come for dinner,
          </span>
          <span className="block will-change-transform" style={rightWordPosition}>
            stay for the evening.
          </span>
        </p>

        <div
          className="absolute inset-x-0 top-[62%] z-10 flex justify-center will-change-[opacity,filter,transform]"
          style={reserveButtonStyle}
        >
          <PillLink color="cream" href="/contact?reason=reservation">
            Reserve a table
          </PillLink>
        </div>
      </div>
    </section>
  )
}

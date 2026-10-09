"use client"

import Image from "next/image"
import { CSSProperties, useEffect, useRef } from "react"

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => 1 - (1 - value) ** 3
const phase = (progress: number, start: number, end: number) =>
  ease(clamp((progress - start) / (end - start)))
const initialProgress = { "--open": 0, "--meet": 0 } as CSSProperties
const revealClip = { clipPath: "inset(0 calc((1 - var(--open)) * 50%))" }
const leftWordPosition = { transform: "translateX(calc((1 - var(--meet)) * -100vw))" }
const rightWordPosition = { transform: "translateX(calc((1 - var(--meet)) * 100vw))" }

export function ScrollRevealImage() {
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    if (!section) return

    const apply = (open: number, meet: number) => {
      section.style.setProperty("--open", String(open))
      section.style.setProperty("--meet", String(meet))
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1, 1)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const distance = section.offsetHeight - window.innerHeight
      const progress = clamp(-section.getBoundingClientRect().top / distance)
      apply(clamp(progress / 0.46), phase(progress, 0.57, 0.93))
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
      className="relative h-[390svh] bg-mauve"
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
            src="/lily-romantic-interior-9x16.png"
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
      </div>
    </section>
  )
}

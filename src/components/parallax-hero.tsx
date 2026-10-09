"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"
import type { ReactNode } from "react"

const clamp = (value: number, minimum: number, maximum: number) =>
  Math.min(maximum, Math.max(minimum, value))

export function ParallaxHero({
  alt,
  children,
  imagePosition = "center",
  parallax = "standard",
  size = "standard",
  src,
}: {
  alt: string
  children: ReactNode
  imagePosition?: "center" | "events"
  parallax?: "standard" | "strong"
  size?: "half" | "standard"
  src: string
}) {
  const sectionRef = useRef<HTMLElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const media = mediaRef.current
    if (!section || !media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    let listening = false
    const update = () => {
      frame = 0
      const bounds = section.getBoundingClientRect()
      const strength = parallax === "strong" ? 0.28 : 0.16
      const maximumOffset = parallax === "strong" ? 0.22 : 0.14
      const offset = clamp(-bounds.top * strength, 0, window.innerHeight * maximumOffset)
      media.style.transform = `translate3d(0, ${offset}px, 0)`
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
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
      window.cancelAnimationFrame(frame)
      frame = 0
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }

    startListening()
    if (!("IntersectionObserver" in window)) return stopListening

    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? startListening() : stopListening()),
      { rootMargin: "20% 0px" },
    )
    observer.observe(section)

    return () => {
      observer.disconnect()
      stopListening()
    }
  }, [parallax])

  return (
    <section
      className={`relative isolate overflow-hidden text-cream ${
        size === "half" ? "h-[64dvh] min-h-[34rem]" : "h-[68dvh] min-h-[34rem]"
      }`}
      data-nav-tone="image"
      ref={sectionRef}
    >
      <div
        className={`absolute inset-x-0 will-change-transform ${parallax === "strong" ? "-inset-y-[30%]" : "-inset-y-[14%]"}`}
        ref={mediaRef}
      >
        <Image
          alt={alt}
          className={`object-cover ${imagePosition === "events" ? "object-[52%_center]" : "object-center"}`}
          fill
          loading="eager"
          sizes="100vw"
          src={src}
        />
      </div>
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,5,0.78)_0%,rgba(8,7,5,0.3)_58%,rgba(8,7,5,0.58)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.34)_0%,transparent_38%,rgba(8,7,5,0.82)_100%)]" />
      <div className="relative h-full">{children}</div>
    </section>
  )
}

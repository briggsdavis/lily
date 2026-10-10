"use client"

import Image from "next/image"
import { useEffect, useRef } from "react"

const clamp = (value: number) => Math.min(1, Math.max(0, value))

export function MenuSectionImage({ alt, src }: { alt: string; src: string }) {
  const frameRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const frame = frameRef.current
    const media = mediaRef.current
    if (!frame || !media || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let animationFrame = 0
    let listening = false

    const update = () => {
      animationFrame = 0
      const bounds = frame.getBoundingClientRect()
      const progress = clamp(
        (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height),
      )
      const offset = (progress - 0.5) * bounds.height * 0.28
      media.style.transform = `translate3d(0, ${offset}px, 0)`
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
      { rootMargin: "20% 0px" },
    )
    observer.observe(frame)

    return () => {
      observer.disconnect()
      stopListening()
    }
  }, [])

  return (
    <div className="relative aspect-4/5 overflow-hidden bg-mauve" ref={frameRef}>
      <div className="absolute inset-x-0 -inset-y-[18%] will-change-transform" ref={mediaRef}>
        <Image
          alt={alt}
          className="object-cover"
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          src={src}
        />
      </div>
    </div>
  )
}

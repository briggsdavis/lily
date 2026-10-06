"use client"

import Image from "next/image"
import { useEffect, useState } from "react"

const slides = [
  {
    alt: "Lily's warmly lit dining room",
    src: "/hero-restaurant-unsplash.jpg",
  },
  {
    alt: "Seasonal plates shared across a restaurant table",
    src: "/hero-food-unsplash.jpg",
  },
  {
    alt: "Friends raising freshly made coffees",
    src: "/hero-coffee-unsplash.jpg",
  },
] as const

export function HeroSlideshow() {
  const [activeSlide, setActiveSlide] = useState(0)

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduceMotion) return

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, 3000)

    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="relative min-h-0 parallax-shift" data-parallax="0.14">
      <div
        aria-label="Scenes from Lily"
        className="absolute inset-0 min-h-96 animate-hero-arrive overflow-hidden bg-pink animate-delay-100 md:min-h-0"
      >
        {slides.map((slide, index) => (
          <Image
            alt={slide.alt}
            className={`object-cover transition duration-1200 ease-lily ${index === activeSlide ? "blur-none" : "scale-105 opacity-0 blur-lg"}`}
            fill
            key={slide.src}
            priority={index === 0}
            sizes="(max-width: 800px) calc(100vw - 2.5rem), calc(100vw - 8rem)"
            src={slide.src}
          />
        ))}
      </div>
    </div>
  )
}

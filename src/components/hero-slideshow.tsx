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
    <div className="home-hero__parallax parallax-shift" data-parallax="0.14">
      <div aria-label="Scenes from Lily" className="home-hero__media">
        {slides.map((slide, index) => (
          <Image
            alt={slide.alt}
            className={`home-hero__slide ${index === activeSlide ? "is-active" : ""}`}
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

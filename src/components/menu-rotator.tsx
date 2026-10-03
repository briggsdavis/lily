"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"

const features = [
  {
    category: "Drinks",
    slides: [
      {
        image: "/lily-botanical-cocktail-4x5.png",
        alt: "Botanical cocktail in a coupe glass",
        name: "Verbena gimlet",
      },
      {
        image: "/menu-drink-golden-unsplash.jpg",
        alt: "Golden cocktail served at the bar",
        name: "Fig leaf spritz",
      },
      {
        image: "/menu-drink-red-unsplash.jpg",
        alt: "Red aperitif poured at the bar",
        name: "Rosemary sour",
      },
    ],
  },
  {
    category: "Mains",
    slides: [
      {
        image: "/lily-seasonal-main-dish-4x5.png",
        alt: "Seasonal fish with autumn vegetables",
        name: "Market fish",
      },
      {
        image: "/menu-main-pasta-unsplash.jpg",
        alt: "Seasonal pasta served at a restaurant table",
        name: "Sweet corn ravioli",
      },
      {
        image: "/menu-main-plated-unsplash.jpg",
        alt: "A composed seafood dish in warm light",
        name: "Charred brassicas",
      },
    ],
  },
  {
    category: "Dessert",
    slides: [
      {
        image: "/lily-floral-dessert-4x5.png",
        alt: "Rose and berry pavlova",
        name: "Rose pavlova",
      },
      {
        image: "/menu-dessert-cake-unsplash.jpg",
        alt: "Chocolate cake decorated with berries",
        name: "Olive oil cake",
      },
      {
        image: "/menu-dessert-plated-unsplash.jpg",
        alt: "Berry cake plated for sharing",
        name: "Dark chocolate crémeux",
      },
    ],
  },
] as const

export function MenuRotator() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const interval = window.setInterval(() => setStep((value) => value + 1), 5000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="menu-showcase__grid">
      {features.map((feature, index) => {
        const slideIndex = Math.floor((step + 2 - index) / features.length) % feature.slides.length
        const activeSlide = feature.slides[slideIndex]

        return (
          <div
            className="menu-showcase__column parallax-shift"
            data-parallax={0.07 + index * 0.025}
            key={feature.category}
          >
            <div className="menu-card-intro" data-reveal>
              {index === 0 && (
                <div>
                  <p className="eyebrow">From the kitchen</p>
                  <h2>
                    One garden,
                    <br />
                    three ways.
                  </h2>
                </div>
              )}
              {index === 1 && (
                <p>
                  The menu moves with the market. Bright drinks, generous plates, and desserts that
                  know exactly when to stop.
                </p>
              )}
              {index === 2 && (
                <PillLink color="cream" href="/menu">
                  View the menu
                </PillLink>
              )}
            </div>

            <TransitionLink className="menu-card" data-reveal href="/menu">
              <div className="menu-card__image">
                {feature.slides.map((slide, imageIndex) => {
                  const position =
                    imageIndex === slideIndex
                      ? "is-active"
                      : imageIndex ===
                          (slideIndex + feature.slides.length - 1) % feature.slides.length
                        ? "is-previous"
                        : "is-next"

                  return (
                    <Image
                      alt={imageIndex === slideIndex ? slide.alt : ""}
                      className={`menu-card__image-slide ${position}`}
                      fill
                      key={slide.image}
                      sizes="(max-width: 800px) 90vw, 31vw"
                      src={slide.image}
                    />
                  )
                })}
              </div>
              <div className="menu-card__caption">
                <p className="eyebrow">{feature.category}</p>
                <div aria-live="polite" className="menu-card__name">
                  <span className="sr-only">{activeSlide.name}</span>
                  {feature.slides.map((slide, nameIndex) => {
                    const position =
                      nameIndex === slideIndex
                        ? "is-active"
                        : nameIndex ===
                            (slideIndex + feature.slides.length - 1) % feature.slides.length
                          ? "is-previous"
                          : "is-next"

                    return (
                      <span aria-hidden="true" className={position} key={slide.name}>
                        {slide.name}
                      </span>
                    )
                  })}
                </div>
              </div>
            </TransitionLink>
          </div>
        )
      })}
    </div>
  )
}

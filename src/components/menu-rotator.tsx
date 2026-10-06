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

const columnOffsets = ["", "md:mt-20", "md:mt-40"]

export function MenuRotator() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    const interval = window.setInterval(() => setStep((value) => value + 1), 5000)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 md:mx-0 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible md:px-0 lg:gap-8">
      {features.map((feature, index) => {
        const slideIndex = Math.floor((step + 2 - index) / features.length) % feature.slides.length
        const activeSlide = feature.slides[slideIndex]

        return (
          <div
            className={`w-4/5 max-w-sm shrink-0 snap-center md:w-auto md:max-w-none ${columnOffsets[index]}`}
            key={feature.category}
          >
            <div
              className="flex min-h-40 items-end pb-3 md:min-h-32 lg:min-h-44 lg:pb-4"
              data-reveal
            >
              {index === 0 && (
                <div>
                  <p className="eyebrow">From the kitchen</p>
                  <h2 className="mt-2 font-display text-4xl font-medium lg:text-6xl">
                    One garden,
                    <br />
                    three ways.
                  </h2>
                </div>
              )}
              {index === 1 && (
                <p className="max-w-sm text-base lg:text-lg">
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

            <TransitionLink className="group block reveal-delay-220" data-reveal href="/menu">
              <div className="relative aspect-4/5 overflow-hidden">
                {feature.slides.map((slide, imageIndex) => {
                  const position =
                    imageIndex === slideIndex
                      ? "z-2 group-hover:scale-112 group-hover:saturate-108 group-focus-visible:scale-112 group-focus-visible:saturate-108"
                      : imageIndex ===
                          (slideIndex + feature.slides.length - 1) % feature.slides.length
                        ? "z-1 opacity-0 blur-sm"
                        : "opacity-0 blur-sm"

                  return (
                    <Image
                      alt={imageIndex === slideIndex ? slide.alt : ""}
                      className={`scale-108 object-cover transition duration-1300 ease-lily will-change-[opacity,filter,transform] ${position}`}
                      fill
                      key={slide.image}
                      sizes="(max-width: 800px) 90vw, 31vw"
                      src={slide.image}
                    />
                  )
                })}
              </div>
              <div className="flex items-center gap-4 border-b border-current pt-4 pb-5">
                <p className="eyebrow">{feature.category}</p>
                <div
                  aria-live="polite"
                  className="relative h-lh flex-1 overflow-hidden font-display text-xl md:text-2xl lg:text-3xl"
                >
                  <span className="sr-only">{activeSlide.name}</span>
                  {feature.slides.map((slide, nameIndex) => {
                    const position =
                      nameIndex === slideIndex
                        ? ""
                        : nameIndex ===
                            (slideIndex + feature.slides.length - 1) % feature.slides.length
                          ? "-translate-y-full opacity-0 blur-sm"
                          : "translate-y-full opacity-0 blur-sm"

                    return (
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-0 top-0 transition duration-1000 ease-lily ${position}`}
                        key={slide.name}
                      >
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

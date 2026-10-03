"use client"

import Image from "next/image"
import { useEffect, useState } from "react"
import { TransitionLink } from "@/components/transition-link"

const features = [
  {
    category: "Drinks",
    image: "/lily-botanical-cocktail-4x5.png",
    alt: "Botanical cocktail in a coupe glass",
    items: ["Verbena gimlet", "Fig leaf spritz", "Rosemary sour"],
  },
  {
    category: "Mains",
    image: "/lily-seasonal-main-dish-4x5.png",
    alt: "Seasonal fish with autumn vegetables",
    items: ["Market fish", "Charred brassicas", "Garden risotto"],
  },
  {
    category: "Dessert",
    image: "/lily-floral-dessert-4x5.png",
    alt: "Rose and berry pavlova",
    items: ["Rose pavlova", "Olive oil cake", "Dark chocolate crémeux"],
  },
] as const

export function MenuRotator() {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => setStep((value) => value + 1), 3600)
    return () => window.clearInterval(interval)
  }, [])

  return (
    <div className="menu-showcase__grid">
      {features.map((feature, index) => {
        const item = feature.items[(step + index) % feature.items.length]

        return (
          <TransitionLink className="menu-card" href="/menu" key={feature.category}>
            <div className="menu-card__image">
              <Image alt={feature.alt} fill sizes="(max-width: 800px) 90vw, 31vw" src={feature.image} />
            </div>
            <div className="menu-card__caption">
              <p className="eyebrow">{feature.category}</p>
              <div className="menu-card__name" key={item}>
                {item}
              </div>
            </div>
          </TransitionLink>
        )
      })}
    </div>
  )
}

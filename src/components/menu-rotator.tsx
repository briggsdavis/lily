"use client"

import Image from "next/image"
import { CSSProperties, useState } from "react"
import { PillLink } from "@/components/pill-button"

const dishes = [
  {
    name: "Verbena gimlet",
    price: "$15",
    description:
      "Garden lemon verbena, dry gin, and fresh lime, shaken cold and served up with a sprig from the patio.",
    image: "/lily-botanical-cocktail-4x5.png",
    alt: "Botanical cocktail in a coupe glass",
  },
  {
    name: "Market fish",
    price: "$34",
    description:
      "The day's catch, crisp-skinned and set over roasted autumn vegetables with brown butter and herbs.",
    image: "/lily-seasonal-main-dish-4x5.png",
    alt: "Seasonal fish with autumn vegetables",
  },
  {
    name: "Sweet corn ravioli",
    price: "$27",
    description:
      "Handmade pasta filled with sweet corn and ricotta, finished with chili butter and aged parmesan.",
    image: "/menu-main-pasta-unsplash.jpg",
    alt: "Seasonal pasta served at a restaurant table",
  },
  {
    name: "Rosemary sour",
    price: "$14",
    description:
      "Bourbon, rosemary honey, and lemon with a silky foam and a few drops of bitters on top.",
    image: "/menu-drink-red-unsplash.jpg",
    alt: "Red aperitif poured at the bar",
  },
] as const

export function MenuRotator() {
  const [active, setActive] = useState(0)

  return (
    <div>
      <div className="mb-14 grid items-end gap-8 md:mb-20 md:grid-cols-2 md:gap-12">
        <div data-reveal>
          <h2 className="font-display text-4xl font-medium text-burgundy lg:text-6xl">
            One garden,
            <br />
            three ways.
          </h2>
        </div>
        <div
          className="flex flex-col items-start gap-6 reveal-delay-180 md:items-end md:text-right"
          data-reveal
        >
          <p className="max-w-sm text-base lg:text-lg">
            The menu moves with the market. Bright drinks, generous plates, and desserts that know
            exactly when to stop.
          </p>
          <PillLink color="burgundy" href="/menu">
            View the menu
          </PillLink>
        </div>
      </div>

      <div className="grid items-start gap-10 md:grid-cols-[5fr_7fr] lg:gap-16">
        <div
          className="relative aspect-4/5 overflow-hidden bg-burgundy md:sticky md:top-28"
          data-reveal
        >
          {dishes.map((dish, index) => (
            <div
              aria-hidden={index !== active}
              className={`absolute inset-0 transition duration-1000 ease-lily ${index === active ? "opacity-100" : "opacity-0 blur-md"}`}
              key={dish.image}
            >
              <Image
                alt=""
                className="scale-125 object-cover blur-2xl"
                fill
                sizes="(max-width: 768px) 90vw, 40vw"
                src={dish.image}
              />
              <div className="absolute top-1/2 left-1/2 aspect-4/5 w-1/2 -translate-1/2 overflow-hidden">
                <Image
                  alt={index === active ? dish.alt : ""}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 45vw, 20vw"
                  src={dish.image}
                />
              </div>
            </div>
          ))}
        </div>

        <ul>
          {dishes.map((dish, index) => (
            <li
              data-reveal
              key={dish.name}
              style={{ "--reveal-delay": `${120 + index * 100}ms` } as CSSProperties}
            >
              <button
                aria-pressed={index === active}
                className={`block w-full py-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-burgundy lg:py-10 ${index === 0 ? "pt-0 lg:pt-0" : ""} ${index < dishes.length - 1 ? "border-b border-burgundy/20" : ""}`}
                onClick={() => setActive(index)}
                onFocus={() => setActive(index)}
                onMouseEnter={() => setActive(index)}
                type="button"
              >
                <span className="flex items-baseline justify-between gap-6 font-display text-3xl text-burgundy uppercase md:text-4xl lg:text-5xl">
                  <span>{dish.name}</span>
                  <span className="shrink-0">{dish.price}</span>
                </span>
                <span className="mt-4 block max-w-xl text-sm md:text-base">{dish.description}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

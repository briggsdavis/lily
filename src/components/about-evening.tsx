"use client"

import Image from "next/image"
import { SyntheticEvent, useCallback, useState } from "react"
import { PillLink } from "@/components/pill-button"

const choices = [
  { label: "Dinner", image: "/lily-seasonal-main-dish-4x5.webp", alt: "A seasonal main dish" },
  { label: "Cocktails", image: "/lily-botanical-cocktail-4x5.webp", alt: "A botanical cocktail" },
  { label: "Both", image: "/lily-event-table-16x10.webp", alt: "Shared plates across a table" },
] as const

export function AboutEvening() {
  const [active, setActive] = useState(2)
  const select = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.index)
    if (Number.isInteger(index) && choices[index]) setActive(index)
  }, [])

  return (
    <section
      className="relative isolate flex min-h-[80svh] flex-col justify-between gap-16 overflow-hidden px-page pt-14 pb-[calc(12svh+3.5rem)] text-cream md:min-h-svh md:pt-20 md:pb-[calc(12svh+5rem)]"
      data-nav-tone="image"
    >
      {choices.map((choice, index) => (
        <Image
          alt=""
          className={`-z-10 object-cover transition-[opacity,filter] duration-1000 ease-lily ${
            index === active ? "opacity-100" : "opacity-0 blur-xl"
          }`}
          fill
          key={choice.image}
          sizes="100vw"
          src={choice.image}
        />
      ))}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,rgba(10,8,5,0.7)_0%,rgba(10,8,5,0.16)_52%,rgba(10,8,5,0.68)_100%)]" />

      <div
        className="flex max-w-[12ch] flex-wrap items-baseline gap-x-[0.35em] font-display text-6xl leading-[1.05] font-medium md:max-w-none md:text-8xl lg:text-[9rem]"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Generic button group; no native element fits.
        role="group"
        aria-label="Choose your evening"
        data-reveal
      >
        {choices.map((choice, index) => (
          <button
            aria-pressed={index === active}
            className={`cursor-pointer transition-[color,opacity] duration-500 ease-lily focus-visible:underline focus-visible:outline-none ${
              index === active ? "opacity-100" : "opacity-40 hover:opacity-80"
            }`}
            data-index={index}
            key={choice.label}
            onClick={select}
            onFocus={select}
            onMouseEnter={select}
            type="button"
          >
            {choice.label}
            {index < choices.length - 1 ? <span aria-hidden="true">,</span> : "."}
          </button>
        ))}
      </div>

      <div className="max-w-md self-end">
        <p className="mb-7 text-sm leading-7 text-cream/85 md:text-base md:leading-8" data-reveal>
          However you spend it, the table is ready. Choose your evening.
        </p>
        <div className="flex flex-wrap items-center gap-4 reveal-delay-180" data-reveal>
          <PillLink color="cream" href="/contact?reason=reservation">
            Reserve for {choices[active].label.toLowerCase()}
          </PillLink>
          <PillLink color="cream" href="/menu">
            View the menu
          </PillLink>
        </div>
      </div>
    </section>
  )
}

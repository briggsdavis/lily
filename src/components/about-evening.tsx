"use client"

import Image from "next/image"
import { SyntheticEvent, useCallback, useState } from "react"
import { usePageMedia } from "@/components/page-media"
import { PillLink } from "@/components/pill-button"

type EveningChoice = {
  alt: string
  cta?: string
  href?: string
  image: string
  label: string
}

const eveningChoices: readonly EveningChoice[] = [
  {
    label: "Dinner",
    image: "/images/lily-seasonal-main-dish-4x5.webp",
    alt: "A seasonal main dish",
  },
  {
    label: "Cocktails",
    image: "/images/lily-botanical-cocktail-4x5.webp",
    alt: "A botanical cocktail",
  },
  {
    label: "Both",
    image: "/images/lily-event-table-16x10.webp",
    alt: "Shared plates across a table",
  },
]

const privateEventChoices: readonly EveningChoice[] = [
  {
    label: "Events",
    image: "/images/lily-event-table-16x10.webp",
    alt: "A table set for a private event",
    href: "/contact?reason=events",
    cta: "Book a private event",
  },
  {
    label: "Catering",
    image: "/images/catering/burrata.webp",
    alt: "A catered starter plated at Lily",
    href: "/catering",
    cta: "Explore catering",
  },
  {
    label: "Contact",
    image: "/images/contact-cocktail-unsplash.jpg",
    alt: "A cocktail at the bar",
    href: "/contact",
    cta: "Get in touch",
  },
]

export function AboutEvening({
  choices: baseChoices = eveningChoices,
  defaultActive = 2,
  label = "Choose your evening",
  lines = ["However you spend it, the table is ready.", "Choose your evening."],
  mediaPrefix = "about.evening",
  secondary = { href: "/menu", label: "View the menu" },
}: {
  choices?: readonly EveningChoice[]
  defaultActive?: number
  label?: string
  lines?: readonly string[]
  mediaPrefix?: string | null
  secondary?: { href: string; label: string } | null
}) {
  const savedMedia = usePageMedia()
  const choices = mediaPrefix
    ? baseChoices.map((item, index) => ({
        ...item,
        image:
          savedMedia?.find((media) => media.key === `${mediaPrefix}${index + 1}`)?.url ??
          item.image,
      }))
    : baseChoices
  const [active, setActive] = useState(defaultActive)
  const select = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.index)
      if (Number.isInteger(index) && baseChoices[index]) setActive(index)
    },
    [baseChoices],
  )

  return (
    <section
      className="relative isolate flex min-h-[80svh] flex-col justify-between gap-16 overflow-hidden px-page pt-14 pb-10 text-cream md:min-h-svh md:pt-20 md:pb-14"
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
        className="flex max-w-[12ch] flex-wrap items-baseline gap-x-[0.35em] font-header-stencil text-6xl leading-[1.05] md:max-w-none md:text-8xl lg:text-[9rem]"
        // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Generic button group; no native element fits.
        role="group"
        aria-label={label}
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

      <div className="mt-auto max-w-xl self-end">
        <p className="mb-7 text-sm leading-7 text-cream/85 md:text-base md:leading-8" data-reveal>
          {lines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>
        <div className="flex flex-wrap items-center gap-4 reveal-delay-180" data-reveal>
          <PillLink color="cream" href={choices[active].href ?? "/contact?reason=reservation"}>
            {choices[active].cta ?? `Reserve for ${choices[active].label.toLowerCase()}`}
          </PillLink>
          {secondary ? (
            <PillLink color="cream" href={secondary.href}>
              {secondary.label}
            </PillLink>
          ) : null}
        </div>
      </div>
    </section>
  )
}

export function PrivateEventCta() {
  return (
    <AboutEvening
      choices={privateEventChoices}
      defaultActive={0}
      label="Plan a private event"
      mediaPrefix={null}
      lines={["Book a private event, bring Lily to your table,", "or simply say hello."]}
      secondary={null}
    />
  )
}

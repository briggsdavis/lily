"use client"

import Image from "next/image"
import { MouseEvent, useCallback, useState } from "react"
import { PillLink } from "@/components/pill-button"

const events = [
  {
    alt: "A celebration table dressed with flowers and shared plates",
    description: ["The season at its peak,", "shared around the table."],
    imageClassName: "object-center",
    label: "Seasonal suppers",
    src: "/lily-event-table-16x10.png",
  },
  {
    alt: "Lily's candlelit dining room prepared for a wine dinner",
    description: ["Plates for each pour,", "served without hurry."],
    imageClassName: "object-center",
    label: "Wine dinners",
    src: "/lily-romantic-interior-9x16.png",
  },
  {
    alt: "A long candlelit table ready for a private celebration",
    description: ["A candlelit room,", "shaped for your gathering."],
    imageClassName: "object-[52%_center]",
    label: "Private celebrations",
    src: "/contact-events-unsplash.jpg",
  },
  {
    alt: "A botanical cocktail prepared for an evening at Lily",
    description: ["Garden-led drinks,", "and one more round."],
    imageClassName: "object-center",
    label: "Cocktail evenings",
    src: "/lily-botanical-cocktail-4x5.png",
  },
] as const

export function EventsShowcase() {
  const [active, setActive] = useState(0)
  const selectEvent = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.eventIndex)
    if (Number.isInteger(index) && events[index]) setActive(index)
  }, [])

  return (
    <section
      className="bg-dark-green px-page py-24 text-pink md:py-32 lg:py-40"
      data-nav-tone="dark"
      id="home-events"
    >
      <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-2 md:items-end md:gap-16">
        <h2
          className="font-display text-4xl leading-tight font-medium md:text-5xl lg:text-6xl"
          data-reveal
        >
          Private celebrations
        </h2>
        <div
          className="flex w-full max-w-[52ch] flex-col items-start gap-6 reveal-delay-180 md:justify-self-end"
          data-reveal
        >
          <PillLink color="pink" href="/events">
            Explore events
          </PillLink>
          <p className="text-base leading-relaxed text-warm-white md:text-lg">
            <span className="lg:block">Wine dinners, seasonal suppers, and celebrations.</span>{" "}
            <span className="lg:block">Evenings remembered after the last glass is poured.</span>
          </p>
        </div>
      </div>

      <div className="relative min-h-[34rem] overflow-hidden bg-zinc-950 text-cream md:min-h-[37rem]">
        {events.map((event, index) => (
          <Image
            alt={index === active ? event.alt : ""}
            aria-hidden={index !== active}
            className={`object-cover transition-[opacity,transform,filter] duration-[1800ms] ease-lily ${event.imageClassName} ${index === active ? "scale-100 opacity-100 blur-none" : "scale-105 opacity-0 blur-lg"}`}
            fill
            key={event.src}
            sizes="(max-width: 768px) calc(100vw - 2.5rem), calc(100vw - 8rem)"
            src={event.src}
          />
        ))}

        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,5,0.9)_0%,rgba(8,7,5,0.62)_38%,rgba(8,7,5,0.08)_72%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.04)_25%,rgba(8,7,5,0.28)_55%,rgba(8,7,5,0.94)_100%)]" />

        <div className="relative flex min-h-[34rem] flex-col justify-between p-6 md:min-h-[37rem] md:p-10 lg:p-14">
          <div className="grid max-w-xl" aria-live="polite" data-reveal>
            {events.map((event, index) => (
              <div
                aria-hidden={index !== active}
                className={`col-start-1 row-start-1 transition-[opacity,filter,transform] duration-[1200ms] ease-lily ${index === active ? "translate-y-0 opacity-100 blur-none" : "pointer-events-none translate-y-2 opacity-0 blur-md"}`}
                key={event.label}
              >
                <p className="font-display text-3xl leading-[1.08] font-medium md:text-4xl lg:text-5xl">
                  <span className="block">{event.description[0]}</span>
                  <span className="block">{event.description[1]}</span>
                </p>
              </div>
            ))}
          </div>

          <div className="reveal-delay-180" data-reveal>
            <p className="mb-4 eyebrow text-cream/55">Choose an evening</p>
            <div className="grid max-w-2xl grid-cols-4 gap-2 md:gap-4">
              {events.map((event, index) => (
                <button
                  aria-label={`Show ${event.label}`}
                  aria-pressed={active === index}
                  className="group relative aspect-4/3 cursor-pointer overflow-hidden opacity-70 transition-[opacity,transform] duration-300 outline-none hover:scale-[1.02] hover:opacity-100 focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 aria-pressed:opacity-100"
                  data-event-index={index}
                  key={event.src}
                  onClick={selectEvent}
                  type="button"
                >
                  <Image
                    alt=""
                    className={`object-cover transition-transform duration-700 ease-lily group-hover:scale-105 ${event.imageClassName}`}
                    fill
                    sizes="(max-width: 768px) 22vw, 14vw"
                    src={event.src}
                  />
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 bg-zinc-950 transition-opacity duration-300 ${active === index ? "opacity-0" : "opacity-45"}`}
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

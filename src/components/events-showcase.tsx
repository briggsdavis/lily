"use client"
import Image from "next/image"
import { MouseEvent, useCallback, useState } from "react"
import { DoubleFrame } from "@/components/double-frame"
import {
  MediaEditControl,
  EditableText,
  ColorSection,
  useEditorMode,
  usePageContent,
} from "@/components/page-content"
import { usePageMedia, MediaImage } from "@/components/page-media"
import { PillLink } from "@/components/pill-button"

const defaultevents = [
  {
    alt: "A celebration table dressed with flowers and shared plates",
    description: ["The season at its peak,", "shared around the table."],
    imageClassName: "object-center",
    label: "Seasonal suppers",
    src: "/images/lily-event-table-16x10.webp",
  },
  {
    alt: "Lily's candlelit dining room prepared for a wine dinner",
    description: ["Plates for each pour,", "served without hurry."],
    imageClassName: "object-center",
    label: "Wine dinners",
    src: "/images/lily-romantic-interior-9x16.webp",
  },
  {
    alt: "A long candlelit table ready for an evening at Lily",
    description: ["Pull up a chair,", "and enjoy the evening."],
    imageClassName: "object-[52%_center]",
    label: "Evenings at Lily",
    src: "/images/contact-events-unsplash.jpg",
  },
  {
    alt: "A botanical cocktail prepared for an evening at Lily",
    description: ["Garden-led drinks,", "and one more round."],
    imageClassName: "object-center",
    label: "Cocktail evenings",
    src: "/images/lily-botanical-cocktail-4x5.webp",
  },
] as const

export function EventsShowcase() {
  const editing = useEditorMode()
  const content = usePageContent()
  const savedMedia = usePageMedia()
  const events = defaultevents.map((item, index) => ({
    ...item,
    label: content?.fields[`home.events.item${index}.label`] ?? item.label,
    description: content?.fields[`home.events.item${index}.copy`]?.split("\n") ?? item.description,
    src: savedMedia?.find((media) => media.key === `home.event${index + 1}`)?.url ?? item.src,
  }))
  const [active, setActive] = useState(0)
  const selectEvent = useCallback((event: MouseEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.eventIndex)
    if (Number.isInteger(index) && defaultevents[index]) setActive(index)
  }, [])

  return (
    <ColorSection
      field="home.events.color"
      className="bg-dark-maroon px-page pt-14 pb-24 text-pink md:pt-20 md:pb-32 lg:pt-24 lg:pb-40"
      data-nav-tone="dark"
      id="home-events"
    >
      <div className="mb-12 grid gap-6 md:mb-16 lg:grid-cols-[auto_minmax(0,1fr)_auto] lg:items-center lg:gap-10">
        <h2
          className="font-header-stencil text-4xl leading-tight md:text-5xl lg:text-6xl"
          data-reveal
        >
          <EditableText field="home.events.heading">EVENTS</EditableText>
        </h2>
        <p
          className="max-w-none text-base leading-relaxed text-tan reveal-delay-180 lg:justify-self-center xl:text-lg"
          data-reveal
        >
          <EditableText field="home.events.intro">
            <span className="lg:block lg:whitespace-nowrap">
              Join us for wine dinners, seasonal suppers, and cocktail evenings.
            </span>{" "}
            <span className="lg:block lg:whitespace-nowrap">
              See what's coming up and find your next night out.
            </span>
          </EditableText>
        </p>
        <div className="reveal-delay-320 lg:justify-self-end" data-reveal>
          <PillLink field="home.events.button" color="pink" href="/events">
            Explore events
          </PillLink>
        </div>
      </div>

      {editing ? (
        <div className="space-y-8">
          <p className="eyebrow">
            <EditableText field="home.events.prompt">Choose an evening</EditableText>
          </p>
          {events.map((event, index) => (
            <div
              key={index}
              className="relative min-h-[30rem] overflow-hidden bg-zinc-950 text-cream"
            >
              <MediaEditControl mediaKey={`home.event${index + 1}`} />
              <MediaImage
                mediaKey={`home.event${index + 1}` as "home.event1"}
                src={event.src}
                alt={event.alt}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-black/50" />
              <div className="relative z-10 p-8">
                <h3 className="font-header-stencil text-4xl">
                  <EditableText field={`home.events.item${index}.copy`}>
                    {event.description.join("\n")}
                  </EditableText>
                </h3>
                <p className="mt-6">
                  <EditableText field={`home.events.item${index}.label`}>
                    {event.label}
                  </EditableText>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="relative mx-7 sm:mx-10 md:mx-0">
            <DoubleFrame className="[--frame-inset:-22px]" seed={11} />
            <div className="relative min-h-[34rem] overflow-hidden bg-zinc-950 text-tan md:min-h-[37rem]">
              {events.map((event, index) => (
                <Image
                  alt={index === active ? event.alt : ""}
                  aria-hidden={index !== active}
                  className={`object-cover transition-opacity duration-500 ease-lily ${event.imageClassName} ${index === active ? "opacity-100" : "opacity-0"}`}
                  fill
                  key={index}
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
                      className={`col-start-1 row-start-1 transition-[opacity,filter] duration-[1200ms] ease-lily ${index === active ? "opacity-100 blur-none" : "pointer-events-none opacity-0 blur-md"}`}
                      key={index}
                    >
                      <p className="font-header-stencil text-3xl leading-[1.08] md:text-4xl lg:text-5xl">
                        {event.description.map((line, index) => (
                          <span className="block" key={index}>
                            {line}
                          </span>
                        ))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="reveal-delay-180" data-reveal>
                  <p className="mb-4 eyebrow text-tan">
                    <EditableText field="home.events.prompt">Choose an evening</EditableText>
                  </p>
                  <div className="grid max-w-2xl grid-cols-4 gap-2 md:gap-4">
                    {events.map((event, index) => (
                      <button
                        aria-label={`Show ${event.label}`}
                        aria-pressed={active === index}
                        className="relative aspect-4/3 cursor-pointer overflow-hidden opacity-70 transition-opacity duration-300 outline-none hover:opacity-100 focus-visible:ring-2 focus-visible:ring-pink focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-950 aria-pressed:opacity-100"
                        data-event-index={index}
                        key={index}
                        onClick={selectEvent}
                        type="button"
                      >
                        <Image
                          alt=""
                          className={`object-cover ${event.imageClassName}`}
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
          </div>
        </>
      )}
    </ColorSection>
  )
}

"use client"
import Image from "next/image"
import { SyntheticEvent, useCallback, useState } from "react"
import {
  EditableText,
  useEditorMode,
  usePageContent,
  MediaEditControl,
} from "@/components/page-content"
import { usePageMedia, MediaImage } from "@/components/page-media"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"

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
    href: "/menu/mains",
    image: "/images/lily-seasonal-main-dish-4x5.webp",
    alt: "A seasonal main dish",
  },
  {
    label: "Cocktails",
    href: "/menu/desserts",
    image: "/images/lily-botanical-cocktail-4x5.webp",
    alt: "A botanical cocktail",
  },
  {
    label: "Both",
    href: "/menu/mains",
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
  const editing = useEditorMode()
  const content = usePageContent()
  const owned =
    (content?.page === "about" && mediaPrefix === "about.evening") ||
    (content?.page === "home" && mediaPrefix === null)
  const prefix = content?.page === "home" ? "home.private" : "about.evening"
  const resolvedMediaPrefix = owned && content?.page === "home" ? "home.private" : mediaPrefix
  const savedMedia = usePageMedia()
  const choices = resolvedMediaPrefix
    ? baseChoices.map((item, index) => ({
        ...item,
        image:
          savedMedia?.find((media) => media.key === `${resolvedMediaPrefix}${index + 1}`)?.url ??
          item.image,
      }))
    : baseChoices
  const resolvedChoices = choices.map((choice, index) =>
    owned
      ? {
          ...choice,
          label: content?.fields[`${prefix}${index + 1}.label`] ?? choice.label,
          href: content?.fields[`${prefix}${index + 1}.label.href`] ?? choice.href,
          cta: content?.fields[`${prefix}${index + 1}.button`] ?? choice.cta,
        }
      : choice,
  )
  const resolvedLines =
    owned && content?.fields[`${prefix}.lines`] !== undefined
      ? content.fields[`${prefix}.lines`].split("\n")
      : lines
  const [active, setActive] = useState(defaultActive)
  const select = useCallback(
    (event: SyntheticEvent<HTMLElement>) => {
      const index = Number(event.currentTarget.dataset.index)
      if (Number.isInteger(index) && baseChoices[index]) setActive(index)
    },
    [baseChoices],
  )

  if (editing && owned)
    return (
      <div className="space-y-1">
        {resolvedChoices.map((choice, index) => (
          <section
            key={index}
            className="relative isolate flex min-h-[38rem] flex-col justify-between overflow-hidden px-page py-16 text-cream"
          >
            <MediaEditControl mediaKey={`${prefix}${index + 1}`} />
            <MediaImage
              mediaKey={`${prefix}${index + 1}` as "about.evening1"}
              src={choice.image}
              alt={choice.alt}
              fill
              sizes="100vw"
              className="-z-10 object-cover"
            />
            <div className="pointer-events-none absolute inset-0 -z-10 bg-black/50" />
            <h2 className="font-header-stencil text-6xl">
              {choice.href ? (
                <PillLink field={`${prefix}${index + 1}.label`} color="cream" href={choice.href}>
                  {choice.label}
                </PillLink>
              ) : (
                <EditableText field={`${prefix}${index + 1}.label`}>{choice.label}</EditableText>
              )}
            </h2>
            <div className="max-w-xl self-end">
              <p className="mb-7 leading-7">
                <EditableText field={`${prefix}.lines`}>{resolvedLines.join("\n")}</EditableText>
              </p>
              <div className="flex flex-wrap gap-4">
                <PillLink
                  field={`${prefix}${index + 1}.button`}
                  color="cream"
                  href={choice.href ?? "/contact?reason=reservation"}
                >
                  {choice.cta ?? `Reserve for ${choice.label.toLowerCase()}`}
                </PillLink>
                {secondary && (
                  <PillLink field={`${prefix}.secondary`} color="cream" href={secondary.href}>
                    {secondary.label}
                  </PillLink>
                )}
              </div>
            </div>
          </section>
        ))}
      </div>
    )
  return (
    <section
      className="relative isolate flex min-h-[80svh] flex-col justify-between gap-16 overflow-hidden px-page pt-14 pb-10 text-cream md:min-h-svh md:pt-20 md:pb-14"
      data-nav-tone="image"
    >
      {resolvedChoices.map((choice, index) => (
        <Image
          alt=""
          className={`-z-10 object-cover transition-[opacity,filter] duration-1000 ease-lily ${
            index === active ? "opacity-100" : "opacity-0 blur-xl"
          }`}
          fill
          key={index}
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
        {resolvedChoices.map((choice, index) => {
          const className = `cursor-pointer transition-[color,opacity] duration-500 ease-lily focus-visible:underline focus-visible:outline-none ${
            index === active ? "opacity-100" : "opacity-40 hover:opacity-80"
          }`
          const content = (
            <>
              {choice.label}
              {index < choices.length - 1 ? <span aria-hidden="true">,</span> : "."}
            </>
          )
          return choice.href ? (
            <TransitionLink
              className={className}
              data-index={index}
              href={choice.href}
              key={index}
              onFocus={select}
              onMouseEnter={select}
            >
              {content}
            </TransitionLink>
          ) : (
            <button
              aria-pressed={index === active}
              className={className}
              data-index={index}
              key={index}
              onClick={select}
              onFocus={select}
              onMouseEnter={select}
              type="button"
            >
              {content}
            </button>
          )
        })}
      </div>

      <div className="mt-auto max-w-xl self-end">
        <p className="mb-7 text-sm leading-7 text-cream/85 md:text-base md:leading-8" data-reveal>
          {resolvedLines.map((line) => (
            <span className="block" key={line}>
              {line}
            </span>
          ))}
        </p>
        <div className="flex flex-wrap items-center gap-4 reveal-delay-180" data-reveal>
          <PillLink
            field={owned ? `${prefix}${active + 1}.button` : undefined}
            color="cream"
            href={resolvedChoices[active].href ?? "/contact?reason=reservation"}
          >
            {resolvedChoices[active].cta ??
              `Reserve for ${resolvedChoices[active].label.toLowerCase()}`}
          </PillLink>
          {secondary ? (
            <PillLink
              field={owned ? `${prefix}.secondary` : undefined}
              color="cream"
              href={secondary.href}
            >
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

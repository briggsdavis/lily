"use client"
import Image from "next/image"
import { SyntheticEvent, useCallback, useState } from "react"
import {
  MediaEditControl,
  EditableText,
  ColorSection,
  useEditorMode,
  usePageContent,
} from "@/components/page-content"
import { usePageMedia, MediaImage } from "@/components/page-media"

const defaultpeople = [
  {
    name: "Rick Rivero",
    role: "Chef and co-owner",
    since: "2001",
    text: "Born in Spain, Rick cooked his way through Europe and America before opening Cala Lily. He retired in 2026 after 25 years at the stove.",
    image: "/images/about-rick-kitchen.webp",
    imageAlt: "A chef finishing plates beneath warm kitchen lights",
    color: "bg-dark-maroon text-warm-white",
  },
  {
    name: "Paul Anzaldi",
    role: "Co-owner and general manager",
    since: "2008",
    text: "After thirty years in information technology, Paul turned to hospitality and brought a steady hand to the business side of the room.",
    image: "/images/about-paul-kitchen.webp",
    imageAlt: "A chef carefully seasoning a finished plate",
    color: "bg-[color-mix(in_oklab,var(--color-dark-maroon),white_5%)] text-pink",
  },
  {
    name: "Ron Jelinek",
    role: "Grill master",
    since: "2016",
    text: "Ron works the grill with a practiced hand, turning out steaks and chops, and a few of the desserts too.",
    image: "/images/about-ron-kitchen.webp",
    imageAlt: "A chef spooning sauce over a plated lobster dish",
    color: "bg-[color-mix(in_oklab,var(--color-dark-maroon),white_10%)] text-cream",
  },
] as const

export function AboutPeople() {
  const editing = useEditorMode()
  const content = usePageContent()
  const savedMedia = usePageMedia()
  const people = defaultpeople.map((item, index) => ({
    ...item,
    name: content?.fields[`about.person${index + 1}.name`] ?? item.name,
    role: content?.fields[`about.person${index + 1}.role`] ?? item.role,
    since: content?.fields[`about.person${index + 1}.since`] ?? item.since,
    text: content?.fields[`about.person${index + 1}.text`] ?? item.text,
    image: savedMedia?.find((media) => media.key === `about.person${index + 1}`)?.url ?? item.image,
  }))
  const [active, setActive] = useState(0)
  const select = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.index)
    if (Number.isInteger(index) && defaultpeople[index]) setActive(index)
  }, [])

  if (editing)
    return (
      <div>
        {people.map((person, index) => (
          <ColorSection
            key={index}
            field={`about.person${index + 1}.color`}
            style={
              content?.fields["about.people.color"]
                ? { backgroundColor: content.fields["about.people.color"] }
                : undefined
            }
            as="div"
            className={`${person.color} relative`}
          >
            <div className="grid gap-8 p-8 md:grid-cols-2">
              <div className="flex flex-col justify-between">
                <p className="font-display text-6xl">
                  <EditableText field={`about.person${index + 1}.since`}>
                    {person.since}
                  </EditableText>
                </p>
                <div>
                  <h3 className="mt-6 font-display text-4xl">
                    <EditableText field={`about.person${index + 1}.name`}>
                      {person.name}
                    </EditableText>
                  </h3>
                  <p className="mt-2">
                    <EditableText field={`about.person${index + 1}.role`}>
                      {person.role}
                    </EditableText>
                  </p>
                  <p className="mt-4 leading-7">
                    <EditableText field={`about.person${index + 1}.text`}>
                      {person.text}
                    </EditableText>
                  </p>
                </div>
              </div>
              <div className="relative aspect-4/5">
                <MediaEditControl mediaKey={`about.person${index + 1}`} />
                <MediaImage
                  mediaKey={`about.person${index + 1}` as "about.person1"}
                  src={person.image}
                  alt={person.imageAlt}
                  fill
                  sizes="50vw"
                  className="object-cover"
                />
              </div>
            </div>
          </ColorSection>
        ))}
      </div>
    )
  return (
    <div className="flex flex-col md:h-[36rem] md:flex-row lg:h-[40.8rem]">
      {people.map((person, index) => {
        const open = index === active
        return (
          <button
            style={
              content?.fields[`about.person${index + 1}.color`] ||
              content?.fields["about.people.color"]
                ? {
                    backgroundColor:
                      content.fields[`about.person${index + 1}.color`] ??
                      content.fields["about.people.color"],
                  }
                : undefined
            }
            aria-expanded={open}
            aria-label={`${person.name}, ${person.role}, since ${person.since}`}
            className={`group relative min-w-0 overflow-hidden text-left transition-[flex-grow] duration-[1100ms] ease-lily focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream motion-reduce:transition-none md:basis-0 ${person.color} ${
              open ? "min-h-[32rem] md:min-h-0 md:grow-[3]" : "min-h-28 md:min-h-0 md:grow-[1]"
            }`}
            data-index={index}
            key={index}
            onClick={select}
            onFocus={select}
            onMouseEnter={select}
            type="button"
          >
            <span
              className={`grid h-full min-h-0 transition-[grid-template-columns] duration-[1100ms] ease-lily motion-reduce:transition-none ${
                open
                  ? "md:grid-cols-[minmax(13rem,0.9fr)_minmax(14rem,1.1fr)]"
                  : "md:grid-cols-[minmax(0,1fr)_minmax(0,0fr)]"
              }`}
            >
              <span className="flex min-h-0 flex-col justify-between p-6 md:p-8">
                <span className="font-display text-5xl font-medium opacity-60 transition-opacity duration-700 ease-lily group-hover:opacity-100 motion-reduce:transition-none md:text-7xl">
                  {person.since}
                </span>
                <span className="block">
                  <span className="block font-display text-3xl font-medium md:text-4xl">
                    {person.name}
                  </span>
                  <span className="mt-1 block text-sm opacity-75">{person.role}</span>
                  <span
                    className={`grid transition-[grid-template-rows,opacity,filter] duration-[900ms] ease-lily motion-reduce:transition-none ${
                      open
                        ? "grid-rows-[1fr] opacity-100 delay-150"
                        : "grid-rows-[0fr] opacity-0 blur-sm delay-0"
                    }`}
                  >
                    <span className="block min-h-0 overflow-hidden">
                      <span className="mt-4 block max-w-sm text-sm leading-7 md:text-base">
                        {person.text}
                      </span>
                    </span>
                  </span>
                </span>
              </span>
              <span
                aria-hidden={!open}
                className={`relative block overflow-hidden transition-[height,opacity,filter] duration-[1100ms] ease-lily motion-reduce:transition-none md:h-full ${
                  open ? "h-64 opacity-100 delay-100" : "h-0 opacity-0 blur-sm delay-0"
                }`}
              >
                <Image
                  alt={person.imageAlt}
                  className={`absolute inset-0 h-full w-full object-cover transition-transform duration-[1400ms] ease-lily motion-reduce:transition-none ${
                    open ? "scale-100" : "scale-[1.04]"
                  }`}
                  height={1400}
                  sizes="(max-width: 767px) calc(100vw - 2.5rem), 34vw"
                  src={person.image}
                  width={1000}
                />
                <span className="absolute inset-0 bg-[linear-gradient(90deg,rgba(10,8,5,0.18),transparent_45%)]" />
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

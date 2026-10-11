"use client"

import Image from "next/image"
import { SyntheticEvent, useCallback, useState } from "react"

const people = [
  {
    name: "Rick Rivero",
    image: "/about/rick-rivero.webp",
    role: "Chef and co-owner",
    since: "2001",
    text: "Born in Spain, Rick cooked his way through Europe and America before opening Cala Lily. He retired in 2026 after 25 years at the stove.",
    color: "bg-mauve text-warm-white",
  },
  {
    name: "Paul Anzaldi",
    image: "/about/paul-anzaldi.webp",
    role: "Co-owner and general manager",
    since: "2001",
    text: "After thirty years in information technology, Paul turned to hospitality and ran the business side of the room from day one.",
    color: "bg-dark-green text-pink",
  },
  {
    name: "Ron Jelinek",
    image: "/about/ron-jelinek.webp",
    role: "Grill master",
    since: "2001",
    text: "Ron has been at the grill since the first night, turning out steaks and chops, and a few of the desserts too.",
    color: "bg-deep-brown text-cream",
  },
] as const

export function AboutPeople() {
  const [active, setActive] = useState(0)
  const select = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.index)
    if (Number.isInteger(index) && people[index]) setActive(index)
  }, [])

  return (
    <div className="flex flex-col gap-2 md:h-[30rem] md:flex-row md:gap-3 lg:h-[34rem]">
      {people.map((person, index) => {
        const open = index === active
        return (
          <button
            aria-expanded={open}
            className={`group relative isolate flex min-w-0 flex-col justify-between overflow-hidden p-6 text-left transition-[flex-grow] duration-700 ease-lily focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cream md:basis-0 md:p-8 ${person.color} ${
              open ? "min-h-72 md:grow-[4]" : "min-h-24 md:grow-[1]"
            }`}
            data-index={index}
            key={person.name}
            onClick={select}
            onFocus={select}
            onMouseEnter={select}
            type="button"
          >
            <Image
              alt={`Portrait of ${person.name}`}
              className={`-z-10 object-cover transition-[opacity,filter,scale] duration-700 ease-lily ${
                open ? "scale-100 opacity-100 grayscale-0" : "scale-105 opacity-35 grayscale"
              }`}
              fill
              sizes="(max-width: 767px) 100vw, 60vw"
              src={person.image}
            />
            <span
              aria-hidden="true"
              className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,7,5,0.35)_0%,transparent_35%,rgba(8,7,5,0.85)_100%)]"
            />
            <span className="font-display text-5xl font-medium opacity-60 transition-opacity duration-500 group-hover:opacity-100 md:text-7xl">
              {person.since}
            </span>
            <span className="block">
              <span className="block font-display text-3xl font-medium md:text-4xl">
                {person.name}
              </span>
              <span className="mt-1 block text-sm opacity-75">{person.role}</span>
              <span
                className={`grid transition-[grid-template-rows,opacity,filter] duration-700 ease-lily ${
                  open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 blur-md"
                }`}
              >
                <span className="block min-h-0 overflow-hidden">
                  <span className="mt-4 block max-w-md text-sm leading-7 md:text-base">
                    {person.text}
                  </span>
                </span>
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}

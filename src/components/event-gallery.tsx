"use client"

import Image from "next/image"
import { CSSProperties, useState } from "react"

const images = [
  { src: "/lily-botanical-cocktail-4x5.png", alt: "A botanical cocktail prepared for an event" },
  { src: "/lily-event-table-16x10.png", alt: "A celebration table with flowers and shared plates" },
  { src: "/lily-romantic-interior-9x16.png", alt: "Lily dining room set for the evening" },
] as const

// Width of one card when nothing is hovered. Cards are 4:5 portrait.
const base = "((100cqw - 2 * var(--gap)) / 3)"

function cardSize(index: number, active: number | null): CSSProperties {
  if (active === null) return { width: `calc(${base})`, height: `calc(${base} * 1.25)` }
  // The active card grows 20% beyond the previous square treatment.
  if (index === active) return { width: `calc(${base} * 1.5)`, height: `calc(${base} * 1.5)` }
  // The other two split the remaining width and keep their 4:5 ratio.
  return { width: `calc(${base} * 0.75)`, height: `calc(${base} * 0.9375)` }
}

export function EventGallery() {
  const [active, setActive] = useState<number | null>(null)

  return (
    <div className="@container" data-reveal>
      <div
        className="flex items-center gap-(--gap) [--gap:--spacing(3)] md:[--gap:--spacing(6)]"
        onMouseLeave={() => setActive(null)}
        // Fixed to the tallest card so the row never changes height mid-transition.
        style={{ height: `calc(${base} * 1.5)` }}
      >
        {images.map((image, index) => (
          <figure
            className={`relative shrink-0 overflow-hidden transition-[width,height,border-radius] duration-700 ease-lily ${
              active === index ? "rounded-2xl md:rounded-3xl" : "rounded-none"
            }`}
            key={image.src}
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") setActive(index)
            }}
            style={cardSize(index, active)}
          >
            <Image
              alt={image.alt}
              className="object-cover"
              fill
              sizes="(max-width: 768px) 40vw, 36vw"
              src={image.src}
            />
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-700 ease-lily ${active !== null && active !== index ? "opacity-45" : "opacity-0"}`}
            />
          </figure>
        ))}
      </div>
    </div>
  )
}

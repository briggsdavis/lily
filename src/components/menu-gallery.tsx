"use client"

import Image from "next/image"
import { CSSProperties, PointerEvent, useCallback, useMemo, useState } from "react"

const images = [
  { src: "/lily-seasonal-main-dish-4x5.png", alt: "A seasonal main dish plated at Lily" },
  { src: "/lily-floral-dessert-4x5.png", alt: "A floral dessert finished for the table" },
  { src: "/lily-botanical-cocktail-4x5.png", alt: "A botanical cocktail mixed at Lily" },
] as const

const base = "((100cqw - 2 * var(--gap)) / 3)"
const galleryHeight = { height: `calc(${base} * 1.5)` }

function cardSize(index: number, active: number | null): CSSProperties {
  if (active === null) return { width: `calc(${base})`, height: `calc(${base} * 1.25)` }
  if (index === active) return { width: `calc(${base} * 1.5)`, height: `calc(${base} * 1.5)` }
  return { width: `calc(${base} * 0.75)`, height: `calc(${base} * 0.9375)` }
}

export function MenuGallery() {
  const [active, setActive] = useState<number | null>(null)
  const cardStyles = useMemo(() => images.map((_, index) => cardSize(index, active)), [active])
  const clearActive = useCallback(() => setActive(null), [])
  const activateCard = useCallback((event: PointerEvent<HTMLDivElement>) => {
    if (event.pointerType !== "mouse") return
    const target = (event.target as HTMLElement).closest<HTMLElement>("[data-gallery-index]")
    const index = Number(target?.dataset.galleryIndex)
    if (Number.isInteger(index) && images[index]) setActive(index)
  }, [])

  return (
    <div className="@container" data-reveal>
      <div
        className="flex items-center gap-(--gap) [--gap:--spacing(3)] md:[--gap:--spacing(6)]"
        onMouseLeave={clearActive}
        onPointerOver={activateCard}
        style={galleryHeight}
      >
        {images.map((image, index) => (
          <figure
            className={`relative shrink-0 overflow-hidden transition-[width,height,border-radius] duration-700 ease-lily ${
              active === index ? "rounded-2xl md:rounded-3xl" : "rounded-none"
            }`}
            data-gallery-index={index}
            key={image.src}
            style={cardStyles[index]}
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

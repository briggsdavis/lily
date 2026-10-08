"use client"

import {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { LayeredMedia } from "@/components/layered-media"
import { PillLink } from "@/components/pill-button"

const categories = [
  {
    name: "Mains",
    description:
      "Market-led plates built around pristine fish, handmade pasta, and vegetables at their seasonal peak.",
    image: "/lily-seasonal-main-dish-4x5.png",
    alt: "A seasonal main dish plated at Lily",
  },
  {
    name: "Salads",
    description:
      "Crisp leaves, market vegetables, fresh herbs, and bright dressings composed with a light touch.",
    image: "/menu-main-plated-unsplash.jpg",
    alt: "A bright plate of seasonal greens and vegetables",
  },
  {
    name: "Desserts",
    description:
      "Floral, fruit-forward finishes and quietly indulgent classics made for one more shared course.",
    image: "/lily-floral-dessert-4x5.png",
    alt: "A floral seasonal dessert",
  },
  {
    name: "Drinks",
    description:
      "Garden herbs, ripe fruit, thoughtful spirits, and cocktails designed to sit beautifully beside dinner.",
    image: "/lily-botanical-cocktail-4x5.png",
    alt: "A botanical cocktail in a coupe glass",
  },
] as const

const media = categories.map(({ alt, image }) => ({ alt, src: image }))
const revealDelayClasses = [
  "reveal-delay-120",
  "reveal-delay-220",
  "reveal-delay-320",
  "reveal-delay-420",
] as const

export function MenuRotator() {
  const [active, setActive] = useState(0)
  const listRef = useRef<HTMLUListElement>(null)
  const [listHeight, setListHeight] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => setListHeight(list.getBoundingClientRect().height)
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    measure()
    return () => observer.disconnect()
  }, [])

  const listStyle = useMemo(
    () => ({ "--menu-list-height": `${listHeight}px` }) as CSSProperties,
    [listHeight],
  )
  const selectCategory = useCallback((event: SyntheticEvent<HTMLButtonElement>) => {
    const index = Number(event.currentTarget.dataset.categoryIndex)
    if (Number.isInteger(index) && categories[index]) setActive(index)
  }, [])

  return (
    <div>
      <div className="mb-7 grid items-end gap-8 md:mb-10 md:grid-cols-2 md:gap-12">
        <div data-reveal>
          <h2 className="font-display text-4xl font-medium whitespace-nowrap text-warm-white lg:text-6xl">
            Seasonal, by design.
          </h2>
        </div>
        <div
          className="flex flex-col items-start gap-6 reveal-delay-180 md:items-end md:text-right"
          data-reveal
        >
          <PillLink color="cream" href="/menu">
            View the menu
          </PillLink>
        </div>
      </div>

      <div className="grid items-start gap-10 md:grid-cols-[5fr_7fr] lg:gap-16" style={listStyle}>
        <LayeredMedia
          active={active}
          backgroundBlurClassName="blur-[9px]"
          backgroundSizes="(max-width: 768px) 90vw, 40vw"
          className="relative aspect-4/5 bg-mauve md:aspect-auto md:h-[var(--menu-list-height)]"
          foregroundAspectClassName="aspect-4/5"
          foregroundSizes="(max-width: 768px) 45vw, 20vw"
          items={media}
        />

        <ul ref={listRef}>
          {categories.map((category, index) => (
            <li className={revealDelayClasses[index]} data-reveal key={category.name}>
              <button
                aria-pressed={index === active}
                className={`group relative block w-full py-8 text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-bronze lg:py-10 ${index === 0 ? "pt-0 lg:pt-0" : ""}`}
                data-category-index={index}
                onClick={selectCategory}
                onFocus={selectCategory}
                onMouseEnter={selectCategory}
                type="button"
              >
                <span className="font-display text-3xl text-warm-white uppercase md:text-4xl lg:text-5xl">
                  {category.name}
                </span>
                <span className="mt-4 block max-w-xl text-sm md:text-base">
                  {category.description}
                </span>
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-blush/20"
                >
                  <span className="absolute inset-x-0 bottom-0 h-[2.1px] opacity-0 blur-[1.5px] transition-[opacity,filter] duration-500 ease-lily group-hover:opacity-100 group-hover:blur-none group-hover:duration-0 group-focus-visible:opacity-100 group-focus-visible:blur-none group-focus-visible:duration-0">
                    <span className="block h-full w-full origin-left bg-bronze group-hover:animate-[menu-line-draw_700ms_ease-in-out_both] group-focus-visible:animate-[menu-line-draw_700ms_ease-in-out_both]" />
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

"use client"
import { useQuery } from "convex/react"
import {
  CSSProperties,
  SyntheticEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react"
import { DoubleFrame } from "@/components/double-frame"
import { LayeredMedia } from "@/components/layered-media"
import { PillLink } from "@/components/pill-button"
import { menuCategories } from "@/data/menu"
import { publicMenuPagesRef } from "@/lib/admin-api"

const fallbackCategories = [
  {
    name: "Starters",
    description:
      "Small plates and snacks to open the table, built for sharing and a first round of drinks.",
    image: "/images/catering/burrata.webp",
    alt: "Burrata with seasonal accompaniments",
  },
  {
    name: "Salads",
    description:
      "Crisp leaves, market vegetables, fresh herbs, and bright dressings composed with a light touch.",
    image: "/images/menu-main-plated-unsplash.jpg",
    alt: "A bright plate of seasonal greens and vegetables",
  },
  {
    name: "Mains",
    description:
      "Market-led plates built around pristine fish, handmade pasta, and vegetables at their seasonal peak.",
    image: "/images/lily-seasonal-main-dish-4x5.webp",
    alt: "A seasonal main dish plated at Lily",
  },
  {
    name: "Desserts",
    description:
      "Floral, fruit-forward finishes and quietly indulgent classics made for one more shared course.",
    image: "/images/lily-floral-dessert-4x5.webp",
    alt: "A floral seasonal dessert",
  },
] as const

const revealDelayClasses = [
  "reveal-delay-120",
  "reveal-delay-220",
  "reveal-delay-320",
  "reveal-delay-420",
] as const

export function MenuRotator() {
  const pages = useQuery(publicMenuPagesRef, {})
  const categories = pages?.length
    ? pages.map((page) => ({
        name: page.title,
        description: page.description,
        image: page.heroImage,
        alt: page.heroImageAlt,
      }))
    : fallbackCategories.map((item) => {
        const shared = menuCategories.find((category) => category.name === item.name)
        return { ...item, image: shared?.image ?? item.image, alt: shared?.imageAlt ?? item.alt }
      })
  const media = categories.map(({ alt, image }) => ({ alt, src: image }))
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
  const selectCategory = useCallback(
    (event: SyntheticEvent<HTMLButtonElement>) => {
      const index = Number(event.currentTarget.dataset.categoryIndex)
      if (Number.isInteger(index) && categories[index]) setActive(index)
    },
    [categories],
  )

  return (
    <div>
      <div className="mb-7 grid items-end gap-8 md:mb-10 md:grid-cols-2 md:gap-12">
        <div data-reveal>
          <h2 className="font-header-stencil text-4xl tracking-[0.12em] whitespace-nowrap text-warm-white uppercase lg:text-6xl">
            Seasonal
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
        <div className="relative">
          <LayeredMedia
            active={active}
            backgroundBlurClassName="blur-[9px]"
            backgroundSizes="(max-width: 768px) 90vw, 40vw"
            className="relative aspect-4/5 bg-mauve md:aspect-auto md:h-[var(--menu-list-height)]"
            foregroundAspectClassName="aspect-4/5"
            foregroundSizes="(max-width: 768px) 45vw, 20vw"
            items={media}
            priority
          />
          <DoubleFrame className="[--frame-inset:-22px]" />
        </div>

        <ul ref={listRef}>
          {categories.map((category, index) => (
            <li
              className={revealDelayClasses[index % revealDelayClasses.length]}
              data-reveal
              key={category.name}
            >
              <button
                aria-pressed={index === active}
                className={`group relative block w-full py-8 text-left focus-visible:outline-none md:pl-7 lg:py-10 lg:pl-9 ${index === 0 ? "pt-0 lg:pt-0" : ""}`}
                data-category-index={index}
                onClick={selectCategory}
                onFocus={selectCategory}
                onMouseEnter={selectCategory}
                type="button"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-y-1 left-0 hidden h-[calc(100%-0.5rem)] w-full text-cream opacity-0 blur-[6px] transition-[opacity,filter] duration-500 ease-lily menu-l-hand-reveal group-hover:animate-[menu-l-hand-draw_900ms_ease-lily_both] group-hover:opacity-100 group-hover:blur-none group-focus-visible:animate-[menu-l-hand-draw_900ms_ease-lily_both] group-focus-visible:opacity-100 group-focus-visible:blur-none md:block"
                >
                  <span className="border-hand relative block h-full w-[calc(100%+12px)] rounded-[3px]" />
                </span>
                <span className="font-display text-3xl text-warm-white uppercase md:text-4xl lg:text-5xl">
                  {category.name}
                </span>
                <span className="mt-4 block max-w-xl text-sm md:text-base">
                  {category.description}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

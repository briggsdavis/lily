"use client"
import { useQuery } from "convex/react"
import Image from "next/image"
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
import { EditableText, useEditorMode } from "@/components/page-content"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"
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
  return process.env.NEXT_PUBLIC_CONVEX_URL ? <ConnectedMenuRotator /> : <MenuRotatorContent />
}

function ConnectedMenuRotator() {
  const pages = useQuery(publicMenuPagesRef, {})
  return <MenuRotatorContent pages={pages} />
}

function MenuRotatorContent({
  pages,
}: {
  pages?: {
    slug: string
    title: string
    description: string
    heroImage: string
    heroImageAlt: string
  }[]
}) {
  const editing = useEditorMode()
  const categories = pages?.length
    ? pages.map((page) => ({
        name: page.title,
        slug: page.slug,
        description: page.description,
        image: page.heroImage,
        alt: page.heroImageAlt,
      }))
    : fallbackCategories.map((item) => {
        const shared = menuCategories.find((category) => category.name === item.name)
        return {
          ...item,
          slug: shared?.slug ?? item.name.toLowerCase(),
          image: shared?.image ?? item.image,
          alt: shared?.imageAlt ?? item.alt,
        }
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
    (event: SyntheticEvent<HTMLAnchorElement>) => {
      const index = Number(event.currentTarget.dataset.categoryIndex)
      if (Number.isInteger(index) && categories[index]) setActive(index)
    },
    [categories],
  )

  return (
    <div>
      <div className="mb-14 grid items-end gap-8 md:mb-10 md:grid-cols-2 md:gap-12">
        <div data-reveal>
          <h2 className="font-header-stencil text-4xl tracking-[0.12em] whitespace-nowrap text-tan uppercase lg:text-6xl">
            <EditableText field="home.menu.heading">Seasonal</EditableText>
          </h2>
        </div>
        <div
          className="flex flex-col items-start gap-6 reveal-delay-180 md:items-end md:text-right"
          data-reveal
        >
          <PillLink field="home.menu.button" color="cream" href="/menu">
            View the menu
          </PillLink>
        </div>
      </div>

      {editing ? (
        <div className="space-y-6">
          <p className="font-body text-sm">
            Menu previews are shared across the site. Edit their images and descriptions in the Menu
            editor.
          </p>
          {categories.map((category) => (
            <div
              key={category.name}
              className="grid gap-6 border-t border-current/20 py-6 md:grid-cols-2"
            >
              <Image
                width={600}
                height={750}
                src={category.image}
                alt={category.alt}
                className="aspect-4/5 w-full max-w-sm object-cover"
              />
              <div>
                <h3 className="font-display text-3xl">{category.name}</h3>
                <p className="mt-3">{category.description}</p>
                <p className="mt-4 text-xs opacity-60">Managed in Menu</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div
            className="grid items-start gap-16 md:grid-cols-[5fr_7fr] md:gap-10 lg:gap-16"
            style={listStyle}
          >
            <div className="relative mx-7 sm:mx-10 md:mx-0">
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
                  <TransitionLink
                    href={`/menu/${category.slug}`}
                    data-active={index === active}
                    className={`group relative block w-full cursor-pointer py-8 pl-6 text-left focus-visible:outline-none md:pl-7 lg:py-10 lg:pl-9 ${index === 0 ? "pt-0 lg:pt-0" : ""}`}
                    data-category-index={index}
                    onFocus={selectCategory}
                    onMouseEnter={selectCategory}
                  >
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-y-1 left-0 w-full opacity-0 transition-[opacity,clip-path] duration-[1400ms] ease-lily [clip-path:inset(0_100%_100%_0)] group-hover:opacity-100 group-hover:[clip-path:inset(0)] group-focus-visible:opacity-100 group-focus-visible:[clip-path:inset(0)] motion-reduce:transition-none max-md:group-data-[active=true]:opacity-100 max-md:group-data-[active=true]:[clip-path:inset(0)]"
                    >
                      <DoubleFrame variant="l" className="[--frame-inset:0px]" />
                    </span>
                    <span className="font-display text-3xl font-semibold text-warm-white uppercase md:text-4xl lg:text-5xl">
                      {category.name}
                    </span>
                    <span className="mt-4 block max-w-xl text-sm md:text-base">
                      {category.description}
                    </span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

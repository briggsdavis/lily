"use client"

import { useQuery } from "convex/react"
import Link from "@/components/site-link"
import { usePathname } from "next/navigation"
import { MenuParallaxSection } from "@/components/menu-parallax-section"
import { MenuSectionImage } from "@/components/menu-section-image"
import { menuCategories } from "@/data/menu"
import { publicMenuPagesRef } from "@/lib/admin-api"

const tones = {
  cream: "bg-cream text-deep-brown",
  espresso: "bg-espresso text-cream",
  mauve: "bg-mauve text-deep-brown",
  "dark-maroon": "bg-dark-maroon text-cream",
  "deep-brown": "bg-deep-brown text-cream",
} as const

export function CmsMenuGallery() {
  const pages = useQuery(publicMenuPagesRef, {})
  const pathname = usePathname()
  const fallback = menuCategories.map((page, order) => ({
    _id: page.slug,
    description: page.description,
    heroImage: page.image,
    heroImageAlt: page.imageAlt,
    order,
    slug: page.slug,
    title: page.name,
  }))
  const items = pages?.length ? pages : fallback
  const slug = pathname.split("/")[2] ?? items[0]?.slug
  const active = items.find((page) => page.slug === slug) ?? items[0]
  if (!active) return null
  return (
    <section
      className="relative isolate flex h-[64svh] min-h-[34rem] items-center justify-center overflow-hidden bg-cover bg-center px-page pt-24 text-center text-cream"
      style={{
        backgroundImage: `linear-gradient(rgba(8,7,5,.5),rgba(8,7,5,.78)),url(${active.heroImage})`,
      }}
    >
      <div className="flex max-w-3xl flex-col items-center">
        <h1 className="font-header text-6xl leading-none font-bold tracking-[0.03em] uppercase md:text-8xl lg:text-9xl">
          {active.title}
        </h1>
        <p className="mt-5 line-clamp-2 max-w-[56ch] text-sm leading-7 text-cream/80 md:text-base">
          {active.description}
        </p>
        <nav aria-label="Menu categories" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 md:gap-x-10">
            {items.map((page) => (
              <li key={page._id}>
                <Link
                  aria-current={pathname === `/menu/${page.slug}` ? "page" : undefined}
                  className="animated-underline text-xs font-bold tracking-[0.14em] uppercase md:text-sm"
                  href={`/menu/${page.slug}`}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  )
}

export function CmsMenuPage({ slug }: { slug: string }) {
  const pages = useQuery(publicMenuPagesRef, {})
  const savedPage = pages?.find((entry) => entry.slug === slug)
  const fallbackPage = menuCategories.find((entry) => entry.slug === slug)
  const page =
    savedPage ??
    (fallbackPage
      ? {
          sections: fallbackPage.sections.map((section, sectionIndex) => ({
            backgroundColor: "espresso" as const,
            image: section.image,
            imageAlt: section.imageAlt,
            imageSide: sectionIndex % 2 ? ("right" as const) : ("left" as const),
            items: section.items.map((item, itemIndex) => ({
              ...item,
              key: `${sectionIndex}-${itemIndex}`,
              title: item.name,
            })),
            key: section.title,
            title: section.title,
          })),
        }
      : undefined)
  if (!page)
    return (
      <div className="px-page py-24 text-center">
        <p className="font-display text-4xl">This menu is not available.</p>
      </div>
    )
  return (
    <div>
      {page.sections.map((section, index) => (
        <MenuParallaxSection
          index={index}
          key={section.key}
          panelClassName={`${tones[section.backgroundColor]} ${index ? "shadow-[0_-24px_48px_rgba(20,18,16,0.3)]" : ""}`}
        >
          <div className="grid items-start gap-10 md:grid-cols-2 md:gap-12 lg:gap-20">
            <div className={section.imageSide === "right" ? "md:order-2" : undefined}>
              <MenuSectionImage alt={section.imageAlt} src={section.image} />
            </div>
            <div className={section.imageSide === "right" ? "md:order-1" : undefined}>
              <div className="mb-9 border-b border-current/20 pb-8 md:mb-11 md:pb-10">
                <h2 className="font-display text-4xl leading-none font-medium md:text-5xl">
                  {section.title}
                </h2>
              </div>
              <ul className="grid gap-7 md:gap-8">
                {section.items.map((item) => (
                  <li key={item.key}>
                    <div className="flex items-baseline gap-4">
                      <h3 className="font-display text-xl leading-tight md:text-2xl">
                        {item.title}
                      </h3>
                      <p className="ml-auto shrink-0 text-sm font-semibold opacity-75">
                        {item.price.replace(/\$/g, "")}
                      </p>
                    </div>
                    <p className="mt-1.5 text-sm leading-6 opacity-65">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </MenuParallaxSection>
      ))}
    </div>
  )
}

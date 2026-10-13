"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { menuCategories } from "@/data/menu"

export function MenuGallery() {
  const pathname = usePathname()
  const activeSlug = pathname.split("/")[2] ?? menuCategories[0].slug
  const activeCategory =
    menuCategories.find((category) => category.slug === activeSlug) ?? menuCategories[0]

  return (
    <section className="relative isolate flex h-[64svh] min-h-[34rem] items-center justify-center overflow-hidden px-page pt-24 text-center text-cream">
      {menuCategories.map((category) => {
        const isActive = category.slug === activeCategory.slug
        return (
          <Image
            alt={isActive ? category.imageAlt : ""}
            aria-hidden={!isActive}
            className={`-z-20 object-cover transition-[opacity,filter,transform] duration-1000 ease-lily ${isActive ? "scale-100 opacity-100 blur-none" : "scale-[1.03] opacity-0 blur-lg"}`}
            fill
            key={category.slug}
            loading={isActive ? "eager" : "lazy"}
            sizes="100vw"
            src={category.image}
          />
        )
      })}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(8,7,5,0.48)_0%,rgba(8,7,5,0.55)_45%,rgba(8,7,5,0.78)_100%)]" />

      <div className="flex max-w-3xl flex-col items-center">
        <h1
          className="font-display text-6xl leading-none font-medium tracking-[0.03em] uppercase md:text-8xl lg:text-9xl"
          data-reveal
        >
          {activeCategory.name}
        </h1>
        <p
          className="mt-5 line-clamp-2 max-w-[56ch] text-sm leading-7 text-cream/80 reveal-delay-120 md:text-base"
          data-reveal
        >
          {activeCategory.description}
        </p>

        <nav aria-label="Menu categories" className="mt-8 reveal-delay-240" data-reveal>
          <ul className="flex flex-wrap justify-center gap-x-7 gap-y-3 md:gap-x-10">
            {menuCategories.map((category) => {
              const href = `/menu/${category.slug}`
              const isActive = pathname === href
              return (
                <li key={category.slug}>
                  <Link
                    aria-current={isActive ? "page" : undefined}
                    className="animated-underline text-xs font-bold tracking-[0.14em] uppercase md:text-sm"
                    href={href}
                    scroll={false}
                  >
                    {category.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </div>
    </section>
  )
}

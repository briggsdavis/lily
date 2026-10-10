"use client"

import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { menuCategories } from "@/data/menu"

export function MenuGallery() {
  const pathname = usePathname()
  const [visualActiveSlug, setVisualActiveSlug] = useState<string | null>(
    () => pathname.split("/")[2] ?? null,
  )
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const activeLinkRef = useRef<HTMLAnchorElement>(null)
  const previousPathnameRef = useRef(pathname)

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return
    previousPathnameRef.current = pathname

    const nextSlug = pathname.split("/")[2] ?? null
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionTimer = window.setTimeout(() => setVisualActiveSlug(nextSlug), 0)
      return () => window.clearTimeout(reducedMotionTimer)
    }

    const shrinkTimer = window.setTimeout(() => setVisualActiveSlug(null), 0)
    const growTimer = window.setTimeout(() => setVisualActiveSlug(nextSlug), 420)
    return () => {
      window.clearTimeout(shrinkTimer)
      window.clearTimeout(growTimer)
    }
  }, [pathname])

  useEffect(() => {
    if (!pathname.startsWith("/menu/")) return

    const container = scrollContainerRef.current
    const activeLink = activeLinkRef.current
    if (!container || !activeLink) return

    const containerBounds = container.getBoundingClientRect()
    const activeBounds = activeLink.getBoundingClientRect()
    const left =
      container.scrollLeft +
      activeBounds.left -
      containerBounds.left -
      (container.clientWidth - activeBounds.width) / 2

    container.scrollTo({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      left,
    })
  }, [pathname])

  return (
    <nav aria-label="Menu categories" data-reveal>
      <div
        className="-mx-5 [scrollbar-width:none] overflow-x-auto px-5 py-5 md:-mx-10 md:px-10 lg:-mx-4 lg:px-4 [&::-webkit-scrollbar]:hidden"
        ref={scrollContainerRef}
      >
        <ul className="grid min-w-[58rem] grid-cols-4 gap-4 md:min-w-[64rem] md:gap-6 lg:min-w-0">
          {menuCategories.map((category) => {
            const href = `/menu/${category.slug}`
            const isActive = pathname === href
            const isVisuallyActive = visualActiveSlug === category.slug

            return (
              <li className={`relative ${isVisuallyActive ? "z-10" : "z-0"}`} key={category.slug}>
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className="group block focus-visible:outline-none"
                  href={href}
                  ref={isActive ? activeLinkRef : undefined}
                  scroll={false}
                >
                  <h2 className="mb-4 text-center font-display text-2xl leading-none font-medium text-cream md:text-3xl">
                    <span
                      className={`animated-underline group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100 ${
                        isActive ? "after:origin-left after:scale-x-100 after:transition-none" : ""
                      }`}
                    >
                      {category.name}
                    </span>
                  </h2>
                  <figure
                    className={`relative aspect-square overflow-hidden bg-mauve transition-transform duration-[1200ms] ease-lily will-change-transform motion-reduce:transition-none ${
                      isVisuallyActive ? "scale-110" : "scale-100"
                    }`}
                  >
                    <Image
                      alt={category.imageAlt}
                      className="object-cover transition-transform duration-1000 ease-lily group-hover:scale-110 group-focus-visible:scale-110 motion-reduce:transition-none"
                      fill
                      sizes="(max-width: 1024px) 15rem, 25vw"
                      src={category.image}
                    />
                    <span
                      aria-hidden="true"
                      className={`absolute inset-0 transition-colors duration-700 ${
                        isActive ? "bg-black/20" : "bg-black/35 group-hover:bg-black/20"
                      }`}
                    />
                  </figure>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}

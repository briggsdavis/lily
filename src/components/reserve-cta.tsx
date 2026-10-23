"use client"

import { usePathname } from "next/navigation"
import { DoubleFrame } from "@/components/double-frame"
import { PillLink } from "@/components/pill-button"
import { ReserveNavigationMarquee } from "@/components/reserve-navigation-marquee"
import { hasReserveCta, topLevelSection } from "@/data/site-navigation"

export function ReserveCta() {
  const pathname = usePathname()
  const includesReservation = hasReserveCta(pathname)

  if (!includesReservation) {
    if (topLevelSection(pathname) !== "contact") return null

    return (
      <section
        className="overflow-hidden bg-mauve px-page py-14 text-cream md:py-20"
        data-nav-tone="dark"
      >
        <ReserveNavigationMarquee />
      </section>
    )
  }

  return (
    <section
      className="relative isolate overflow-hidden bg-mauve px-page pt-16 text-cream md:pt-20 lg:pt-24"
      data-nav-tone="dark"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-0 bg-cream/8 mask-[url(/images/stamp.svg)] mask-cover mask-center mask-no-repeat"
      />
      <div className="relative z-10 mx-auto flex min-h-[27rem] w-full max-w-7xl flex-col items-center justify-center overflow-hidden px-7 py-16 text-center md:min-h-[83svh] md:px-16 md:py-20 lg:px-24">
        <DoubleFrame className="[--frame-inset:0px]" seed={3} />
        <h2
          className="relative mb-5 font-demibold text-5xl font-semibold italic uppercase text-balance md:text-6xl lg:text-8xl"
          data-reveal
        >
          Reserve your table.
        </h2>
        <p
          className="relative mb-8 max-w-[36ch] text-base text-cream/80 reveal-delay-180 md:text-lg"
          data-reveal
        >
          Join us in the dining room for dinner, cocktails, or both.
        </p>
        <span className="relative reveal-delay-320" data-reveal>
          <PillLink color="cream" href="/contact?reason=reservation">
            Book a table
          </PillLink>
        </span>
      </div>
      <div className="mt-14 md:mt-20">
        <ReserveNavigationMarquee size="large" />
      </div>
    </section>
  )
}

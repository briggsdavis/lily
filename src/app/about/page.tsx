import { Metadata } from "next"
import Image from "next/image"
import { AboutEvening } from "@/components/about-evening"
import { AboutMarquee } from "@/components/about-marquee"
import { AboutPeople } from "@/components/about-people"
import { AboutTimeline } from "@/components/about-timeline"

export const metadata: Metadata = {
  title: "About",
  description:
    "Lily carries on 25 years of dining at 500 Grandview Crossing in Gibsonia, with the same warm team and a seasonal kitchen.",
}

export default function AboutPage() {
  return (
    <div>
      <section
        className="relative isolate overflow-hidden bg-mauve px-page pt-32 pb-14 text-warm-white md:pt-40 md:pb-20"
        data-nav-tone="dark"
      >
        <Image
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 right-[-8%] h-auto w-[min(48vw,38rem)] -translate-y-1/2 opacity-50"
          height={1196}
          src="/CREST-MAROON.svg"
          width={1235}
        />
        <div className="relative z-10 grid gap-8 md:grid-cols-12 md:gap-8 lg:gap-12">
          <h1
            className="font-display text-5xl leading-[0.98] font-medium text-blush md:col-span-7 lg:text-7xl"
            data-reveal
          >
            A familiar room, a new chapter.
          </h1>
          <p
            className="max-w-md text-base leading-8 text-warm-white/80 reveal-delay-180 md:col-span-5 md:self-end"
            data-reveal
          >
            A dining room and cocktail bar at 500 Grandview Crossing in Gibsonia, carried by a team
            that has cooked and served here for years.
          </p>
        </div>
      </section>

      <AboutTimeline />

      <AboutMarquee />

      <section className="bg-taupe px-page py-14 text-warm-white md:py-20" data-nav-tone="dark">
        <h2
          className="mb-10 font-display text-4xl font-medium text-blush md:mb-14 lg:text-6xl"
          data-reveal
        >
          The hands behind it.
        </h2>
        <AboutPeople />
      </section>

      <AboutEvening />
    </div>
  )
}

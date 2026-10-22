"use client"
import { useMediaSource } from "@/components/page-media"
import { ParallaxHero } from "@/components/parallax-hero"

export function AboutHero() {
  const hero = useMediaSource("about.hero")
  return (
    <ParallaxHero
      alt="A warmly lit restaurant dining room set for service"
      imageClassName="object-center"
      src={hero}
    >
      <div className="grid h-full grid-rows-[58%_42%] md:grid-cols-2 md:grid-rows-1">
        <div className="flex flex-col justify-end px-page pt-28 pb-8 md:pt-32 md:pb-14 lg:pb-16">
          <p className="mb-3 eyebrow text-warm-white/65" data-reveal>
            Twenty-five years at the table
          </p>
          <h1
            className="font-display text-5xl leading-none font-medium whitespace-nowrap text-blush reveal-delay-120 sm:text-6xl md:text-6xl lg:text-8xl"
            data-reveal
          >
            A new chapter.
          </h1>
        </div>
        <p
          className="m-4 self-start justify-self-end text-right text-[0.7rem] leading-6 tracking-[-0.01em] text-cream/90 reveal-delay-240 sm:m-5 sm:text-sm md:mx-10 md:mt-0 md:mb-14 md:self-end md:text-base lg:mx-16 lg:mb-16 lg:leading-8"
          data-reveal
        >
          <span className="block whitespace-nowrap">A dining room and cocktail bar at 500</span>
          <span className="block whitespace-nowrap">
            Grandview Crossing in Gibsonia, carried by a
          </span>
          <span className="block whitespace-nowrap">
            team that has cooked and served here for years.
          </span>
        </p>
      </div>
    </ParallaxHero>
  )
}

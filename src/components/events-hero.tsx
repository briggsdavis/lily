"use client"
import { useMediaSource } from "@/components/page-media"
import { ParallaxHero } from "@/components/parallax-hero"
import { Smoke } from "@/components/smoke"

export function EventsHero() {
  const hero = useMediaSource("events.hero")
  return (
    <ParallaxHero
      mediaKey="events.hero"
      alt="A candlelit table prepared for an evening gathering at Lily"
      imageClassName="object-[52%_center]"
      src={hero}
    >
      <Smoke />
      <div className="relative grid h-full grid-rows-[58%_42%] md:grid-cols-2 md:grid-rows-1">
        <div className="flex flex-col justify-end px-page pt-28 pb-8 md:pt-32 md:pb-14 lg:pb-16">
          <h1
            className="max-w-[8ch] font-header text-6xl leading-none font-bold uppercase reveal-delay-120 md:text-8xl lg:text-9xl"
            data-reveal
          >
            Events
          </h1>
        </div>
        <p
          className="m-5 max-w-[34ch] self-start justify-self-end text-right text-sm leading-7 text-cream/90 reveal-delay-240 md:mx-10 md:mt-0 md:mb-14 md:self-end md:text-base lg:mx-16 lg:mb-16 lg:leading-8"
          data-reveal
        >
          Seasonal suppers, thoughtful pours, and evenings made to linger over.
        </p>
      </div>
    </ParallaxHero>
  )
}

"use client"
import Image from "next/image"
import { useMediaSource } from "@/components/page-media"
import { ParallaxHero } from "@/components/parallax-hero"

export function CateringHero() {
  const hero = useMediaSource("catering.hero")
  return (
    <ParallaxHero
      mediaKey="catering.hero"
      alt="A generous garden platter prepared for a catered gathering"
      imageClassName="object-center"
      parallax="strong"
      size="half"
      src={hero}
    >
      <div className="grid h-full place-items-center px-page pt-24 pb-10 text-center">
        <div className="flex w-full max-w-full flex-col items-center gap-6">
          <Image
            alt="Lily Kitchen and Cocktails"
            className="h-auto w-28 reveal-delay-120 md:w-36 lg:w-40"
            data-reveal
            height={2062}
            loading="eager"
            sizes="(max-width: 767px) 7rem, (max-width: 1023px) 9rem, 10rem"
            src="/images/primary-vertical-white.png"
            width={1465}
          />
          <h1
            className="max-w-full font-header-stencil text-[clamp(2rem,8vw,3.6rem)] leading-none text-balance reveal-delay-240 md:whitespace-nowrap"
            data-reveal
          >
            Catering for the table.
          </h1>
        </div>
      </div>
    </ParallaxHero>
  )
}

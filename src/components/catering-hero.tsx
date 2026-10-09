import Image from "next/image"
import { ParallaxHero } from "@/components/parallax-hero"

export function CateringHero() {
  return (
    <ParallaxHero
      alt="A generous garden platter prepared for a catered gathering"
      parallax="strong"
      size="half"
      src="/catering/catering-hero.webp"
    >
      <div className="grid h-full place-items-center px-page pt-24 pb-10 text-center">
        <div className="flex flex-col items-center gap-6">
          <Image
            alt="Lily Kitchen and Cocktails"
            className="h-auto w-28 reveal-delay-120 md:w-36 lg:w-40"
            data-reveal
            height={2062}
            loading="eager"
            sizes="(max-width: 767px) 7rem, (max-width: 1023px) 9rem, 10rem"
            src="/PRIMARY-VERTICAL-WHITE.png"
            width={1465}
          />
          <h1
            className="font-display text-[clamp(2rem,8vw,3.6rem)] leading-none font-medium whitespace-nowrap reveal-delay-240"
            data-reveal
          >
            Catering for the table.
          </h1>
        </div>
      </div>
    </ParallaxHero>
  )
}

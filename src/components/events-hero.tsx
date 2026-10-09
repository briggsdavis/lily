import { ParallaxHero } from "@/components/parallax-hero"

export function EventsHero() {
  return (
    <ParallaxHero
      alt="A candlelit table prepared for an evening gathering at Lily"
      imagePosition="events"
      src="/contact-events-unsplash.jpg"
    >
      <div className="flex h-full flex-col justify-end px-page pt-32 pb-12 md:pb-16 lg:pb-20">
        <p className="mb-3 eyebrow text-cream/65" data-reveal>
          Gather at Lily
        </p>
        <h1
          className="max-w-[8ch] font-display text-6xl leading-none font-medium reveal-delay-120 md:text-8xl lg:text-9xl"
          data-reveal
        >
          Events
        </h1>
        <p
          className="mt-6 max-w-[38ch] text-base leading-7 text-cream/85 reveal-delay-240 md:text-lg"
          data-reveal
        >
          Seasonal suppers, thoughtful pours, and evenings made to linger over.
        </p>
      </div>
    </ParallaxHero>
  )
}

import { ParallaxHero } from "@/components/parallax-hero"

export function CateringHero() {
  return (
    <ParallaxHero
      alt="A generous garden platter prepared for a catered gathering"
      size="half"
      src="/catering/catering-hero.webp"
    >
      <div className="grid h-full content-end gap-7 px-page pt-32 pb-12 md:grid-cols-[minmax(18rem,0.72fr)_minmax(30rem,1.28fr)] md:items-end md:gap-16 md:pb-14 lg:pb-16">
        <div>
          <p className="mb-3 eyebrow text-cream/65" data-reveal>
            From Lily&apos;s kitchen
          </p>
          <h1
            className="font-display text-5xl leading-none font-medium reveal-delay-120 md:text-6xl lg:text-7xl"
            data-reveal
          >
            <span className="block">Catering for</span>
            <span className="block">the table.</span>
          </h1>
        </div>
        <p
          className="justify-self-end text-sm leading-6 text-cream/85 reveal-delay-240 md:max-w-[55rem]"
          data-reveal
        >
          Seasonal dishes, generous platters, and polished details for gatherings across Gibsonia.
          Browse the collection and choose the portions that suit your table.
        </p>
      </div>
    </ParallaxHero>
  )
}

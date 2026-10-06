import Image from "next/image"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { MenuRotator } from "@/components/menu-rotator"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"

export default function HomePage() {
  return (
    <div>
      <section className="grid min-h-svh grid-rows-[1fr_auto] gap-5 px-page pt-24 pb-9 md:gap-8 md:pt-28 lg:pt-36">
        <HeroSlideshow />

        <div className="relative grid items-end gap-3 pt-4 before:absolute before:inset-x-0 before:top-0 before:h-px before:origin-left before:animate-rule-in before:bg-current before:animate-delay-1030 md:grid-cols-[1fr_2fr_auto] md:gap-12 lg:gap-20">
          <p className="animate-rise-in eyebrow animate-delay-1260">
            Kitchen &amp; cocktails · Pittsburgh
          </p>
          <h1 className="max-w-xs animate-rise-in font-display text-2xl font-medium animate-delay-1410 md:max-w-none md:whitespace-nowrap lg:text-3xl xl:text-4xl">
            Late lunches, candlelit dinners, lingering drinks.
          </h1>
          <TransitionLink
            className="animated-underline w-max animate-rise-in text-sm font-bold uppercase animate-delay-1560"
            href="/contact?reason=reservation"
          >
            Reserve a table
          </TransitionLink>
        </div>
      </section>

      <section className="overflow-hidden bg-burgundy text-cream section-pad">
        <MenuRotator />
      </section>

      <section className="grid items-center gap-12 bg-cream text-orange-brown section-pad md:grid-cols-5 md:gap-20 lg:gap-40">
        <div
          className="relative aspect-9/16 w-full max-w-sm justify-self-start overflow-hidden md:col-span-2 md:max-w-md"
          data-reveal
        >
          <Image
            alt="An intimate table set for dinner at Lily"
            className="scale-110 object-cover parallax-shift"
            data-parallax="0.14"
            fill
            sizes="(max-width: 800px) 82vw, 30vw"
            src="/lily-romantic-interior-9x16.png"
          />
        </div>
        <div
          className="flex max-w-3xl flex-col items-start parallax-shift md:col-span-3"
          data-parallax="0.1"
        >
          <p className="text-burgundy eyebrow reveal-delay-40" data-reveal>
            Our point of view
          </p>
          <h2
            className="mt-2.5 mb-10 max-w-[8ch] font-display text-4xl font-medium text-burgundy reveal-delay-180 md:mb-16 lg:text-6xl"
            data-reveal
          >
            A room for long evenings.
          </h2>
          <div className="mb-10 grid w-full gap-5 md:grid-cols-2 md:gap-12 lg:gap-20">
            <p className="reveal-delay-320" data-reveal>
              Lily is a neighborhood kitchen shaped by the seasons and the people around our table.
              We cook with a light touch, letting excellent produce lead.
            </p>
            <p className="reveal-delay-460" data-reveal>
              The bar follows the same rhythm: garden herbs, ripe fruit, thoughtful spirits, and
              drinks designed to sit beautifully beside dinner.
            </p>
          </div>
          <span data-reveal>
            <PillLink color="burgundy" href="/about">
              Meet Lily
            </PillLink>
          </span>
        </div>
      </section>

      <section className="bg-dark-green text-pink section-pad" id="home-events">
        <div
          className="mb-16 flex flex-col items-start gap-8 parallax-shift md:mb-32 md:flex-row md:items-end md:justify-between"
          data-parallax="0.1"
        >
          <div>
            <p className="eyebrow reveal-delay-40" data-reveal>
              Gather at Lily
            </p>
            <h2
              className="mt-2.5 font-display text-4xl font-medium reveal-delay-180 lg:text-6xl"
              data-reveal
            >
              Tables made
              <br />
              for a little more.
            </h2>
          </div>
          <span className="reveal-delay-180" data-reveal>
            <PillLink color="pink" href="/events">
              Plan an event
            </PillLink>
          </span>
        </div>

        <div className="grid items-start gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4 lg:gap-8">
          <figure className="relative aspect-4/5 w-3/4 overflow-hidden sm:w-full" data-reveal>
            <Image
              alt="A botanical cocktail prepared for an event"
              className="scale-110 object-cover parallax-shift"
              data-parallax="0.13"
              fill
              sizes="30vw"
              src="/lily-botanical-cocktail-4x5.png"
            />
          </figure>
          <div className="space-y-6 text-justify reveal-delay-320" data-reveal>
            <p>
              Birthday dinners, team suppers, and celebrations with no particular reason. Our
              private table seats up to fourteen.
            </p>
            <p>
              Choose a family-style menu, add a welcome cocktail, and let us take care of the shape
              of the evening.
            </p>
          </div>
          <figure className="relative aspect-3/4 overflow-hidden reveal-delay-460" data-reveal>
            <Image
              alt="A celebration table with flowers and shared plates"
              className="scale-110 object-cover parallax-shift"
              data-parallax="0.16"
              fill
              sizes="45vw"
              src="/lily-event-table-16x10.png"
            />
          </figure>
          <figure
            className="relative aspect-2/3 w-3/4 justify-self-end overflow-hidden reveal-delay-560 sm:w-full"
            data-reveal
          >
            <Image
              alt="Lily dining room set for the evening"
              className="scale-110 object-cover parallax-shift"
              data-parallax="0.11"
              fill
              sizes="28vw"
              src="/lily-romantic-interior-9x16.png"
            />
          </figure>
        </div>
      </section>

      <section className="bg-cream text-burgundy section-pad">
        <div
          className="mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center border border-current p-8 text-center parallax-shift md:p-16 lg:p-28"
          data-parallax="0.13"
        >
          <p className="eyebrow reveal-delay-40" data-reveal>
            Your table is waiting
          </p>
          <h2
            className="mt-4 mb-6 max-w-[9ch] font-display text-4xl font-medium reveal-delay-180 lg:text-6xl"
            data-reveal
          >
            Make your reservation now.
          </h2>
          <p className="mb-8 max-w-[32ch] text-lg reveal-delay-320" data-reveal>
            Join us for dinner, drinks, or the pleasure of both.
          </p>
          <span className="reveal-delay-460" data-reveal>
            <PillLink color="burgundy" href="/contact?reason=reservation">
              Book a table
            </PillLink>
          </span>
        </div>
      </section>
    </div>
  )
}

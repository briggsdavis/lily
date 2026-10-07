import Image from "next/image"
import { EventGallery } from "@/components/event-gallery"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { MenuRotator } from "@/components/menu-rotator"
import { PillLink } from "@/components/pill-button"
import { ScrollRevealImage } from "@/components/scroll-reveal-image"
import { ScrollTilt } from "@/components/scroll-tilt"
import { TransitionLink } from "@/components/transition-link"

export default function HomePage() {
  return (
    <div>
      <div>
        <section className="sticky top-0 grid h-svh grid-rows-[1fr_auto] gap-5 px-page pt-24 pb-9 md:gap-8 md:pt-28 lg:pt-36">
          <HeroSlideshow />

          <div className="grid items-center gap-3 pt-4 md:grid-cols-[1fr_auto_1fr] md:gap-12 lg:gap-20">
            <p className="animate-rise-in eyebrow animate-delay-1260">
              Dining room &amp; cocktail bar · Gibsonia
            </p>
            <h1 className="max-w-xs animate-rise-in font-display text-2xl font-medium animate-delay-1410 md:max-w-none md:text-center md:whitespace-nowrap lg:text-3xl xl:text-4xl">
              Candlelit dinners, seasonal plates, considered cocktails.
            </h1>
            <TransitionLink
              className="animated-underline w-max animate-rise-in eyebrow animate-delay-1560 md:justify-self-end"
              href="/contact?reason=reservation"
            >
              Reserve a table
            </TransitionLink>
          </div>
        </section>

        <section className="relative grid min-h-svh place-items-center overflow-hidden bg-dark-green px-page text-pink">
          <Image
            alt=""
            className="absolute top-1/2 left-1/2 h-auto w-[min(80vw,40rem)] -translate-1/2"
            height={1004}
            src="/stamp.svg"
            width={982}
          />
          <p className="relative max-w-[48ch] text-center text-2xl font-extralight text-balance md:text-4xl lg:text-5xl">
            Lily is an intimate dining room and cocktail bar in Gibsonia, where seasonal cooking,
            attentive service, and carefully made drinks turn dinner into the main event of the
            evening.
          </p>
        </section>
      </div>

      <section className="overflow-hidden bg-cream section-pad text-orange-brown">
        <MenuRotator />
      </section>

      <ScrollRevealImage />

      <section className="grid items-center gap-12 bg-burgundy section-pad text-cream md:grid-cols-5 md:gap-20 lg:gap-40">
        <div
          className="relative aspect-9/16 w-full max-w-sm justify-self-start overflow-hidden md:col-span-2 md:max-w-md"
          data-reveal
        >
          <Image
            alt="An intimate table set for dinner at Lily"
            className="object-cover"
            fill
            sizes="(max-width: 800px) 82vw, 30vw"
            src="/lily-romantic-interior-9x16.png"
          />
        </div>
        <div className="flex max-w-3xl flex-col items-start md:col-span-3">
          <h2
            className="mb-10 max-w-[8ch] font-display text-4xl font-medium reveal-delay-180 md:mb-16 lg:text-6xl"
            data-reveal
          >
            A room for long evenings.
          </h2>
          <div className="mb-10 grid w-full gap-5 md:grid-cols-2 md:gap-12 lg:gap-20">
            <p className="reveal-delay-320" data-reveal>
              Lily is a dining room shaped by the seasons. The kitchen cooks with precision and
              restraint, letting exceptional ingredients lead each plate.
            </p>
            <p className="reveal-delay-460" data-reveal>
              The bar holds the same standard: classic technique, seasonal fruit and herbs, fine
              spirits, and cocktails composed to sit beautifully beside dinner.
            </p>
          </div>
          <span data-reveal>
            <PillLink color="cream" href="/about">
              Meet Lily
            </PillLink>
          </span>
        </div>
      </section>

      <section className="bg-dark-green section-pad text-pink" id="home-events">
        <div className="mx-auto max-w-5xl">
          <div className="mb-16 flex flex-col items-start gap-8 md:mb-24 md:flex-row md:justify-between">
            <div className="flex flex-col items-start gap-8">
              <h2 className="font-display text-4xl font-medium lg:text-6xl" data-reveal>
                Tables made
                <br />
                for a little more.
              </h2>
              <span className="reveal-delay-180" data-reveal>
                <PillLink color="pink" href="/events">
                  See upcoming events
                </PillLink>
              </span>
            </div>
            <div className="max-w-sm space-y-4 reveal-delay-320" data-reveal>
              <p>
                Throughout the year we host wine dinners, guest chef suppers, and seasonal tasting
                menus in the dining room, each one built around what's at its peak.
              </p>
              <p>
                Seating is limited and these evenings fill quickly, so we recommend reserving early
                to secure your place.
              </p>
            </div>
          </div>

          <EventGallery />
        </div>
      </section>

      <section className="bg-cream section-pad text-burgundy">
        <div className="relative mx-auto flex min-h-[70vh] max-w-6xl flex-col items-center justify-center overflow-hidden border border-current p-8 text-center md:p-16 lg:p-28">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-2 border border-current md:inset-3"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[min(90%,38rem)] -translate-1/2 bg-burgundy/7 mask-[url(/stamp.svg)] mask-contain mask-center mask-no-repeat"
          />

          <h2
            className="relative mb-6 max-w-[11ch] font-display text-5xl font-medium text-balance reveal-delay-180 md:text-6xl lg:text-8xl"
            data-reveal
          >
            Reserve your table.
          </h2>
          <p
            className="relative mb-10 max-w-[32ch] text-lg text-orange-brown reveal-delay-320"
            data-reveal
          >
            Join us in the dining room for dinner, cocktails, or both.
          </p>
          <span className="relative reveal-delay-460" data-reveal>
            <PillLink color="burgundy" href="/contact?reason=reservation">
              Book a table
            </PillLink>
          </span>

          <div className="absolute inset-x-6 bottom-6 hidden justify-between text-sm text-orange-brown md:flex lg:inset-x-10 lg:bottom-9">
            <a className="animated-underline" href="tel:+17245024572">
              (724) 502-4572
            </a>
            <address className="not-italic">500 Grandview Crossing Dr, Gibsonia</address>
          </div>
        </div>
      </section>

      <section className="relative grid h-svh place-items-center overflow-hidden px-page">
        <Image
          alt="Shared plates spread across a table"
          className="object-cover"
          fill
          sizes="100vw"
          src="/hero-food-unsplash.jpg"
        />
        <ScrollTilt className="relative flex min-h-3/5 w-full max-w-md flex-col justify-between gap-10 bg-cream p-8 text-burgundy md:grid md:w-3/5 md:max-w-none md:grid-cols-2 md:p-12 lg:p-14">
          <h2 className="max-w-[10ch] font-display text-4xl font-medium lg:text-6xl">
            Bring the table home.
          </h2>
          <ul className="space-y-1 text-sm text-orange-brown md:justify-self-end md:text-right">
            <li>Corporate dining</li>
            <li>Private celebrations</li>
            <li>Full-service events</li>
          </ul>
          <p className="max-w-[34ch] self-end text-orange-brown lg:text-lg">
            From executive lunches to private celebrations, we bring Lily's seasonal menus and
            polished service to gatherings across Gibsonia.
          </p>
          <div className="md:self-end md:justify-self-end">
            <PillLink color="burgundy" href="/catering">
              Explore catering
            </PillLink>
          </div>
        </ScrollTilt>
      </section>
    </div>
  )
}

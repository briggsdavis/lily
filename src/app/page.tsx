import Image from "next/image"
import { EventGallery } from "@/components/event-gallery"
import { MenuRotator } from "@/components/menu-rotator"
import { NeighborhoodIntro } from "@/components/neighborhood-intro"
import { PillLink } from "@/components/pill-button"
import { ScrollRevealImage } from "@/components/scroll-reveal-image"
import { ScrollTilt } from "@/components/scroll-tilt"
import { TransitionLink } from "@/components/transition-link"

export default function HomePage() {
  return (
    <div>
      <section
        className="relative isolate h-svh min-h-[44rem] overflow-hidden bg-zinc-950 text-cream"
        data-nav-tone="image"
      >
        <div className="hero-intro-media absolute inset-0">
          <Image
            alt="Lily's warmly lit dining room set for the evening"
            className="object-cover object-[58%_center] md:object-center"
            fill
            priority
            sizes="100vw"
            src="/hero-restaurant-unsplash.jpg"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,5,0.82)_0%,rgba(8,7,5,0.42)_48%,rgba(8,7,5,0.68)_100%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.38)_0%,transparent_38%,rgba(8,7,5,0.84)_100%)]" />
        </div>

        <div className="hero-intro-copy relative grid h-svh min-h-[44rem] grid-rows-[1fr_auto] px-page pt-28 pb-7 md:pt-32 md:pb-9 lg:pb-10">
          <div className="grid content-start gap-9 md:grid-cols-12 md:gap-8 lg:gap-12">
            <div className="md:col-span-7 lg:col-span-6">
              <p className="mb-4 eyebrow text-cream/65">Lily · Gibsonia</p>
              <h1 className="max-w-[13ch] font-display text-[2.65rem] leading-[0.98] font-medium text-balance sm:text-5xl md:text-[3.4rem] lg:text-6xl">
                The dining room glows as the evening draws everyone to the table.
              </h1>
              <TransitionLink
                className="mt-8 inline-flex min-h-14 min-w-44 items-center justify-center border border-cream/55 px-7 text-xs font-bold tracking-[0.2em] uppercase transition-colors duration-300 hover:border-cream hover:bg-cream hover:text-zinc-950 focus-visible:border-cream focus-visible:bg-cream focus-visible:text-zinc-950 focus-visible:outline-none md:mt-10"
                href="/contact?reason=reservation"
              >
                Reserve a table
              </TransitionLink>
            </div>

            <p className="max-w-[31ch] text-sm leading-7 text-cream/75 md:col-span-4 md:col-start-9 md:mt-14 lg:col-span-3 lg:col-start-10 lg:text-base lg:leading-8">
              A neighborhood kitchen and cocktail bar shaped by the seasons, with considered plates,
              garden-led drinks, and warm service made for long evenings.
            </p>
          </div>

          <div className="flex items-end justify-between gap-8">
            <Image
              alt="Lily Kitchen and Cocktails"
              className="h-auto w-44 sm:w-56 md:w-72 lg:w-80"
              height={767}
              priority
              sizes="(max-width: 640px) 11rem, (max-width: 768px) 14rem, (max-width: 1024px) 18rem, 20rem"
              src="/PRIMARY-HORIZONTAL-CREAM.png"
              width={2329}
            />
            <p className="hidden text-right text-[0.65rem] font-bold tracking-[0.22em] text-cream/55 uppercase sm:block">
              Seasonal kitchen · Considered cocktails
            </p>
          </div>
        </div>
      </section>

      <section
        className="relative grid min-h-svh place-items-center overflow-hidden bg-dark-green px-page text-pink"
        data-nav-tone="dark"
      >
        <Image
          alt=""
          className="absolute top-1/2 left-1/2 h-auto w-[min(80vw,40rem)] -translate-1/2 opacity-65"
          height={1004}
          src="/stamp.svg"
          width={982}
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(201,168,178,0.08),transparent_32%),radial-gradient(circle_at_78%_65%,rgba(253,242,226,0.06),transparent_28%)]" />
        <NeighborhoodIntro />
      </section>

      <section
        className="overflow-hidden bg-cream px-page pt-14 pb-24 text-orange-brown md:pt-20 md:pb-32 lg:pt-24 lg:pb-40"
        data-nav-tone="light"
      >
        <MenuRotator />
      </section>

      <ScrollRevealImage />

      <section
        className="grid items-center gap-12 bg-burgundy section-pad text-cream md:grid-cols-5 md:gap-20 lg:gap-40"
        data-nav-tone="dark"
      >
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

      <section
        className="bg-dark-green px-page pt-24 pb-12 text-pink md:pt-32 md:pb-16 lg:pt-40 lg:pb-20"
        data-nav-tone="dark"
        id="home-events"
      >
        <div>
          <div className="mb-8 grid items-start gap-8 md:mb-12 md:grid-cols-3 md:gap-6">
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
            <p className="reveal-delay-320" data-reveal>
              Throughout the year we host wine dinners, guest chef suppers, and seasonal tasting
              menus in the dining room, each one built around what's at its peak.
            </p>
            <p className="reveal-delay-460" data-reveal>
              Seating is limited and these evenings fill quickly, so we recommend reserving early to
              secure your place.
            </p>
          </div>

          <EventGallery />
        </div>
      </section>

      <section
        className="bg-cream px-page pt-12 pb-24 text-burgundy md:pt-16 md:pb-32 lg:pt-20 lg:pb-40"
        data-nav-tone="light"
      >
        <div className="relative mx-auto flex min-h-[104vh] w-3/5 flex-col items-center justify-center overflow-hidden border border-current p-8 text-center md:p-16 lg:p-28">
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

      <section
        className="relative grid h-svh place-items-center overflow-hidden px-page"
        data-nav-tone="image"
      >
        <Image
          alt="Shared plates spread across a table"
          className="object-cover"
          fill
          sizes="100vw"
          src="/lily-event-table-16x10.png"
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

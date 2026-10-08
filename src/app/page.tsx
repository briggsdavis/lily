import Image from "next/image"
import { EventsShowcase } from "@/components/events-showcase"
import { MenuRotator } from "@/components/menu-rotator"
import { NeighborhoodIntro } from "@/components/neighborhood-intro"
import { PillLink } from "@/components/pill-button"
import { ScrollRevealImage } from "@/components/scroll-reveal-image"
import { ScrollTilt } from "@/components/scroll-tilt"

export default function HomePage() {
  return (
    <div>
      <div className="relative">
        <section
          className="sticky top-0 isolate h-svh min-h-[44rem] overflow-hidden bg-zinc-950 text-cream"
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

          <div className="relative grid h-svh min-h-[44rem] grid-rows-[1fr_auto] px-page pt-28 pb-7 md:pt-32 md:pb-9 lg:pb-10">
            <div className="grid content-start gap-9 md:grid-cols-12 md:gap-8 lg:gap-12">
              <div className="md:col-span-7 lg:col-span-6">
                <h1 className="hero-stagger font-display text-[1.9875rem] leading-[0.98] font-medium animate-delay-420 sm:text-4xl md:text-[2.55rem] lg:text-[2.8125rem]">
                  <span className="block">The room glows</span>
                  <span className="block">into the evening.</span>
                </h1>
                <div className="hero-stagger mt-8 animate-delay-720 md:mt-10">
                  <PillLink color="cream" href="/contact?reason=reservation">
                    Reserve a table
                  </PillLink>
                </div>
              </div>

              <p className="hero-stagger text-sm leading-7 text-cream/75 animate-delay-570 md:col-span-6 md:col-start-7 md:justify-self-end md:text-right lg:text-base lg:leading-8">
                <span className="lg:block">A neighborhood kitchen and cocktail bar</span>{" "}
                <span className="lg:block">shaped by the seasons, with considered plates,</span>{" "}
                <span className="lg:block">
                  garden-led drinks, and warm service made for long evenings.
                </span>
              </p>
            </div>

            <div className="flex items-end justify-between gap-8">
              <Image
                alt="Lily Kitchen and Cocktails"
                className="hero-stagger h-auto w-44 animate-delay-900 sm:w-56 md:w-72 lg:w-80"
                height={767}
                priority
                sizes="(max-width: 640px) 11rem, (max-width: 768px) 14rem, (max-width: 1024px) 18rem, 20rem"
                src="/PRIMARY-HORIZONTAL-CREAM.png"
                width={2329}
              />
              <p className="hero-stagger hidden text-right text-[0.65rem] font-bold tracking-[0.22em] text-cream/55 uppercase animate-delay-1050 sm:block">
                Seasonal kitchen · Considered cocktails
              </p>
            </div>
          </div>
        </section>

        <section
          className="relative z-10 grid min-h-svh place-items-center overflow-hidden bg-dark-green px-page text-pink"
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
      </div>

      <section
        className="relative isolate overflow-hidden bg-mauve px-page pt-14 pb-24 text-warm-white md:pt-20 md:pb-32 lg:pt-24 lg:pb-40"
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
        <div className="relative z-10">
          <MenuRotator />
        </div>
      </section>

      <ScrollRevealImage />

      <section
        className="grid items-center gap-14 bg-olive-charcoal section-pad text-warm-white md:grid-cols-2 md:gap-20 lg:gap-32"
        data-nav-tone="dark"
      >
        <div className="flex max-w-2xl flex-col items-start">
          <h2
            className="mb-10 max-w-[8ch] font-display text-4xl font-medium text-blush md:mb-16 lg:text-6xl"
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
          <span className="reveal-delay-600" data-reveal>
            <PillLink color="cream" href="/about">
              Meet Lily
            </PillLink>
          </span>
        </div>
        <Image
          alt=""
          aria-hidden="true"
          className="h-auto w-full max-w-lg justify-self-center md:justify-self-end"
          data-reveal
          height={1004}
          src="/STAMP-BROWN.svg"
          width={982}
        />
      </section>

      <section
        className="relative isolate grid h-svh min-h-[42rem] overflow-hidden px-page py-24 text-cream md:py-28 lg:py-32"
        data-nav-tone="image"
        id="home-story"
      >
        <Image
          alt="Candlelit tables prepared for an evening at Lily"
          className="object-cover object-[52%_center]"
          fill
          sizes="100vw"
          src="/contact-events-unsplash.jpg"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,8,5,0.72)_0%,rgba(10,8,5,0.18)_48%,rgba(10,8,5,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.18)_0%,transparent_40%,rgba(10,8,5,0.55)_100%)]" />

        <div className="relative flex h-full flex-col justify-between gap-16">
          <h2
            className="font-display text-[1.6875rem] leading-[1.02] font-medium sm:text-4xl md:text-[2.8125rem] lg:text-[3.375rem]"
            data-reveal
          >
            <span className="block">Season-led cooking,</span>
            <span className="block">served with warmth.</span>
          </h2>

          <div className="flex max-w-sm flex-col items-start self-end md:max-w-md">
            <p
              className="mb-7 text-sm leading-7 text-cream/85 reveal-delay-180 md:text-base md:leading-8"
              data-reveal
            >
              Guided by the market and grounded in generous hospitality, Lily brings thoughtful
              plates and considered cocktails to the table, made to be shared over an unhurried
              evening.
            </p>
            <div className="flex flex-wrap gap-3 reveal-delay-320" data-reveal>
              <PillLink color="cream" href="/contact?reason=reservation">
                Reserve a table
              </PillLink>
              <PillLink color="cream" href="/menu">
                View the menu
              </PillLink>
            </div>
          </div>
        </div>
      </section>

      <EventsShowcase />

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
            className="relative mb-6 max-w-[11ch] font-display text-5xl font-medium text-balance md:text-6xl lg:text-8xl"
            data-reveal
          >
            Reserve your table.
          </h2>
          <p
            className="relative mb-10 max-w-[32ch] text-lg text-orange-brown reveal-delay-180"
            data-reveal
          >
            Join us in the dining room for dinner, cocktails, or both.
          </p>
          <span className="relative reveal-delay-320" data-reveal>
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
          <h2 className="max-w-[10ch] font-display text-4xl font-medium lg:text-6xl" data-reveal>
            Bring the table home.
          </h2>
          <ul
            className="space-y-1 text-sm text-orange-brown reveal-delay-180 md:justify-self-end md:text-right"
            data-reveal
          >
            <li>Corporate dining</li>
            <li>Private celebrations</li>
            <li>Full-service events</li>
          </ul>
          <p
            className="max-w-[34ch] self-end text-orange-brown reveal-delay-320 lg:text-lg"
            data-reveal
          >
            From executive lunches to private celebrations, we bring Lily's seasonal menus and
            polished service to gatherings across Gibsonia.
          </p>
          <div className="reveal-delay-460 md:self-end md:justify-self-end" data-reveal>
            <PillLink color="burgundy" href="/catering">
              Explore catering
            </PillLink>
          </div>
        </ScrollTilt>
      </section>
    </div>
  )
}

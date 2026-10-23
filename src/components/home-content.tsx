"use client"
import Image from "next/image"
import { PrivateEventCta } from "@/components/about-evening"
import { EventsShowcase } from "@/components/events-showcase"
import { MenuRotator } from "@/components/menu-rotator"
import { NeighborhoodIntro } from "@/components/neighborhood-intro"
import { EditableText, ColorSection, MediaEditControl } from "@/components/page-content"
import { MediaImage, HeroSoundToggle } from "@/components/page-media"
import { PillLink } from "@/components/pill-button"
import { RotatingCrest } from "@/components/rotating-crest"
import { ScrollRevealImage } from "@/components/scroll-reveal-image"
import { ScrollTilt } from "@/components/scroll-tilt"

export function HomeContent() {
  return (
    <div>
      <div className="relative">
        <section
          className="sticky top-0 isolate h-svh min-h-[44rem] overflow-hidden bg-zinc-950 text-cream"
          data-nav-tone="image"
        >
          <div className="hero-intro-media absolute inset-0">
            <MediaImage
              mediaKey="home.hero"
              alt="Lily's warmly lit dining room set for the evening"
              className="object-cover object-[58%_center] md:object-center"
              fill
              priority
              sizes="100vw"
              src="/images/hero-restaurant-unsplash.jpg"
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,7,5,0.82)_0%,rgba(8,7,5,0.42)_48%,rgba(8,7,5,0.68)_100%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(8,7,5,0.38)_0%,transparent_38%,rgba(8,7,5,0.84)_100%)]" />
          </div>

          <div className="relative grid h-svh min-h-[44rem] grid-rows-[1fr_auto] px-page pt-28 pb-7 md:pt-32 md:pb-9 lg:pb-10">
            <div className="grid content-start justify-items-center gap-9 text-center md:grid-cols-12 md:justify-items-stretch md:gap-8 md:text-left lg:gap-12">
              <div className="md:col-span-7 lg:col-span-6">
                <h1 className="hero-stagger font-demibold text-[1.9875rem] leading-[0.98] font-semibold uppercase animate-delay-420 sm:text-4xl md:text-[2.55rem] lg:text-[2.8125rem]">
                  <EditableText field="home.hero.heading" italicWord="stay for the evening">
                    <span className="block">Come for dinner,</span>
                    <em className="block italic">stay for the evening.</em>
                  </EditableText>
                </h1>
                <div className="hero-stagger mt-8 animate-delay-720 md:mt-10">
                  <PillLink
                    field="home.hero.reservation"
                    color="cream"
                    href="/contact?reason=reservation"
                  >
                    Reserve a table
                  </PillLink>
                </div>
              </div>

              <p className="hero-stagger hero-intro-side text-sm leading-7 text-cream/75 animate-delay-570 md:col-span-6 md:col-start-7 md:justify-self-end md:text-right lg:text-base lg:leading-8">
                <EditableText field="home.hero.description">
                  <span className="lg:block">A neighborhood kitchen and cocktail bar</span>{" "}
                  <span className="lg:block">shaped by the seasons, with considered plates,</span>{" "}
                  <span className="lg:block">
                    garden-led drinks, and warm service made for long evenings.
                  </span>
                </EditableText>
              </p>
            </div>

            <div className="flex flex-col items-center gap-8 md:flex-row md:items-end md:justify-between">
              <Image
                alt="Lily Kitchen and Cocktails"
                className="hero-stagger h-auto w-[16.5rem] animate-delay-900 sm:w-[21rem] md:w-[27rem] lg:w-[30rem]"
                height={767}
                priority
                sizes="(max-width: 640px) 16.5rem, (max-width: 768px) 21rem, (max-width: 1024px) 27rem, 30rem"
                src="/images/primary-horizontal-cream.png"
                width={2329}
              />
              <p className="hero-stagger hidden text-center text-[0.65rem] font-bold tracking-[0.22em] text-cream/55 uppercase animate-delay-1050 sm:block md:text-right">
                <EditableText field="home.hero.tagline">
                  Seasonal kitchen · Considered cocktails
                </EditableText>
              </p>
            </div>
          </div>
          <MediaEditControl mediaKey="home.hero" />
          <HeroSoundToggle mediaKey="home.hero" />
        </section>

        <ColorSection
          field="home.intro.color"
          className="relative z-10 grid min-h-svh place-items-center overflow-hidden bg-deep-brown px-page text-pink"
          data-nav-tone="dark"
        >
          <MediaImage
            mediaKey="home.intro"
            alt=""
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=2400&q=85&exp=-35&sat=-15"
            fill
            sizes="100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-deep-brown/10" />
          <MediaEditControl mediaKey="home.intro" />
          <Image
            alt=""
            className="absolute top-1/2 left-1/2 h-auto w-[min(80vw,40rem)] -translate-1/2 opacity-[0.3185]"
            height={1004}
            src="/images/stamp-pink.svg"
            width={982}
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_35%,rgba(201,168,178,0.08),transparent_32%),radial-gradient(circle_at_78%_65%,rgba(253,242,226,0.06),transparent_28%)]" />
          <NeighborhoodIntro />
        </ColorSection>
      </div>

      <ColorSection
        field="home.menu.color"
        className="relative isolate overflow-hidden bg-dark-maroon px-page pt-14 pb-24 text-warm-white md:pt-20 md:pb-32 lg:pt-24 lg:pb-40"
        data-nav-tone="dark"
      >
        <RotatingCrest className="pointer-events-none absolute top-1/2 right-[-8%] hidden h-auto w-[min(48vw,38rem)] -translate-y-1/2 opacity-50 md:block" />
        <div className="relative z-10">
          <MenuRotator />
        </div>
      </ColorSection>

      <ScrollRevealImage />

      <ColorSection
        field="home.about.color"
        className="relative isolate grid min-h-svh items-center gap-14 overflow-hidden bg-grey section-pad text-pink md:grid-cols-2 md:gap-20 lg:gap-32"
        data-nav-tone="dark"
      >
        <Image
          alt=""
          aria-hidden="true"
          src="/images/Shadow.png"
          fill
          sizes="100vw"
          className="pointer-events-none z-20 object-cover opacity-30 mix-blend-multiply"
        />
        <div className="relative z-10 flex max-w-3xl flex-col items-start md:max-w-[45vw]">
          <h2
            className="mb-8 font-header-stencil text-5xl tracking-[0.04em] text-pink uppercase md:mb-10 lg:text-7xl"
            data-reveal
          >
            <EditableText field="home.about.heading">About</EditableText>
          </h2>
          <div className="mb-10 grid w-full gap-x-12 gap-y-7 md:grid-cols-2 lg:gap-x-20">
            <p className="reveal-delay-180" data-reveal>
              <EditableText field="home.about.kitchen">
                Lily is a dining room shaped by the seasons. The kitchen cooks with precision and
                restraint, letting exceptional ingredients lead each plate.
              </EditableText>
            </p>
            <p className="reveal-delay-320" data-reveal>
              <EditableText field="home.about.bar">
                The bar holds the same standard: classic technique, seasonal fruit and herbs, fine
                spirits, and cocktails composed to sit beautifully beside dinner.
              </EditableText>
            </p>
          </div>
          <span className="reveal-delay-600" data-reveal>
            <PillLink field="home.about.button" color="pink" href="/about">
              Meet Lily
            </PillLink>
          </span>
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 -right-[35vw] w-[85vw] -translate-y-1/2 opacity-20 md:-right-[6vw] md:w-[56vw] md:opacity-85"
        >
          <Image
            alt=""
            className="h-auto w-full"
            data-reveal
            height={1004}
            src="/images/stamp-pink.svg"
            width={982}
          />
        </div>
      </ColorSection>

      <section
        className="relative isolate grid h-svh min-h-[42rem] overflow-hidden px-page py-24 text-cream md:py-28 lg:py-32"
        data-nav-tone="image"
        id="home-story"
      >
        <MediaImage
          mediaKey="home.cooking"
          alt="Candlelit tables prepared for an evening at Lily"
          className="object-cover object-[52%_center]"
          fill
          sizes="100vw"
          src="/images/contact-events-unsplash.jpg"
        />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(10,8,5,0.72)_0%,rgba(10,8,5,0.18)_48%,rgba(10,8,5,0.62)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,8,5,0.18)_0%,transparent_40%,rgba(10,8,5,0.55)_100%)]" />

        <div className="relative flex h-full items-start">
          <div className="flex max-w-lg flex-col items-start">
            <h2
              className="font-demibold text-[1.6875rem] leading-[1.02] font-semibold uppercase sm:text-4xl md:text-[2.8125rem] lg:text-[3.375rem]"
              data-reveal
            >
              <EditableText field="home.cooking.heading" italicWord="served with warmth">
                <span className="block">Season-led cooking,</span>
                <em className="block italic">served with warmth.</em>
              </EditableText>
            </h2>
            <p
              className="mt-8 mb-7 max-w-[38ch] text-sm leading-7 text-cream/85 reveal-delay-180 md:mt-10 md:text-base md:leading-8"
              data-reveal
            >
              <EditableText field="home.cooking.description">
                <span className="md:block">Market-led plates and considered cocktails,</span>{" "}
                <span className="md:block">grounded in generous hospitality and made</span>{" "}
                <span className="md:block">for sharing over an unhurried evening.</span>
              </EditableText>
            </p>
            <div className="flex flex-wrap gap-3 reveal-delay-320" data-reveal>
              <PillLink
                field="home.cooking.reservation"
                color="cream"
                href="/contact?reason=reservation"
              >
                Reserve a table
              </PillLink>
              <PillLink field="home.cooking.menu" color="cream" href="/menu">
                View the menu
              </PillLink>
            </div>
          </div>
        </div>
        <MediaEditControl mediaKey="home.cooking" />
        <HeroSoundToggle mediaKey="home.cooking" />
      </section>

      <EventsShowcase />

      <PrivateEventCta />

      <section
        className="relative grid h-svh place-items-center overflow-hidden px-page"
        data-nav-tone="image"
      >
        <MediaImage
          mediaKey="home.catering"
          alt="Shared plates spread across a table"
          className="object-cover"
          fill
          sizes="100vw"
          src="/images/lily-event-table-16x10.webp"
        />
        <MediaEditControl mediaKey="home.catering" />
        <ScrollTilt
          colorField="home.catering.color"
          className="@container relative flex min-h-3/5 w-full max-w-md flex-col justify-between gap-10 bg-espresso p-8 text-cream md:grid md:w-3/5 md:max-w-none md:grid-cols-2 md:p-12 lg:p-14"
        >
          <h2 className="w-full font-header-stencil text-[7.8cqw] md:col-span-2" data-reveal>
            <EditableText field="home.catering.heading" italicWord="home">
              Bring the table <em className="italic">home</em>.
            </EditableText>
          </h2>
          <p
            className="max-w-[34ch] self-end text-pretty text-cream/75 reveal-delay-320 lg:text-lg"
            data-reveal
          >
            <EditableText field="home.catering.description">
              From executive lunches to private celebrations, we bring Lily's seasonal menus and
              polished service to gatherings across Gibsonia.
            </EditableText>
          </p>
          <div className="reveal-delay-460 md:self-end md:justify-self-end" data-reveal>
            <PillLink field="home.catering.button" color="cream" href="/catering">
              Explore catering
            </PillLink>
          </div>
        </ScrollTilt>
      </section>
    </div>
  )
}

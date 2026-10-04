import Image from "next/image"
import { HeroSlideshow } from "@/components/hero-slideshow"
import { MenuRotator } from "@/components/menu-rotator"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <HeroSlideshow />

        <div className="home-hero__footer">
          <p className="eyebrow home-hero__copy home-hero__copy--one">
            Kitchen &amp; cocktails · Pittsburgh
          </p>
          <h1 className="home-hero__copy home-hero__copy--two">
            Late lunches, candlelit dinners, lingering drinks.
          </h1>
          <TransitionLink
            className="text-link home-hero__copy home-hero__copy--three"
            href="/contact?reason=reservation"
          >
            Reserve a table
          </TransitionLink>
        </div>
      </section>

      <section className="menu-showcase section-pad">
        <MenuRotator />
      </section>

      <section className="about-preview section-pad">
        <div className="about-preview__image" data-reveal>
          <Image
            alt="An intimate table set for dinner at Lily"
            data-parallax="0.14"
            fill
            sizes="(max-width: 800px) 82vw, 30vw"
            src="/lily-romantic-interior-9x16.png"
          />
        </div>
        <div className="about-preview__copy parallax-shift" data-parallax="0.1">
          <p className="eyebrow" data-reveal>
            Our point of view
          </p>
          <h2 data-reveal>A room for long evenings.</h2>
          <div className="about-preview__paragraphs">
            <p data-reveal>
              Lily is a neighborhood kitchen shaped by the seasons and the people around our table.
              We cook with a light touch, letting excellent produce lead.
            </p>
            <p data-reveal>
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

      <section className="events-preview section-pad" id="home-events">
        <div className="events-preview__heading parallax-shift" data-parallax="0.1">
          <div>
            <p className="eyebrow" data-reveal>
              Gather at Lily
            </p>
            <h2 data-reveal>
              Tables made
              <br />
              for a little more.
            </h2>
          </div>
          <span data-reveal>
            <PillLink color="pink" href="/events">
              Plan an event
            </PillLink>
          </span>
        </div>

        <div className="events-collage">
          <figure className="events-collage__item events-collage__item--one" data-reveal>
            <Image
              alt="A botanical cocktail prepared for an event"
              data-parallax="0.13"
              fill
              sizes="30vw"
              src="/lily-botanical-cocktail-4x5.png"
            />
          </figure>
          <div className="events-collage__copy" data-reveal>
            <p>
              Birthday dinners, team suppers, and celebrations with no particular reason. Our
              private table seats up to fourteen.
            </p>
            <p>
              Choose a family-style menu, add a welcome cocktail, and let us take care of the shape
              of the evening.
            </p>
          </div>
          <figure className="events-collage__item events-collage__item--two" data-reveal>
            <Image
              alt="A celebration table with flowers and shared plates"
              data-parallax="0.16"
              fill
              sizes="45vw"
              src="/lily-event-table-16x10.png"
            />
          </figure>
          <figure className="events-collage__item events-collage__item--three" data-reveal>
            <Image
              alt="Lily dining room set for the evening"
              data-parallax="0.11"
              fill
              sizes="28vw"
              src="/lily-romantic-interior-9x16.png"
            />
          </figure>
        </div>
      </section>

      <section className="reserve-band section-pad">
        <div className="reserve-card parallax-shift" data-parallax="0.13">
          <p className="eyebrow" data-reveal>
            Your table is waiting
          </p>
          <h2 data-reveal>Make your reservation now.</h2>
          <p data-reveal>Join us for dinner, drinks, or the pleasure of both.</p>
          <span data-reveal>
            <PillLink color="burgundy" href="/contact?reason=reservation">
              Book a table
            </PillLink>
          </span>
        </div>
      </section>
    </div>
  )
}

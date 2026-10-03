import Image from "next/image"
import { MenuRotator } from "@/components/menu-rotator"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__logo">
          <Image
            alt="Lily Kitchen and Cocktails"
            height={882}
            priority
            src="/primary logo.png"
            width={890}
          />
        </div>

        <div className="home-hero__footer">
          <p className="eyebrow">Kitchen &amp; cocktails · Madrid</p>
          <h1>Late lunches, candlelit dinners, and drinks that linger.</h1>
          <TransitionLink className="text-link" href="/contact">
            Reserve a table
          </TransitionLink>
        </div>
      </section>

      <section className="menu-showcase section-pad">
        <div className="section-intro">
          <div>
            <p className="eyebrow">From the kitchen</p>
            <h2>One garden,<br />three ways.</h2>
          </div>
          <p>
            The menu moves with the market. Bright drinks, generous plates, and desserts that know exactly when to stop.
          </p>
        </div>
        <MenuRotator />
        <div className="section-action">
          <PillLink color="forest" href="/menu">Explore the menu</PillLink>
        </div>
      </section>

      <section className="about-preview section-pad">
        <div className="about-preview__image">
          <Image
            alt="An intimate table set for dinner at Lily"
            fill
            sizes="(max-width: 800px) 82vw, 30vw"
            src="/lily-romantic-interior-9x16.png"
          />
        </div>
        <div className="about-preview__copy">
          <p className="eyebrow">Our point of view</p>
          <h2>A room for long evenings.</h2>
          <div className="about-preview__paragraphs">
            <p>
              Lily is a neighborhood kitchen shaped by the seasons and the people around our table. We cook with a light touch, letting excellent produce lead.
            </p>
            <p>
              The bar follows the same rhythm: garden herbs, ripe fruit, thoughtful spirits, and drinks designed to sit beautifully beside dinner.
            </p>
          </div>
          <PillLink color="clay" href="/about">Meet Lily</PillLink>
        </div>
      </section>

      <section className="events-preview section-pad">
        <div className="events-preview__heading">
          <div>
            <p className="eyebrow">Gather at Lily</p>
            <h2>Tables made<br />for a little more.</h2>
          </div>
          <PillLink color="rose" href="/events">Plan an event</PillLink>
        </div>

        <div className="events-collage">
          <figure className="events-collage__item events-collage__item--one">
            <Image alt="A botanical cocktail prepared for an event" fill sizes="30vw" src="/lily-botanical-cocktail-4x5.png" />
          </figure>
          <p className="events-collage__copy events-collage__copy--one">
            Birthday dinners, team suppers, and celebrations with no particular reason. Our private table seats up to fourteen.
          </p>
          <figure className="events-collage__item events-collage__item--two">
            <Image alt="A celebration table with flowers and shared plates" fill sizes="45vw" src="/lily-event-table-16x10.png" />
          </figure>
          <p className="events-collage__copy events-collage__copy--two">
            Choose a family-style menu, add a welcome cocktail, and let us take care of the shape of the evening.
          </p>
          <figure className="events-collage__item events-collage__item--three">
            <Image alt="Lily dining room set for the evening" fill sizes="28vw" src="/lily-romantic-interior-9x16.png" />
          </figure>
        </div>
      </section>

      <section className="reserve-band section-pad">
        <div className="reserve-card">
          <p className="eyebrow">Your table is waiting</p>
          <h2>Make your reservation now.</h2>
          <p>Join us for dinner, drinks, or the pleasure of both.</p>
          <PillLink color="rose" href="/contact">Book a table</PillLink>
        </div>
      </section>
    </div>
  )
}

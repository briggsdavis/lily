import Image from "next/image"
import { MenuRotator } from "@/components/menu-rotator"
import { PillLink } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"

export default function HomePage() {
  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__logo" data-reveal>
          <Image
            alt="Lily Kitchen and Cocktails"
            data-parallax="0.075"
            height={882}
            priority
            src="/primary logo.png"
            width={890}
          />
        </div>

        <div className="home-hero__footer">
          <p className="eyebrow" data-reveal>Kitchen &amp; cocktails · Madrid</p>
          <h1 data-reveal>Late lunches, candlelit dinners, and drinks that linger.</h1>
          <TransitionLink className="text-link" data-reveal href="/contact">
            Reserve a table
          </TransitionLink>
        </div>
      </section>

      <section className="menu-showcase section-pad">
        <div className="section-intro parallax-shift" data-parallax="0.025">
          <div>
            <p className="eyebrow" data-reveal>From the kitchen</p>
            <h2 data-reveal>One garden,<br />three ways.</h2>
          </div>
          <p data-reveal>
            The menu moves with the market. Bright drinks, generous plates, and desserts that know exactly when to stop.
          </p>
        </div>
        <MenuRotator />
        <div className="section-action" data-reveal>
          <PillLink color="forest" href="/menu">Explore the menu</PillLink>
        </div>
      </section>

      <section className="about-preview section-pad">
        <div className="about-preview__image" data-reveal>
          <Image
            alt="An intimate table set for dinner at Lily"
            data-parallax="0.06"
            fill
            sizes="(max-width: 800px) 82vw, 30vw"
            src="/lily-romantic-interior-9x16.png"
          />
        </div>
        <div className="about-preview__copy parallax-shift" data-parallax="0.025">
          <p className="eyebrow" data-reveal>Our point of view</p>
          <h2 data-reveal>A room for long evenings.</h2>
          <div className="about-preview__paragraphs">
            <p data-reveal>
              Lily is a neighborhood kitchen shaped by the seasons and the people around our table. We cook with a light touch, letting excellent produce lead.
            </p>
            <p data-reveal>
              The bar follows the same rhythm: garden herbs, ripe fruit, thoughtful spirits, and drinks designed to sit beautifully beside dinner.
            </p>
          </div>
          <span data-reveal><PillLink color="rose" href="/about">Meet Lily</PillLink></span>
        </div>
      </section>

      <section className="events-preview section-pad">
        <div className="events-preview__heading parallax-shift" data-parallax="0.025">
          <div>
            <p className="eyebrow" data-reveal>Gather at Lily</p>
            <h2 data-reveal>Tables made<br />for a little more.</h2>
          </div>
          <span data-reveal><PillLink color="burgundy" href="/events">Plan an event</PillLink></span>
        </div>

        <div className="events-collage">
          <figure className="events-collage__item events-collage__item--one" data-reveal>
            <Image alt="A botanical cocktail prepared for an event" data-parallax="0.055" fill sizes="30vw" src="/lily-botanical-cocktail-4x5.png" />
          </figure>
          <p className="events-collage__copy events-collage__copy--one" data-reveal>
            Birthday dinners, team suppers, and celebrations with no particular reason. Our private table seats up to fourteen.
          </p>
          <figure className="events-collage__item events-collage__item--two" data-reveal>
            <Image alt="A celebration table with flowers and shared plates" data-parallax="0.07" fill sizes="45vw" src="/lily-event-table-16x10.png" />
          </figure>
          <p className="events-collage__copy events-collage__copy--two" data-reveal>
            Choose a family-style menu, add a welcome cocktail, and let us take care of the shape of the evening.
          </p>
          <figure className="events-collage__item events-collage__item--three" data-reveal>
            <Image alt="Lily dining room set for the evening" data-parallax="0.045" fill sizes="28vw" src="/lily-romantic-interior-9x16.png" />
          </figure>
        </div>
      </section>

      <section className="reserve-band section-pad">
        <div className="reserve-card parallax-shift" data-parallax="0.02">
          <p className="eyebrow" data-reveal>Your table is waiting</p>
          <h2 data-reveal>Make your reservation now.</h2>
          <p data-reveal>Join us for dinner, drinks, or the pleasure of both.</p>
          <span data-reveal><PillLink color="rose" href="/contact">Book a table</PillLink></span>
        </div>
      </section>
    </div>
  )
}

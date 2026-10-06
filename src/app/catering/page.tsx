import { Metadata } from "next"
import Image from "next/image"
import { PillLink } from "@/components/pill-button"

export const metadata: Metadata = {
  title: "Catering",
  description: "Seasonal catering from Lily for gatherings across Pittsburgh.",
}

const occasions = [
  [
    "01",
    "Office tables",
    "Generous lunches and working dinners, delivered ready to share with the whole room.",
  ],
  [
    "02",
    "At-home celebrations",
    "Seasonal food for birthdays, showers, and evenings that deserve more time around the table.",
  ],
  [
    "03",
    "Full-service gatherings",
    "A considered menu, thoughtful drinks, and a team to carry the occasion from arrival to last pour.",
  ],
] as const

export default function CateringPage() {
  return (
    <div className="catering-page">
      <section className="catering-hero">
        <div className="catering-hero__copy">
          <p className="eyebrow" data-reveal>
            Lily, wherever you gather
          </p>
          <h1 data-reveal>Catering</h1>
          <p data-reveal>
            Seasonal plates, generous spreads, and the easy rhythm of Lily brought to tables across
            Pittsburgh.
          </p>
          <span data-reveal>
            <PillLink color="burgundy" href="/contact?reason=events">
              Start an inquiry
            </PillLink>
          </span>
        </div>
        <div className="catering-hero__image" data-reveal>
          <Image
            alt="A celebration table set with flowers and shared plates"
            data-parallax="0.12"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
            src="/lily-event-table-16x10.png"
          />
        </div>
      </section>

      <section className="catering-occasions section-pad">
        <div className="catering-occasions__heading parallax-shift" data-parallax="0.08">
          <p className="eyebrow" data-reveal>
            Gather your way
          </p>
          <h2 data-reveal>Made for the shape of your day.</h2>
        </div>
        <div className="catering-occasions__grid">
          {occasions.map(([number, title, copy]) => (
            <article data-reveal key={number}>
              <p className="eyebrow">{number}</p>
              <h3>{title}</h3>
              <p>{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="catering-menu section-pad">
        <div className="catering-menu__image" data-reveal>
          <Image
            alt="A seasonal main dish prepared by Lily"
            data-parallax="0.14"
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
            src="/lily-seasonal-main-dish-4x5.png"
          />
        </div>
        <div className="catering-menu__copy parallax-shift" data-parallax="0.08">
          <p className="eyebrow" data-reveal>
            From our kitchen
          </p>
          <h2 data-reveal>Menus that move with the market.</h2>
          <p data-reveal>
            We build each menu around the season, the setting, and how you want your guests to feel.
            Choose from passed bites, family-style tables, or individually composed meals, with
            cocktails and wine available alongside.
          </p>
          <p data-reveal>
            Vegetarian and dietary accommodations are happily considered as we shape the menu
            together.
          </p>
          <span data-reveal>
            <PillLink color="burgundy" href="/contact?reason=events">
              Tell us about your gathering
            </PillLink>
          </span>
        </div>
      </section>

      <section className="catering-cta section-pad">
        <div className="catering-cta__inner parallax-shift" data-parallax="0.1">
          <p className="eyebrow" data-reveal>
            Begin with a conversation
          </p>
          <h2 data-reveal>Bring Lily to the table.</h2>
          <p data-reveal>
            Share your date, guest count, and a little about the occasion. Our team will be in touch
            with the next steps.
          </p>
          <span data-reveal>
            <PillLink color="pink" href="/contact?reason=events">
              Inquire about catering
            </PillLink>
          </span>
        </div>
      </section>
    </div>
  )
}

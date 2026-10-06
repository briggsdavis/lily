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
    <div>
      <section className="grid min-h-svh items-center gap-12 bg-cream px-page pt-32 pb-16 text-orange-brown md:grid-cols-5 md:gap-16 lg:gap-32 lg:pt-40 lg:pb-28">
        <div className="flex max-w-lg flex-col items-start pt-8 md:col-span-2 md:pt-0">
          <p className="eyebrow" data-reveal>
            Lily, wherever you gather
          </p>
          <h1
            className="mt-2.5 mb-6 font-display text-5xl font-medium text-burgundy md:text-6xl lg:text-8xl"
            data-reveal
          >
            Catering
          </h1>
          <p className="mb-8 max-w-[37ch] text-base lg:text-lg" data-reveal>
            Seasonal plates, generous spreads, and the easy rhythm of Lily brought to tables across
            Pittsburgh.
          </p>
          <span data-reveal>
            <PillLink color="burgundy" href="/contact?reason=events">
              Start an inquiry
            </PillLink>
          </span>
        </div>
        <div
          className="relative aspect-4/5 w-full overflow-hidden md:col-span-3 md:aspect-16/10"
          data-reveal
        >
          <Image
            alt="A celebration table set with flowers and shared plates"
            className="scale-110 object-cover parallax-shift"
            data-parallax="0.12"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
            src="/lily-event-table-16x10.png"
          />
        </div>
      </section>

      <section className="bg-dark-green text-pink section-pad">
        <div
          className="mb-16 grid gap-4 parallax-shift md:grid-cols-3 md:gap-16 lg:mb-28 lg:gap-32"
          data-parallax="0.08"
        >
          <p className="eyebrow" data-reveal>
            Gather your way
          </p>
          <h2
            className="max-w-[11ch] font-display text-4xl font-medium md:col-span-2 lg:text-6xl"
            data-reveal
          >
            Made for the shape of your day.
          </h2>
        </div>
        <div className="grid md:grid-cols-3">
          {occasions.map(([number, title, copy]) => (
            <article
              className="border-t border-pink/50 pt-5 not-first:mt-10 md:pr-6 md:not-first:mt-0 md:not-first:border-l md:not-first:pl-6 lg:pr-12 lg:not-first:pl-12"
              data-reveal
              key={number}
            >
              <p className="eyebrow">{number}</p>
              <h3 className="mt-10 mb-4 font-display text-3xl font-medium md:mt-16 lg:mt-20 lg:text-4xl">
                {title}
              </h3>
              <p className="max-w-[32ch]">{copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="grid items-center gap-12 bg-cream text-orange-brown section-pad md:grid-cols-2 md:gap-20 lg:gap-44">
        <div className="relative aspect-4/5 w-full max-w-md overflow-hidden md:max-w-lg" data-reveal>
          <Image
            alt="A seasonal main dish prepared by Lily"
            className="scale-110 object-cover parallax-shift"
            data-parallax="0.14"
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
            src="/lily-seasonal-main-dish-4x5.png"
          />
        </div>
        <div className="flex max-w-2xl flex-col items-start parallax-shift" data-parallax="0.08">
          <p className="eyebrow" data-reveal>
            From our kitchen
          </p>
          <h2
            className="mt-2.5 mb-8 max-w-[10ch] font-display text-4xl font-medium text-burgundy md:mb-12 lg:mb-16 lg:text-6xl"
            data-reveal
          >
            Menus that move with the market.
          </h2>
          <p className="max-w-[54ch]" data-reveal>
            We build each menu around the season, the setting, and how you want your guests to feel.
            Choose from passed bites, family-style tables, or individually composed meals, with
            cocktails and wine available alongside.
          </p>
          <p className="mt-4 max-w-[54ch]" data-reveal>
            Vegetarian and dietary accommodations are happily considered as we shape the menu
            together.
          </p>
          <span className="mt-8" data-reveal>
            <PillLink color="burgundy" href="/contact?reason=events">
              Tell us about your gathering
            </PillLink>
          </span>
        </div>
      </section>

      <section className="bg-burgundy text-pink section-pad">
        <div
          className="flex min-h-[64vh] flex-col items-center justify-center border border-current p-10 text-center parallax-shift md:p-16 lg:p-28"
          data-parallax="0.1"
        >
          <p className="eyebrow" data-reveal>
            Begin with a conversation
          </p>
          <h2
            className="mt-3 mb-6 max-w-[10ch] font-display text-4xl font-medium lg:text-6xl"
            data-reveal
          >
            Bring Lily to the table.
          </h2>
          <p className="mb-8 max-w-[42ch]" data-reveal>
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

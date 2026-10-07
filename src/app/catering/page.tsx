import { Metadata } from "next"
import Image from "next/image"
import { PillLink } from "@/components/pill-button"

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Seasonal menus and polished service from Lily for private and corporate events across Gibsonia.",
}

const occasions = [
  [
    "01",
    "Corporate dining",
    "Refined lunches and client dinners, presented ready to serve and composed for the room.",
  ],
  [
    "02",
    "Private celebrations",
    "Seasonal menus for birthdays, showers, and milestones, prepared with the same care as our dining room.",
  ],
  [
    "03",
    "Full-service events",
    "A tailored menu, a curated bar, and a professional team to guide the evening from arrival to the final pour.",
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
            Seasonal menus, polished service, and the care of Lily's dining room, brought to
            gatherings across Gibsonia.
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
            className="object-cover"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 58vw"
            src="/lily-event-table-16x10.png"
          />
        </div>
      </section>

      <section className="bg-dark-green section-pad text-pink">
        <div className="mb-16 grid gap-4 md:grid-cols-3 md:gap-16 lg:mb-28 lg:gap-32">
          <p className="eyebrow" data-reveal>
            Gather your way
          </p>
          <h2
            className="max-w-[11ch] font-display text-4xl font-medium md:col-span-2 lg:text-6xl"
            data-reveal
          >
            Tailored to the occasion.
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

      <section className="grid items-center gap-12 bg-cream section-pad text-orange-brown md:grid-cols-2 md:gap-20 lg:gap-44">
        <div
          className="relative aspect-4/5 w-full max-w-md overflow-hidden md:max-w-lg"
          data-reveal
        >
          <Image
            alt="A seasonal main dish prepared by Lily"
            className="object-cover"
            fill
            sizes="(max-width: 800px) 100vw, 42vw"
            src="/lily-seasonal-main-dish-4x5.png"
          />
        </div>
        <div className="flex max-w-2xl flex-col items-start">
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
            We build each menu around the season, the setting, and the experience you want for your
            guests. Choose from passed canapes, family-style service, or plated courses, with
            cocktails and wine pairings available.
          </p>
          <p className="mt-4 max-w-[54ch]" data-reveal>
            Vegetarian and dietary requirements are always welcome as we shape the menu together.
          </p>
          <span className="mt-8" data-reveal>
            <PillLink color="burgundy" href="/contact?reason=events">
              Tell us about your gathering
            </PillLink>
          </span>
        </div>
      </section>

      <section className="bg-burgundy section-pad text-pink">
        <div className="flex min-h-[64vh] flex-col items-center justify-center border border-current p-10 text-center md:p-16 lg:p-28">
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
            Share your date, guest count, and a few details about the occasion. Our events team will
            follow up to begin planning.
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

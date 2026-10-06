import { Metadata } from "next"
import { ReactNode } from "react"

export const metadata: Metadata = { title: "Privacy Policy" }

function Section({ children, title }: { children: ReactNode; title: string }) {
  return (
    <section className="border-t border-orange-brown/45 pt-4">
      <h2 className="mb-3 font-display text-2xl font-medium text-burgundy lg:text-3xl">{title}</h2>
      <div className="max-w-[58ch]">{children}</div>
    </section>
  )
}

export default function PrivacyPage() {
  return (
    <article className="mx-auto grid max-w-7xl gap-12 px-page pt-32 pb-20 text-orange-brown md:grid-cols-5 md:gap-20 lg:gap-40 lg:pt-48 lg:pb-36">
      <header className="self-start md:sticky md:top-32 md:col-span-2">
        <p className="eyebrow">Lily Kitchen &amp; Cocktails</p>
        <h1 className="mt-2.5 mb-4 max-w-[8ch] font-display text-5xl font-medium text-burgundy lg:text-6xl">
          Privacy policy
        </h1>
        <p className="text-xs uppercase">Last updated October 4, 2026</p>
      </header>

      <div className="grid gap-10 md:col-span-3">
        <Section title="Information we collect">
          <p>
            When you request a reservation or contact Lily, we may collect your name, telephone
            number, email address, reservation preferences, and any information you choose to share
            with us.
          </p>
        </Section>
        <Section title="How we use it">
          <p>
            We use this information to manage reservations, respond to questions, provide service
            updates, and improve your experience with Lily. We do not sell personal information.
          </p>
        </Section>
        <Section title="Sharing and retention">
          <p>
            We share information only with service providers needed to operate our reservations and
            communications. We retain it only for as long as reasonably necessary for those purposes
            or to meet legal obligations.
          </p>
        </Section>
        <Section title="Your choices">
          <p>
            You may ask to access, correct, or delete your personal information by contacting us at
            <a className="border-b border-current" href="mailto:hello@lilyrestaurant.com"> hello@lilyrestaurant.com</a>.
          </p>
        </Section>
        <Section title="Contact">
          <address className="not-italic">
            Lily Kitchen &amp; Cocktails
            <br />
            214 Smallman Street
            <br />
            Pittsburgh, PA 15222
          </address>
        </Section>
      </div>
    </article>
  )
}

import { Metadata } from "next"

export const metadata: Metadata = { title: "Privacy Policy" }

export default function PrivacyPage() {
  return (
    <article className="privacy-page">
      <header className="privacy-page__header">
        <p className="eyebrow">Lily Kitchen &amp; Cocktails</p>
        <h1>Privacy policy</h1>
        <p>Last updated October 4, 2026</p>
      </header>

      <div className="privacy-page__body">
        <section>
          <h2>Information we collect</h2>
          <p>
            When you request a reservation or contact Lily, we may collect your name, telephone
            number, email address, reservation preferences, and any information you choose to share
            with us.
          </p>
        </section>
        <section>
          <h2>How we use it</h2>
          <p>
            We use this information to manage reservations, respond to questions, provide service
            updates, and improve your experience with Lily. We do not sell personal information.
          </p>
        </section>
        <section>
          <h2>Sharing and retention</h2>
          <p>
            We share information only with service providers needed to operate our reservations and
            communications. We retain it only for as long as reasonably necessary for those purposes
            or to meet legal obligations.
          </p>
        </section>
        <section>
          <h2>Your choices</h2>
          <p>
            You may ask to access, correct, or delete your personal information by contacting us at
            <a href="mailto:hello@lilyrestaurant.com"> hello@lilyrestaurant.com</a>.
          </p>
        </section>
        <section>
          <h2>Contact</h2>
          <address>
            Lily Kitchen &amp; Cocktails
            <br />
            214 Smallman Street
            <br />
            Pittsburgh, PA 15222
          </address>
        </section>
      </div>
    </article>
  )
}

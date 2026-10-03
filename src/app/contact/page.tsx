import { Metadata } from "next"
import Image from "next/image"
import { ReservationForm } from "@/components/reservation-form"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <>
      <div className="contact-page">
        <section className="contact-page__visual">
          <Image
            alt="Lily botanical cocktail"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
            src="/lily-botanical-cocktail-4x5.png"
          />
          <div className="contact-page__visual-copy">
            <p className="eyebrow">Lily · Pittsburgh</p>
            <h1>Reservations</h1>
          </div>
        </section>

        <section className="contact-page__booking">
          <div className="contact-page__intro">
            <p className="eyebrow">Come spend the evening</p>
            <h2>Book your table.</h2>
            <p>
              For groups of nine or more, write to{" "}
              <a href="mailto:events@lilyrestaurant.com">events@lilyrestaurant.com</a>.
            </p>
          </div>
          <ReservationForm />
        </section>
      </div>

      <section className="contact-details-band">
        <p className="eyebrow">Contact Lily</p>
        <div className="contact-details-band__items">
          <a href="mailto:hello@lilyrestaurant.com">hello@lilyrestaurant.com</a>
          <a href="tel:+14125550142">(412) 555-0142</a>
          <address>214 Smallman Street, Pittsburgh, PA 15222</address>
        </div>
      </section>
    </>
  )
}

import Image from "next/image"
import { Metadata } from "next"
import { ReservationForm } from "@/components/reservation-form"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
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
          <p className="eyebrow">Lily · Madrid</p>
          <h1>Reservations</h1>
        </div>
      </section>

      <section className="contact-page__booking">
        <div className="contact-page__intro">
          <p className="eyebrow">Come spend the evening</p>
          <h2>Book your table.</h2>
          <p>For groups of nine or more, write to <a href="mailto:events@lilyrestaurant.com">events@lilyrestaurant.com</a>.</p>
        </div>
        <ReservationForm />
        <div className="contact-page__details">
          <address>14 Garden Row · Madrid, 28004</address>
          <a href="tel:+34915550142">+34 915 550 142</a>
        </div>
      </section>
    </div>
  )
}

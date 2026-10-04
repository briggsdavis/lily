"use client"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { InquiryReason, ReservationForm } from "@/components/reservation-form"

const visualTitles: Record<Exclude<InquiryReason, null>, string> = {
  reservation: "Reservations",
  events: "Event inquiry",
  general: "General inquiry",
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => void
}

export function ContactExperience() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryReason = searchParams.get("reason")
  const inquiryReason: InquiryReason =
    queryReason === "reservation" || queryReason === "events" || queryReason === "general"
      ? queryReason
      : null

  function updateInquiryReason(nextReason: Exclude<InquiryReason, null>) {
    const navigate = () => router.replace(`/contact?reason=${nextReason}`, { scroll: false })
    const transitionDocument = document as ViewTransitionDocument

    if (!transitionDocument.startViewTransition) {
      navigate()
      return
    }

    transitionDocument.startViewTransition(async () => {
      navigate()
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 80)
      })
    })
  }

  const visualTitle = inquiryReason ? visualTitles[inquiryReason] : "Contact Lily"

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
            <h1 className="contact-page__visual-title" key={visualTitle}>
              {visualTitle}
            </h1>
          </div>
        </section>

        <section className="contact-page__booking">
          <ReservationForm
            inquiryReason={inquiryReason}
            onInquiryReasonChange={updateInquiryReason}
          />
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

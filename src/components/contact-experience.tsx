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
      <div className="grid min-h-svh bg-cream text-burgundy md:grid-cols-2">
        <section className="relative min-h-[78svh] overflow-hidden text-cream after:absolute after:inset-x-0 after:top-1/2 after:bottom-0 after:bg-linear-to-b after:from-transparent after:to-zinc-900/70 md:sticky md:top-0 md:h-svh md:min-h-0 md:self-start">
          <Image
            alt="Lily botanical cocktail"
            className="object-cover"
            fill
            priority
            sizes="(max-width: 800px) 100vw, 50vw"
            src="/lily-botanical-cocktail-4x5.png"
          />
          <div className="absolute inset-x-5 bottom-8 z-1 md:inset-x-10 md:bottom-12 lg:inset-x-16 lg:bottom-20">
            <p className="eyebrow">Lily · Gibsonia</p>
            <h1
              className="mt-2 animate-inquiry-title font-display text-5xl font-medium [view-transition-name:inquiry-visual-title] lg:text-7xl"
              key={visualTitle}
            >
              {visualTitle}
            </h1>
          </div>
        </section>

        <section className="flex flex-col justify-center px-6 pt-20 pb-8 md:min-h-svh md:px-10 md:pt-24 lg:px-16">
          <ReservationForm
            inquiryReason={inquiryReason}
            onInquiryReasonChange={updateInquiryReason}
          />
        </section>
      </div>

      <section className="grid items-start gap-6 border-t border-orange-brown/45 bg-cream px-page py-9 text-orange-brown md:grid-cols-3 md:gap-16 md:py-14 lg:gap-32 lg:py-18">
        <p className="eyebrow">Contact Lily</p>
        <div className="grid gap-4 text-sm md:col-span-2 md:grid-cols-3 md:gap-8 lg:gap-12">
          <a
            className="w-max max-w-full border-b border-current"
            href="mailto:hello@lilyrestaurant.com"
          >
            hello@lilyrestaurant.com
          </a>
          <a className="w-max max-w-full border-b border-current" href="tel:+17245024572">
            (724) 502-4572
          </a>
          <address className="text-xs whitespace-nowrap not-italic sm:text-sm">
            500 Grandview Crossing Dr, Gibsonia, PA 15044
          </address>
        </div>
      </section>
    </>
  )
}

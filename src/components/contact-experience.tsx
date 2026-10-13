"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useMemo } from "react"
import { LayeredMedia } from "@/components/layered-media"
import { InquiryReason, ReservationForm } from "@/components/reservation-form"

const visualTitles: Record<Exclude<InquiryReason, null>, string> = {
  reservation: "Reservations",
  events: "Event inquiry",
  general: "General inquiry",
}

const inquiryVisuals = [
  {
    alt: "A dimly lit restaurant dining room with tables and chairs",
    src: "/contact-reservation-unsplash.jpg",
  },
  {
    alt: "A candlelit restaurant table set with plates for dinner",
    src: "/contact-events-unsplash.jpg",
  },
  {
    alt: "A cocktail with an orange garnish on a dark bar counter",
    foregroundImageClassName: "object-[72%_center]",
    src: "/contact-cocktail-unsplash.jpg",
  },
] as const

const visualIndex: Record<Exclude<InquiryReason, null>, number> = {
  reservation: 0,
  events: 1,
  general: 2,
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

  const updateInquiryReason = useCallback(
    (nextReason: Exclude<InquiryReason, null>) => {
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
    },
    [router],
  )

  const visualTitle = inquiryReason ? visualTitles[inquiryReason] : "Contact Lily"
  const activeVisual = inquiryReason ? visualIndex[inquiryReason] : visualIndex.general
  const caption = useMemo(
    () => (
      <div key={visualTitle}>
        <p className="eyebrow">Lily · Gibsonia</p>
        <h1 className="mt-1 font-display text-3xl font-medium md:text-4xl lg:text-5xl">
          {visualTitle}
        </h1>
      </div>
    ),
    [visualTitle],
  )

  return (
    <>
      <div className="grid min-h-svh bg-cream text-burgundy md:grid-cols-2">
        <section
          className="relative min-h-[78svh] overflow-hidden bg-burgundy text-cream md:sticky md:top-0 md:h-svh md:min-h-0 md:self-start"
          data-nav-tone="image"
        >
          <LayeredMedia
            active={activeVisual}
            backgroundBlurClassName="blur-[9px]"
            backgroundSizes="(max-width: 800px) 100vw, 50vw"
            backgroundTransitionClassName="duration-[1600ms] ease-in-out"
            caption={caption}
            className="absolute inset-0"
            foregroundAspectClassName="aspect-4/5"
            foregroundClassName="w-[43.5%] max-w-sm"
            foregroundPositionClassName="left-6 md:left-10 lg:left-16"
            foregroundSizes="(max-width: 800px) 58vw, 29vw"
            foregroundTransitionDelayClassName="delay-[700ms]"
            items={inquiryVisuals}
            priority
          />
        </section>

        <section
          className="flex flex-col justify-center bg-dark-maroon px-6 pt-20 pb-8 text-warm-white md:min-h-svh md:px-10 md:pt-24 lg:px-16"
          data-nav-tone="dark"
        >
          <ReservationForm
            inquiryReason={inquiryReason}
            onInquiryReasonChange={updateInquiryReason}
          />
        </section>
      </div>
    </>
  )
}

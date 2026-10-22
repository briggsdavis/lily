"use client"
import { useMutation } from "convex/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react"
import { flushSync } from "react-dom"
import { LayeredMedia } from "@/components/layered-media"
import { usePageMedia } from "@/components/page-media"
import { InquiryReason, ReservationForm } from "@/components/reservation-form"
import { RotatingCrest } from "@/components/rotating-crest"
import { submitContactRef } from "@/lib/admin-api"

const visualTitles: Record<Exclude<InquiryReason, null>, string> = {
  reservation: "Reservation",
  events: "Event",
  general: "Inquiry",
}

const defaultinquiryVisuals = [
  {
    alt: "A dimly lit restaurant dining room with tables and chairs",
    src: "/images/contact-reservation-unsplash.jpg",
  },
  {
    alt: "A candlelit restaurant table set with plates for dinner",
    src: "/images/contact-events-unsplash.jpg",
  },
  {
    alt: "A cocktail with an orange garnish on a dark bar counter",
    foregroundImageClassName: "object-[72%_center]",
    src: "/images/contact-cocktail-unsplash.jpg",
  },
] as const

const visualIndex: Record<Exclude<InquiryReason, null>, number> = {
  reservation: 0,
  events: 1,
  general: 2,
}

const indexReasons = Object.fromEntries(
  Object.entries(visualIndex).map(([reason, index]) => [index, reason]),
) as Record<number, Exclude<InquiryReason, null>>

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => Promise<void> | void) => void
}

type SubmitContact = Parameters<typeof ReservationForm>[0]["onSubmitInquiry"]

// Vertical title, reading bottom to top, sized so its length matches the image height.
function VerticalTitle({ children }: { children: string }) {
  const boxRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)

  useLayoutEffect(() => {
    const box = boxRef.current
    const title = titleRef.current
    if (!box || !title) return

    // The title is absolutely positioned so it never stretches the row while measuring;
    // the box then takes the fitted title's width.
    const fit = () => {
      title.style.fontSize = "100px"
      const length = title.getBoundingClientRect().height
      if (!length) return
      title.style.fontSize = `${(100 * box.clientHeight) / length}px`
      box.style.width = `${title.getBoundingClientRect().width}px`
    }
    const observer = new ResizeObserver(fit)
    observer.observe(box)
    fit()
    void document.fonts?.ready.then(fit)
    return () => observer.disconnect()
  }, [children])

  return (
    <div className="relative h-full" ref={boxRef}>
      <h1
        className="absolute top-0 right-0 rotate-180 font-header-stencil leading-none whitespace-nowrap [writing-mode:vertical-rl]"
        ref={titleRef}
      >
        {children}
      </h1>
    </div>
  )
}

export function ContactExperience({ onSubmitInquiry }: { onSubmitInquiry?: SubmitContact } = {}) {
  const savedMedia = usePageMedia()
  const inquiryVisuals = defaultinquiryVisuals.map((item, index) => ({
    ...item,
    src:
      savedMedia?.find(
        (media) =>
          media.key === ["contact.reservation", "contact.events", "contact.general"][index],
      )?.url ?? item.src,
  }))
  const router = useRouter()
  const searchParams = useSearchParams()
  const queryReason = searchParams.get("reason")
  const inquiryReason: InquiryReason =
    queryReason === "reservation" || queryReason === "events" || queryReason === "general"
      ? queryReason
      : null

  const formSectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  // Centered on load. Once the reason changes, the form's top is pinned so it only grows or
  // shrinks from the bottom. Resizing the window re-centers it.
  const [pinnedTop, setPinnedTop] = useState<number | null>(null)

  useEffect(() => {
    const release = () => setPinnedTop(null)
    window.addEventListener("resize", release)
    return () => window.removeEventListener("resize", release)
  }, [])

  const pinFormTop = useCallback(() => {
    const section = formSectionRef.current
    const form = formRef.current
    if (!section || !form || pinnedTop !== null) return
    const paddingTop = Number.parseFloat(window.getComputedStyle(section).paddingTop)
    const top = form.getBoundingClientRect().top - section.getBoundingClientRect().top - paddingTop
    flushSync(() => setPinnedTop(Math.max(0, top)))
  }, [pinnedTop])

  const updateInquiryReason = useCallback(
    (nextReason: Exclude<InquiryReason, null>) => {
      pinFormTop()
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
    [pinFormTop, router],
  )

  const visualTitle = inquiryReason ? visualTitles[inquiryReason] : "Contact Lily"
  const activeVisual = inquiryReason ? visualIndex[inquiryReason] : visualIndex.general
  // Each photo gets its own fitted title, so switching crossfades instead of resizing.
  const caption = useCallback(
    (index: number) => (
      <VerticalTitle>
        {inquiryReason || index !== activeVisual ? visualTitles[indexReasons[index]] : visualTitle}
      </VerticalTitle>
    ),
    [activeVisual, inquiryReason, visualTitle],
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
            captionPlacement="beside"
            className="absolute inset-0"
            foregroundAspectClassName="aspect-4/5"
            foregroundClassName="w-[43.5vw] max-w-sm md:w-[21.75vw]"
            foregroundHiddenClipClassName="[clip-path:inset(0_0_0_100%)]"
            foregroundPositionClassName="left-1/2 -translate-x-1/2"
            foregroundSizes="(max-width: 800px) 58vw, 29vw"
            items={inquiryVisuals}
            priority
          />
        </section>

        <section
          className={`relative isolate flex flex-col overflow-hidden bg-dark-maroon px-6 pt-20 pb-8 text-warm-white md:min-h-svh md:px-10 md:pt-24 lg:px-16 ${
            pinnedTop === null ? "justify-center" : "justify-start"
          }`}
          data-nav-tone="dark"
          ref={formSectionRef}
        >
          <RotatingCrest className="pointer-events-none absolute top-1/2 right-[-8%] h-auto w-[min(48vw,38rem)] -translate-y-1/2 opacity-50" />
          <div
            className="relative z-10"
            ref={formRef}
            style={pinnedTop === null ? undefined : { marginTop: pinnedTop }}
          >
            <ReservationForm
              inquiryReason={inquiryReason}
              onInquiryReasonChange={updateInquiryReason}
              onSubmitInquiry={onSubmitInquiry}
            />
          </div>
        </section>
      </div>
    </>
  )
}

export function ConnectedContactExperience() {
  const submit = useMutation(submitContactRef)
  return <ContactExperience onSubmitInquiry={submit} />
}

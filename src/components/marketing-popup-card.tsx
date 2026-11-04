"use client"
import { XIcon } from "@phosphor-icons/react"
import Image from "next/image"
import type { ReactNode } from "react"
import { PillLink } from "@/components/pill-button"
export type PopupContent = {
  title: string
  body: string
  layout: "top" | "left" | "right" | "none"
  imageAlt: string
  imageUrl?: string | null
  buttonText: string
  buttonLink: string
  captureEmail: boolean
}
export function MarketingPopupCard({
  popup,
  children,
  onClose,
  titleId,
}: {
  popup: PopupContent
  children?: ReactNode
  onClose?: () => void
  titleId?: string
}) {
  const side = popup.layout === "left" || popup.layout === "right"
  return (
    <article
      className={`relative w-full overflow-hidden bg-wine text-cream shadow-2xl ${side ? "md:grid md:grid-cols-2" : ""}`}
    >
      {popup.layout !== "none" && (
        <div
          className={`relative min-h-48 bg-cream/10 ${side ? "md:min-h-96" : "h-52 md:h-64"} ${popup.layout === "right" ? "md:order-2" : ""}`}
        >
          {popup.imageUrl && (
            <Image
              src={popup.imageUrl}
              alt={popup.imageAlt || popup.title}
              fill
              sizes="(max-width: 768px) 92vw, 400px"
              className="object-cover"
            />
          )}
        </div>
      )}
      <div className="flex min-w-0 flex-col justify-center gap-5 px-6 py-14 [overflow-wrap:anywhere] md:px-10 md:py-16">
        <h2 id={titleId} className="pr-5 font-display text-3xl leading-tight md:text-4xl">
          {popup.title || "Your title"}
        </h2>
        <p className="text-sm leading-7 whitespace-pre-line text-cream/90">
          {popup.body || "Your message will appear here."}
        </p>
        {popup.buttonText && popup.buttonLink && (
          <div>
            <PillLink color="wineCream" href={popup.buttonLink} onNavigate={onClose}>
              {popup.buttonText}
            </PillLink>
          </div>
        )}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          aria-label="Close pop-up"
          onClick={onClose}
          className="absolute top-3 right-3 z-10 grid size-11 cursor-pointer place-items-center rounded-full border-0 bg-cream bg-none! p-0 text-wine shadow-none transition-colors duration-200 outline-none hover:bg-wine hover:text-cream motion-reduce:transition-none"
        >
          <XIcon aria-hidden="true" className="block size-5 shrink-0" />
        </button>
      )}
    </article>
  )
}

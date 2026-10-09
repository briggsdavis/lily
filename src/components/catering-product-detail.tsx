"use client"

import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { useCallback, useMemo, useState } from "react"
import type { ChangeEvent } from "react"
import { PillButton } from "@/components/pill-button"
import { TransitionLink } from "@/components/transition-link"
import { formatCateringPrice } from "@/data/catering-products"
import type { CateringProduct } from "@/data/catering-products"

const allowedReturnParameters = ["category", "min", "max", "sort"] as const

export function CateringProductDetail({ product }: { product: CateringProduct }) {
  const searchParams = useSearchParams()
  const [selectedPortion, setSelectedPortion] = useState("")
  const [added, setAdded] = useState(false)

  const backHref = useMemo(() => {
    const requestedReturn = new URLSearchParams(searchParams.get("return") ?? "")
    const safeReturn = new URLSearchParams()
    allowedReturnParameters.forEach((key) => {
      const value = requestedReturn.get(key)
      if (value) safeReturn.set(key, value)
    })
    const query = safeReturn.toString()
    return `/catering${query ? `?${query}` : ""}`
  }, [searchParams])

  const chosenPortion = product.portions.find((portion) => portion.label === selectedPortion)
  const displayedPrice = chosenPortion?.priceCents ?? product.portions[0].priceCents
  const changePortion = useCallback((event: ChangeEvent<HTMLSelectElement>) => {
    setSelectedPortion(event.currentTarget.value)
    setAdded(false)
  }, [])
  const addPreviewItem = useCallback(() => setAdded(true), [])

  return (
    <section
      className="min-h-svh bg-events-gray px-page pt-32 pb-64 text-cream md:pt-40 lg:pt-44 lg:pb-80"
      data-nav-tone="dark"
    >
      <TransitionLink
        className="animated-underline inline-flex items-center gap-2 text-xs font-bold tracking-[0.08em] text-cream/70 uppercase"
        href={backHref}
      >
        <span aria-hidden="true">←</span> Back to catering
      </TransitionLink>

      <div className="mt-8 grid gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(24rem,0.95fr)] lg:items-start lg:gap-16 xl:gap-24">
        <div>
          <div className="lg:sticky lg:top-32">
            <div className="relative aspect-square overflow-hidden bg-zinc-950/15">
              <Image
                alt={product.imageAlt}
                className="object-cover"
                fill
                loading="eager"
                sizes="(max-width: 1024px) calc(100vw - 2.5rem), 52vw"
                src={product.image}
              />
            </div>
          </div>
          <p className="mt-3 text-xs text-cream/45">
            Photo by{" "}
            <a
              className="animated-underline"
              href={`${product.photo.profileUrl}?utm_source=lily&utm_medium=referral`}
              rel="noopener noreferrer"
              target="_blank"
            >
              {product.photo.photographer}
            </a>{" "}
            on{" "}
            <a
              className="animated-underline"
              href={`${product.photo.sourceUrl}?utm_source=lily&utm_medium=referral`}
              rel="noopener noreferrer"
              target="_blank"
            >
              Unsplash
            </a>
          </p>
        </div>

        <div className="lg:pt-8">
          <h1 className="max-w-full text-left font-display text-[clamp(1.5rem,4vw,3rem)] leading-none whitespace-nowrap text-pink">
            {product.name}
          </h1>
          <p className="mt-7 font-display text-3xl text-cream">
            {chosenPortion
              ? formatCateringPrice(displayedPrice)
              : `From ${formatCateringPrice(displayedPrice)}`}
          </p>
          <p className="mt-7 w-full text-base leading-7 text-cream/70">{product.description}</p>

          <div className="mt-10 border-y border-cream/30 py-6">
            <p className="eyebrow text-pink/70">Portion guide</p>
            <div className="mt-4 grid gap-2 text-sm text-cream/65 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {product.portions.map((portion) => (
                <div key={portion.label}>
                  <p className="font-semibold text-cream">{portion.label}</p>
                  <p>{portion.serves}</p>
                </div>
              ))}
            </div>
          </div>

          <label className="mt-9 grid gap-3 text-sm font-semibold" htmlFor="portion-size">
            Portion size
            <span className="relative block">
              <select
                className="min-h-12 w-full cursor-pointer appearance-none rounded-full border border-cream/55 bg-transparent py-2 pr-14 pl-5 text-cream outline-none focus-visible:border-pink focus-visible:ring-2 focus-visible:ring-pink/40"
                id="portion-size"
                onChange={changePortion}
                value={selectedPortion}
              >
                <option className="bg-events-gray text-cream" value="">
                  Select a portion
                </option>
                {product.portions.map((portion) => (
                  <option
                    className="bg-events-gray text-cream"
                    key={portion.label}
                    value={portion.label}
                  >
                    {portion.label} · {portion.serves} · {formatCateringPrice(portion.priceCents)}
                  </option>
                ))}
              </select>
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 right-6 size-4 -translate-y-1/2 text-cream"
                fill="none"
                viewBox="0 0 16 16"
              >
                <path d="m3 6 5 5 5-5" stroke="currentColor" strokeWidth="1.5" />
              </svg>
            </span>
          </label>

          <PillButton
            className="mt-6 w-full"
            color="cream"
            disabled={!chosenPortion}
            onClick={addPreviewItem}
          >
            {added ? "Added for preview" : "Add to cart"}
          </PillButton>
          <p aria-live="polite" className="mt-3 min-h-5 text-center text-xs text-cream/55">
            {added ? "Preview only — checkout will be connected later." : ""}
          </p>
        </div>
      </div>
    </section>
  )
}

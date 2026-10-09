import { Metadata } from "next"
import { Suspense } from "react"
import { CateringCatalog } from "@/components/catering-catalog"
import { CateringHero } from "@/components/catering-hero"

export const metadata: Metadata = {
  title: "Catering",
  description:
    "Browse Lily's seasonal catering menu of passed bites, generous platters, entrées, salads, and desserts.",
}

function CatalogFallback() {
  return (
    <div className="mt-16 min-h-[60vh] py-12 text-sm text-cream/60">
      Preparing the catering menu…
    </div>
  )
}

const catalogFallback = <CatalogFallback />

export default function CateringPage() {
  return (
    <div className="bg-events-gray">
      <CateringHero />
      <section
        className="min-h-svh bg-events-gray px-page pt-px pb-64 text-cream lg:pb-80"
        data-nav-tone="dark"
      >
        <Suspense fallback={catalogFallback}>
          <CateringCatalog />
        </Suspense>
      </section>
    </div>
  )
}

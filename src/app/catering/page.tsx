import type { Metadata } from "next"
import { CateringHero } from "@/components/catering-hero"
import { CateringInquiryForm } from "@/components/catering-inquiry-form"
import { ConnectedCateringForm } from "@/components/connected-catering-form"
import { requirePageEnabled } from "@/lib/page-gate"

export const metadata: Metadata = {
  title: "Catering",
  description: "Plan a catered gathering with Lily in Gibsonia.",
}

export const revalidate = 60

export default async function CateringPage() {
  await requirePageEnabled("/catering")
  return (
    <div className="bg-grey">
      <CateringHero />
      {process.env.NEXT_PUBLIC_CONVEX_URL ? <ConnectedCateringForm /> : <CateringInquiryForm />}
    </div>
  )
}

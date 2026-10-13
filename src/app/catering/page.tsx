import type { Metadata } from "next"
import { CateringHero } from "@/components/catering-hero"
import { CateringInquiryForm } from "@/components/catering-inquiry-form"

export const metadata: Metadata = {
  title: "Catering",
  description: "Plan a catered gathering with Lily in Gibsonia.",
}

export default function CateringPage() {
  return (
    <div className="bg-espresso">
      <CateringHero />
      <CateringInquiryForm />
    </div>
  )
}

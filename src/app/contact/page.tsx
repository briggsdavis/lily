import { Metadata } from "next"
import { Suspense } from "react"
import { ConnectedContactExperience, ContactExperience } from "@/components/contact-experience"
import { requirePageEnabled } from "@/lib/page-gate"

export const metadata: Metadata = { title: "Contact" }

export const revalidate = 60

export default async function ContactPage() {
  await requirePageEnabled("/contact")
  return (
    <Suspense>
      {process.env.NEXT_PUBLIC_CONVEX_URL ? <ConnectedContactExperience /> : <ContactExperience />}
    </Suspense>
  )
}

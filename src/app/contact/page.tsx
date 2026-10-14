import { Metadata } from "next"
import { Suspense } from "react"
import { ConnectedContactExperience, ContactExperience } from "@/components/contact-experience"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <Suspense>
      {process.env.NEXT_PUBLIC_CONVEX_URL ? <ConnectedContactExperience /> : <ContactExperience />}
    </Suspense>
  )
}

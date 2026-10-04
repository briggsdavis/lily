import { Metadata } from "next"
import { Suspense } from "react"
import { ContactExperience } from "@/components/contact-experience"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <Suspense>
      <ContactExperience />
    </Suspense>
  )
}

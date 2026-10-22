import type { Metadata } from "next"
import { AboutContent } from "@/components/about-content"
import { PublishedPage } from "@/components/page-content"
export const metadata: Metadata = {
  title: "About",
  description:
    "Lily carries on 25 years of dining at 500 Grandview Crossing in Gibsonia, with the same warm team and a seasonal kitchen.",
}

export default function AboutPage() {
  return (
    <PublishedPage page="about">
      <AboutContent />
    </PublishedPage>
  )
}

import type { Metadata } from "next"
import { AboutEvening } from "@/components/about-evening"
import { AboutHero } from "@/components/about-hero"
import { AboutMarquee } from "@/components/about-marquee"
import { AboutPeople } from "@/components/about-people"
import { AboutTimeline } from "@/components/about-timeline"

export const metadata: Metadata = {
  title: "About",
  description:
    "Lily carries on 25 years of dining at 500 Grandview Crossing in Gibsonia, with the same warm team and a seasonal kitchen.",
}

export default function AboutPage() {
  return (
    <div>
      <AboutHero />

      <AboutTimeline />

      <AboutMarquee />

      <section className="bg-dark-maroon text-warm-white" data-nav-tone="dark">
        <AboutPeople />
      </section>

      <AboutEvening />
    </div>
  )
}

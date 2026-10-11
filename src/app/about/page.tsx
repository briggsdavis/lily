import { Metadata } from "next"
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

      <section className="bg-taupe px-page py-14 text-warm-white md:py-20" data-nav-tone="dark">
        <h2
          className="mb-10 font-display text-4xl font-medium text-blush md:mb-14 lg:text-6xl"
          data-reveal
        >
          The hands behind it.
        </h2>
        <AboutPeople />
      </section>

      <AboutEvening />
    </div>
  )
}

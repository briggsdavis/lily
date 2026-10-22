"use client"
import { AboutEvening } from "@/components/about-evening"
import { AboutHero } from "@/components/about-hero"
import { AboutMarquee } from "@/components/about-marquee"
import { AboutPeople } from "@/components/about-people"
import { AboutTimeline } from "@/components/about-timeline"
import { ColorSection } from "@/components/page-content"

export function AboutContent() {
  return (
    <div>
      <AboutHero />

      <AboutTimeline />

      <AboutMarquee />

      <ColorSection
        field="about.people.color"
        className="bg-dark-maroon text-warm-white"
        data-nav-tone="dark"
      >
        <AboutPeople />
      </ColorSection>

      <AboutEvening />
    </div>
  )
}

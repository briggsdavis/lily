"use client"
import { AboutEvening } from "@/components/about-evening"
import { AboutHero } from "@/components/about-hero"
import { AboutMarquee } from "@/components/about-marquee"
import { AboutPeople } from "@/components/about-people"
import { AboutTimeline } from "@/components/about-timeline"
import { ColorSection, usePageContent } from "@/components/page-content"

export function AboutContent() {
  const content = usePageContent()
  const timelineVisible = content?.fields["about.timeline.visible"] !== "false"
  return (
    <div>
      <AboutHero />

      {(content?.editing || timelineVisible) && <AboutTimeline />}

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

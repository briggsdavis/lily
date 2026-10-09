import { Metadata } from "next"
import { EventsExperience } from "@/components/events-experience"
import { EventsHero } from "@/components/events-hero"

export const metadata: Metadata = {
  title: "Events",
  description:
    "Discover seasonal suppers, wine dinners, cocktail evenings, and private gatherings at Lily in Gibsonia.",
}

export default function EventsPage() {
  return (
    <div className="bg-events-gray">
      <EventsHero />
      <EventsExperience />
    </div>
  )
}

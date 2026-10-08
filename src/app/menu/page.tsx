import { Metadata } from "next"
import { MenuGallery } from "@/components/menu-gallery"

export const metadata: Metadata = {
  title: "Menu",
  description:
    "Explore Lily's seasonal menu of considered plates, handmade pasta, market vegetables, desserts, and garden-led cocktails.",
}

export default function MenuPage() {
  return (
    <section
      className="min-h-svh bg-dark-green px-page pt-32 pb-16 text-pink md:pt-40 md:pb-20 lg:pt-48 lg:pb-24"
      data-nav-tone="dark"
    >
      <div className="mb-10 grid items-start gap-8 md:mb-14 md:grid-cols-3 md:gap-8 lg:mb-16 lg:gap-16">
        <div>
          <p className="mb-3 eyebrow text-pink/70" data-reveal>
            The menu
          </p>
          <h1
            className="max-w-[10ch] font-display text-5xl leading-none font-medium reveal-delay-120 md:text-6xl lg:text-7xl"
            data-reveal
          >
            A menu led by the season.
          </h1>
        </div>
        <p className="max-w-[34ch] leading-7 reveal-delay-240 md:pt-8" data-reveal>
          We begin with what is best now: market vegetables, carefully sourced fish and meat, and
          handmade pasta shaped with a light touch.
        </p>
        <p className="max-w-[34ch] leading-7 reveal-delay-360 md:pt-8" data-reveal>
          The menu is composed for the table, from bright first plates through generous mains,
          floral desserts, and cocktails designed to sit beautifully beside dinner.
        </p>
      </div>

      <MenuGallery />
    </section>
  )
}

import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="grid items-end gap-12 bg-burgundy px-page pt-16 pb-6 text-cream md:grid-cols-[1fr_auto] md:gap-20 md:pt-20 lg:gap-32 lg:pt-28">
      <div className="flex flex-col items-start gap-6 md:flex-row md:items-center lg:gap-12">
        <Image
          alt="Lily Kitchen and Cocktails"
          className="h-auto w-24 lg:w-32"
          height={882}
          src="/beige-primary-logo.png"
          width={890}
        />
        <p className="max-w-[28ch] font-display text-xl text-pink lg:text-2xl">
          Seasonal plates, garden drinks, and evenings with room to unfold.
        </p>
      </div>
      <nav aria-label="Footer" className="grid gap-3 text-sm font-bold uppercase">
        <TransitionLink href="/menu">Menu</TransitionLink>
        <TransitionLink href="/events">Events</TransitionLink>
        <TransitionLink href="/catering">Catering</TransitionLink>
        <TransitionLink href="/about">About</TransitionLink>
        <TransitionLink href="/contact?reason=reservation">Reservations</TransitionLink>
      </nav>
      <div className="col-span-full flex flex-col items-start gap-4 border-t border-pink/40 pt-4 text-xs uppercase sm:flex-row sm:justify-between">
        <div className="flex flex-wrap items-center gap-5">
          <p>© {year} Lily</p>
          <TransitionLink className="animated-underline" href="/privacy">
            Privacy policy
          </TransitionLink>
        </div>
        <a
          className="animated-underline"
          href="https://socialsatisfaction.agency"
          rel="noopener noreferrer"
          target="_blank"
        >
          Made by Social Satisfaction
        </a>
      </div>
    </footer>
  )
}

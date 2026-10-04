import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"

const year = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer__brand parallax-shift" data-parallax="0.15">
        <Image
          alt="Lily Kitchen and Cocktails"
          height={882}
          src="/beigeprimarylogo.png"
          width={890}
        />
        <p>Seasonal plates, garden drinks, and evenings with room to unfold.</p>
      </div>
      <nav aria-label="Footer" className="parallax-shift" data-parallax="0.1">
        <TransitionLink href="/menu">Menu</TransitionLink>
        <TransitionLink href="/events">Events</TransitionLink>
        <TransitionLink href="/about">About</TransitionLink>
        <TransitionLink href="/contact?reason=reservation">Reservations</TransitionLink>
      </nav>
      <div className="site-footer__meta">
        <div className="site-footer__legal">
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

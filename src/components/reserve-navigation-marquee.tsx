import Image from "next/image"
import { TransitionLink } from "@/components/transition-link"

const marqueeRoutes = [
  { href: "/", label: "Home" },
  { href: "/contact", label: "Contact" },
  { href: "/about", label: "About" },
  { href: "/catering", label: "Catering" },
  { href: "/events", label: "Events" },
  { href: "/menu", label: "Menu" },
] as const

function MarqueeGroup({ copy = false }: { copy?: boolean }) {
  return (
    <div
      aria-hidden={copy || undefined}
      className={`reserve-navigation-group flex shrink-0 items-center gap-[0.22em] pr-[0.22em] ${copy ? "reserve-navigation-copy" : ""}`}
    >
      {marqueeRoutes.map((route) => (
        <div className="flex shrink-0 items-center gap-[0.22em]" key={route.href}>
          <TransitionLink
            aria-hidden={copy || undefined}
            className="cursor-pointer font-display leading-[0.78] font-medium uppercase transition-opacity duration-300 ease-out hover:opacity-75 focus-visible:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-[0.08em] focus-visible:outline-current"
            href={route.href}
            tabIndex={copy ? -1 : undefined}
          >
            {route.label}
          </TransitionLink>
          <Image
            alt=""
            aria-hidden="true"
            className="size-[0.72em] shrink-0 object-contain"
            height={1254}
            sizes="12vw"
            src="/Social Work.png"
            width={1254}
          />
        </div>
      ))}
    </div>
  )
}

export function ReserveNavigationMarquee() {
  return (
    <nav
      aria-label="Explore Lily"
      className="relative z-10 -mx-5 overflow-hidden py-5 text-[16vw] text-cream md:-mx-10 md:py-7 lg:-mx-16"
    >
      <div className="reserve-navigation-track flex w-max items-center motion-reduce:w-auto">
        <MarqueeGroup />
        <MarqueeGroup copy />
      </div>
    </nav>
  )
}

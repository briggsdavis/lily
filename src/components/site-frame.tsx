"use client"

import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { Footer } from "@/components/footer"
import { HeroIntroController } from "@/components/hero-intro-controller"
import { ConnectedNavbar, Navbar } from "@/components/navbar"
import { PageTransition } from "@/components/page-transition"
import { ReserveCta } from "@/components/reserve-cta"
import { ScrollEffects } from "@/components/scroll-effects"
import { SiteBackground } from "@/components/site-background"
import { SmoothScroll } from "@/components/smooth-scroll"

export function SiteFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  if (pathname.startsWith("/admin"))
    return <div className="min-h-dvh bg-cream text-deep-brown">{children}</div>

  return (
    <SiteBackground>
      <HeroIntroController />
      <PageTransition />
      <SmoothScroll />
      <ScrollEffects />
      {process.env.NEXT_PUBLIC_CONVEX_URL ? <ConnectedNavbar /> : <Navbar />}
      <main className="relative z-10 min-h-svh grow bg-inherit">{children}</main>
      <ReserveCta />
      <Footer />
    </SiteBackground>
  )
}

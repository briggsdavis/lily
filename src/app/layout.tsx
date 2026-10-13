import type { Metadata } from "next"
import { EB_Garamond, Noto_Sans } from "next/font/google"
import { Footer } from "@/components/footer"
import { HeroIntroController } from "@/components/hero-intro-controller"
import { Navbar } from "@/components/navbar"
import { ReserveCta } from "@/components/reserve-cta"
import { ScrollEffects } from "@/components/scroll-effects"
import { SiteBackground } from "@/components/site-background"
import { SmoothScroll } from "@/components/smooth-scroll"
// oxlint-disable-next-line import/no-unassigned-import
import "lenis/dist/lenis.css"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const display = EB_Garamond({ variable: "--font-display-source", subsets: ["latin"] })
const body = Noto_Sans({ variable: "--font-body-source", subsets: ["latin"] })
const heroIntroScript = {
  __html: `try{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("lily:hero-intro-seen")){document.documentElement.classList.add("hero-intro-pending")}}catch{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("hero-intro-pending")}}`,
}

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s • Lily" },
  description:
    "Lily is an intimate dining room and cocktail bar in Gibsonia, serving seasonal cooking and considered cocktails with polished service.",
}

export default function Layout({ children }: LayoutProps<"/">) {
  const document = (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} bg-cream`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={heroIntroScript} />
      </head>
      <body className="flex min-h-dvh flex-col font-body antialiased">
        <SiteBackground>
          <HeroIntroController />
          <SmoothScroll />
          <ScrollEffects />
          <Navbar />
          <main className="relative z-10 min-h-svh grow bg-inherit transition duration-320 route-leaving:opacity-35 route-leaving:blur-lg">
            {children}
          </main>
          <ReserveCta />
          <Footer />
        </SiteBackground>
      </body>
    </html>
  )

  return document
}

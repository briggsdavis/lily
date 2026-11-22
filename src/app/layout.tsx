import type { Metadata } from "next"
import localFont from "next/font/local"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { SiteFrame } from "@/components/site-frame"
// oxlint-disable-next-line import/no-unassigned-import
import "lenis/dist/lenis.css"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const masqualeroDemiBold = localFont({
  src: "../../public/fonts/subhead/fonnts.com-Masqualero-Demi-Bold.otf",
  variable: "--font-masqualero-demibold",
  weight: "600",
  style: "normal",
  display: "swap",
  preload: true,
})

const heroIntroScript = {
  __html: `try{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("lily:hero-intro-seen")){document.documentElement.classList.add("hero-intro-pending")}}catch{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("hero-intro-pending")}}`,
}

export const metadata: Metadata = {
  metadataBase: new URL("https://lilykitchenandcocktails.com"),
  title: { default: "Lily", template: "%s • Lily" },
  description:
    "Lily is an intimate dining room and cocktail bar in Gibsonia, serving seasonal cooking and considered cocktails with polished service.",
}

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${masqualeroDemiBold.variable} bg-cream`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={heroIntroScript} />
      </head>
      <body className="flex min-h-dvh flex-col font-body antialiased">
        <ConvexClientProvider>
          {process.env.NEXT_PUBLIC_CONVEX_URL ? <AnalyticsTracker /> : null}
          <SiteFrame>{children}</SiteFrame>
        </ConvexClientProvider>
      </body>
    </html>
  )
}

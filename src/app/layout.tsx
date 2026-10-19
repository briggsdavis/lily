import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import type { Metadata } from "next"
import { EB_Garamond } from "next/font/google"
import { AnalyticsTracker } from "@/components/analytics-tracker"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { SiteFrame } from "@/components/site-frame"
// oxlint-disable-next-line import/no-unassigned-import
import "lenis/dist/lenis.css"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const display = EB_Garamond({ variable: "--font-display-source", subsets: ["latin"] })
const heroIntroScript = {
  __html: `try{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&!sessionStorage.getItem("lily:hero-intro-seen")){document.documentElement.classList.add("hero-intro-pending")}}catch{if(location.pathname==="/"&&!matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("hero-intro-pending")}}`,
}

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s • Lily" },
  description:
    "Lily is an intimate dining room and cocktail bar in Gibsonia, serving seasonal cooking and considered cocktails with polished service.",
}

export default async function Layout({ children }: LayoutProps<"/">) {
  const document = (
    <html lang="en" className={`${display.variable} bg-cream`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={heroIntroScript} />
      </head>
      <body className="flex min-h-dvh flex-col font-body antialiased">
        <ConvexAuthNextjsServerProvider>
          <ConvexClientProvider>
            {process.env.NEXT_PUBLIC_CONVEX_URL ? <AnalyticsTracker /> : null}
            <SiteFrame>{children}</SiteFrame>
          </ConvexClientProvider>
        </ConvexAuthNextjsServerProvider>
      </body>
    </html>
  )

  return document
}

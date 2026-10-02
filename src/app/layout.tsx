import { ConvexAuthNextjsServerProvider as ConvexAuth } from "@convex-dev/auth/nextjs/server"
import { Metadata } from "next"
import { EB_Garamond, Noto_Sans } from "next/font/google"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SiteBackground } from "@/components/site-background"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const display = EB_Garamond({ variable: "--font-display-source" })
const body = Noto_Sans({ variable: "--font-body-source" })

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s • Lily" },
}

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <ConvexAuth>
      <html lang="en" className={display.variable + " " + body.variable}>
        <body className="flex min-h-dvh flex-col font-body antialiased">
          <ConvexClientProvider>
            <SiteBackground>
              <Navbar />
              <main className="grow">{children}</main>
              <Footer />
            </SiteBackground>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuth>
  )
}

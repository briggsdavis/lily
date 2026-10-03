import { ConvexAuthNextjsServerProvider as ConvexAuth } from "@convex-dev/auth/nextjs/server"
import { Metadata } from "next"
import { EB_Garamond, Noto_Sans } from "next/font/google"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { SiteBackground } from "@/components/site-background"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const display = EB_Garamond({ variable: "--font-display-source", subsets: ["latin"] })
const body = Noto_Sans({ variable: "--font-body-source", subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s • Lily" },
  description: "Lily is a neighborhood kitchen and cocktail bar built around seasonal plates and generous evenings.",
  icons: { icon: "/primary logo.png" },
}

export default function Layout({ children }: LayoutProps<"/">) {
  const document = (
    <html lang="en" className={display.variable + " " + body.variable}>
      <body className="flex min-h-dvh flex-col font-body antialiased">
        <ConvexClientProvider>
          <SiteBackground>
            <Navbar />
            <main className="site-main grow">{children}</main>
            <Footer />
          </SiteBackground>
        </ConvexClientProvider>
      </body>
    </html>
  )

  return process.env.NEXT_PUBLIC_CONVEX_URL ? <ConvexAuth>{document}</ConvexAuth> : document
}

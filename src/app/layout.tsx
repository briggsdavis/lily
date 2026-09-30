import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server"
import { Metadata } from "next"
import { EB_Garamond, Noto_Sans } from "next/font/google"
import { ConvexClientProvider } from "@/components/convex-client-provider"
import { SiteFrame } from "@/components/site-frame"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const display = EB_Garamond({ variable: "--font-display-source" })
const body = Noto_Sans({ variable: "--font-body-source" })

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s • Lily" },
}

export default function Layout({ children }: LayoutProps<"/">) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en" className={`${display.variable} ${body.variable}`}>
        <body className="font-body antialiased">
          <ConvexClientProvider>
            <SiteFrame>{children}</SiteFrame>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  )
}

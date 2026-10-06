import { Metadata } from "next"
import { EB_Garamond, Noto_Sans } from "next/font/google"
import { Footer } from "@/components/footer"
import { Navbar } from "@/components/navbar"
import { ScrollEffects } from "@/components/scroll-effects"
import { SiteBackground } from "@/components/site-background"
// oxlint-disable-next-line import/no-unassigned-import
import "@/globals.css"

const display = EB_Garamond({ variable: "--font-display-source", subsets: ["latin"] })
const body = Noto_Sans({ variable: "--font-body-source", subsets: ["latin"] })

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s • Lily" },
  description:
    "Lily is a Gibsonia neighborhood kitchen and cocktail bar built around seasonal plates and generous evenings.",
  icons: { icon: "/beige-primary-logo.png" },
}

export default function Layout({ children }: LayoutProps<"/">) {
  const document = (
    <html
      data-scroll-behavior="smooth"
      lang="en"
      className={`${display.variable} ${body.variable} scroll-smooth bg-cream motion-reduce:scroll-auto`}
    >
      <body className="flex min-h-dvh flex-col font-body antialiased">
        <SiteBackground>
          <ScrollEffects />
          <Navbar />
          <main className="grow transition duration-320 route-leaving:opacity-35 route-leaving:blur-lg">
            {children}
          </main>
          <Footer />
        </SiteBackground>
      </body>
    </html>
  )

  return document
}

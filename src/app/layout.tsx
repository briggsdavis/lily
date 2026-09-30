import { Metadata } from "next"
import { EB_Garamond, Public_Sans } from "next/font/google"
import { ReactNode } from "react"
import { AppProviders } from "@/components/providers/app-providers"
import "@/globals.css"

const garamond = EB_Garamond({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-garamond",
})

const publicSans = Public_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-public-sans",
})

export const metadata: Metadata = {
  title: { default: "Lily", template: "%s | Lily" },
  description: "Lily web application",
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html className={`${garamond.variable} ${publicSans.variable}`} lang="en">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}

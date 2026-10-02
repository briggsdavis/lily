import { Metadata } from "next"

export const metadata: Metadata = { title: "About" }

export default function AboutPage() {
  return (
    <div className="px-5 py-16 md:px-8 md:py-24 xl:px-16 xl:py-40">
      <h1 className="font-display text-5xl font-medium md:text-7xl xl:text-9xl">About</h1>
    </div>
  )
}

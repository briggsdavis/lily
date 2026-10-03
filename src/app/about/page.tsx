import { Metadata } from "next"

export const metadata: Metadata = { title: "About" }

export default function AboutPage() {
  return (
    <div className="px-5 py-16 md:px-8 md:py-24 xl:px-16 xl:py-40">
      <h1 className="font-display text-4xl font-medium md:text-5xl xl:text-6xl">About</h1>
    </div>
  )
}

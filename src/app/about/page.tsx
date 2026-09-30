import { Metadata } from "next"

export const metadata: Metadata = { title: "About" }

export default function AboutPage() {
  return (
    <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-medium tracking-[-0.06em]">
      About
    </h1>
  )
}

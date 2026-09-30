import { Metadata } from "next"

export const metadata: Metadata = { title: "Contact" }

export default function ContactPage() {
  return (
    <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-medium tracking-[-0.06em]">
      Contact
    </h1>
  )
}

import { PillButton, type PillButtonColor } from "@/components/pill-button"

const buttonColors: PillButtonColor[] = ["burgundy", "forest", "rose", "clay"]

export default function HomePage() {
  return (
    <div className="flex flex-col items-start gap-10">
      <h1 className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.95] font-medium tracking-[-0.06em]">
        Home
      </h1>
      <div className="flex flex-wrap gap-4">
        {buttonColors.map((color) => (
          <PillButton color={color} key={color}>
            Discover Lily
          </PillButton>
        ))}
      </div>
    </div>
  )
}

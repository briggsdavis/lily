import { PillButton, PillButtonColor } from "@/components/pill-button"

const buttonColors: PillButtonColor[] = ["burgundy", "forest", "rose", "clay"]

export default function HomePage() {
  return (
    <div className="px-5 py-16 md:px-8 md:py-24 xl:px-16 xl:py-40">
      <div className="flex flex-col items-start gap-10">
        <h1 className="font-display text-5xl font-medium md:text-7xl xl:text-9xl">Home</h1>
        <div className="flex flex-wrap gap-4">
          {buttonColors.map((color) => (
            <PillButton color={color} key={color}>
              Discover Lily
            </PillButton>
          ))}
        </div>
      </div>
    </div>
  )
}

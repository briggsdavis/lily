import type { ReactNode } from "react"

const colorStyles = {
  burgundy: {
    button: "text-burgundy hover:text-cream",
    fill: "bg-burgundy",
  },
  forest: {
    button: "text-dark-green hover:text-pink",
    fill: "bg-dark-green",
  },
  rose: {
    button: "text-dark-green hover:text-burgundy",
    fill: "bg-pink",
  },
  clay: {
    button: "text-orange-brown hover:text-cream",
    fill: "bg-orange-brown",
  },
} as const

export type PillButtonColor = keyof typeof colorStyles

export function PillButton({
  children,
  color = "burgundy",
}: {
  children: ReactNode
  color?: PillButtonColor
}) {
  const styles = colorStyles[color]

  return (
    <button
      className={`group relative isolate inline-flex min-h-12 min-w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[0.75px] border-current px-7 py-3 text-sm font-semibold tracking-[0.08em] uppercase transition-[color,transform] duration-700 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:scale-[0.98] ${styles.button}`}
      type="button"
    >
      <span
        aria-hidden="true"
        className={`absolute inset-0 -z-10 origin-bottom scale-y-0 rounded-[inherit] transition-transform duration-[1100ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:scale-y-100 group-focus-visible:scale-y-100 ${styles.fill}`}
      />
      <span className="relative text-center">{children}</span>
    </button>
  )
}

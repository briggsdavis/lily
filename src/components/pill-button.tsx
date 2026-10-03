import { ReactNode } from "react"
import { TransitionLink } from "@/components/transition-link"

const colorStyles = {
  burgundy: {
    button: "text-burgundy",
    text: "text-cream",
    fill: "bg-burgundy",
  },
  forest: {
    button: "text-dark-green",
    text: "text-pink",
    fill: "bg-dark-green",
  },
  rose: {
    button: "text-dark-green",
    text: "text-burgundy",
    fill: "bg-pink",
  },
  pink: {
    button: "text-pink",
    text: "text-dark-green",
    fill: "bg-pink",
  },
  clay: {
    button: "text-orange-brown",
    text: "text-cream",
    fill: "bg-orange-brown",
  },
  cream: {
    button: "text-cream",
    text: "text-burgundy",
    fill: "bg-cream",
  },
} as const

export type PillButtonColor = keyof typeof colorStyles

export function PillButton({
  children,
  color = "burgundy",
  type = "button",
}: {
  children: ReactNode
  color?: PillButtonColor
  type?: "button" | "submit"
}) {
  const styles = colorStyles[color]

  return (
    <button
      className={`group relative isolate inline-flex min-h-12 min-w-36 cursor-pointer items-center justify-center overflow-hidden rounded-full border-[0.75px] border-current px-7 py-3 text-sm font-semibold uppercase transition-transform duration-700 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:scale-[0.98] ${styles.button}`}
      type={type}
    >
      <span className="relative text-center">{children}</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] px-7 py-3 text-center transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] ${styles.fill} ${styles.text}`}
      >
        {children}
      </span>
    </button>
  )
}

export function PillLink({
  children,
  color = "burgundy",
  href,
}: {
  children: ReactNode
  color?: PillButtonColor
  href: string
}) {
  const styles = colorStyles[color]

  return (
    <TransitionLink
      className={`group relative isolate inline-flex min-h-12 min-w-36 items-center justify-center overflow-hidden rounded-full border-[0.75px] border-current px-7 py-3 text-sm font-semibold uppercase transition-transform duration-700 ease-out focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current active:scale-[0.98] ${styles.button}`}
      href={href}
    >
      <span className="relative text-center">{children}</span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] px-7 py-3 text-center transition-[clip-path] duration-500 ease-[cubic-bezier(0.76,0,0.24,1)] [clip-path:inset(100%_0_0_0)] group-hover:[clip-path:inset(0_0_0_0)] group-focus-visible:[clip-path:inset(0_0_0_0)] ${styles.fill} ${styles.text}`}
      >
        {children}
      </span>
    </TransitionLink>
  )
}

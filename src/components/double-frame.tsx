import type { CSSProperties } from "react"

const SIDE_POINTS = 13
const TOP_POINTS = 9

function random(seed: number) {
  let state = seed >>> 0
  return () => {
    state = (state + 0x6d2b79f5) >>> 0
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

// Smooth random values between fixed endpoints, so the stroke swells and thins organically.
function profile(next: () => number, length: number, start: number, end?: number) {
  let values = Array.from({ length }, next)
  values[0] = start
  if (end !== undefined) values[length - 1] = end
  for (let pass = 0; pass < 2; pass++) {
    values = values.map((value, index) =>
      index === 0 || (index === length - 1 && end !== undefined)
        ? value
        : (values[index - 1] + value * 2 + (values[index + 1] ?? value)) / 4,
    )
  }
  return values
}

// Top bars carry the corner thickness from the side and only ever thin toward the opening.
function topProfile(start: number) {
  return Array.from({ length: TOP_POINTS }, (_, index) => {
    const progress = index / (TOP_POINTS - 1)
    return start * (1 - 0.6 * progress * progress)
  })
}

function vars(values: number[]) {
  return Object.fromEntries(
    values.map((value, index) => [`--f${index}`, value.toFixed(3)]),
  ) as CSSProperties
}

function ring(next: () => number, base?: Record<string, number[]>) {
  const blend = (values: number[], key: string) =>
    base ? values.map((value, index) => base[key][index] * 0.6 + value * 0.4) : values
  const corner = () => 0.15 + next() * 0.85
  const [tl, tr, bl, br] = [corner(), corner(), corner(), corner()]
  const pieces = {
    "frame-l": profile(next, SIDE_POINTS, tl, bl),
    "frame-r": profile(next, SIDE_POINTS, tr, br),
    "frame-b": profile(next, SIDE_POINTS, bl, br),
    "frame-tl": topProfile(tl),
    "frame-tr": topProfile(tr),
  }
  return Object.fromEntries(
    Object.entries(pieces).map(([key, values]) => [key, blend(values, key)]),
  ) as Record<keyof typeof pieces, number[]>
}

export function DoubleFrame({
  className = "",
  seed = 7,
  variant = "double",
}: {
  className?: string
  seed?: number
  variant?: "double" | "l"
}) {
  const next = random(seed)
  const outer = ring(next)
  const inner = ring(next, outer)

  return (
    <div aria-hidden="true" className={`frame-double ${className}`}>
      {(
        [
          ["frame-double-outer", outer],
          ...(variant === "double" ? [["frame-double-inner", inner] as const] : []),
        ] as const
      ).map(([name, pieces]) => (
        <div className={`frame-double-ring ${name}`} key={name}>
          {Object.entries(pieces)
            .filter(([piece]) => variant === "double" || piece === "frame-l" || piece === "frame-b")
            .map(([piece, values]) => (
              <span className={piece} key={piece} style={vars(values)} />
            ))}
        </div>
      ))}
    </div>
  )
}

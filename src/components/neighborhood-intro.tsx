"use client"

import { CSSProperties, useEffect, useRef, useState } from "react"

const copy =
  "Lily is a neighborhood kitchen and cocktail bar in Gibsonia, cooking with the seasons and pouring drinks from the garden, for late lunches and evenings that ask you to stay a little longer."

const words = copy.split(" ").map((word, index) => ({ id: `${word}-${index}`, word }))
const clamp = (value: number) => Math.min(1, Math.max(0, value))
const unrevealedColor = [201, 168, 178] as const
const revealedColor = [253, 242, 226] as const

function revealColor(progress: number) {
  const channels = unrevealedColor.map((channel, index) =>
    Math.round(channel + (revealedColor[index] - channel) * progress),
  )
  return `rgb(${channels.join(" ")})`
}

export function NeighborhoodIntro() {
  const ref = useRef<HTMLParagraphElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      const reducedMotionFrame = window.requestAnimationFrame(() => setProgress(1))
      return () => window.cancelAnimationFrame(reducedMotionFrame)
    }

    let frame = 0
    const update = () => {
      frame = 0
      const bounds = element.getBoundingClientRect()
      const center = bounds.top + bounds.height / 2
      setProgress(clamp((window.innerHeight - center) / (window.innerHeight / 2)))
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    window.addEventListener("resize", schedule)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", schedule)
    }
  }, [])

  return (
    <p
      className="relative max-w-[52ch] text-center font-display text-[1.35rem] leading-[1.18] font-normal text-balance md:text-[2rem] lg:text-[2.7rem]"
      ref={ref}
    >
      {words.map(({ id, word }, index) => {
        const wordProgress = clamp((progress * (words.length + 4) - index) / 5)
        const style = {
          color: revealColor(wordProgress),
          opacity: 0.28 + wordProgress * 0.72,
        } as CSSProperties

        return (
          <span className="transition-[color,opacity] duration-300" key={id} style={style}>
            {word}
            {index < words.length - 1 ? " " : ""}
          </span>
        )
      })}
    </p>
  )
}

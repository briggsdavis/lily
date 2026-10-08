"use client"

import { CSSProperties, useEffect, useMemo, useRef, useState } from "react"

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
  const wordStyles = useMemo(
    () =>
      words.map((_, index) => {
        const wordProgress = clamp((progress * (words.length + 4) - index) / 5)
        return {
          color: revealColor(wordProgress),
          filter: `blur(${(1 - wordProgress) * 11}px)`,
          opacity: 0.1 + wordProgress * 0.9,
          textShadow: `0 0 ${(1 - wordProgress) * 20}px rgba(253, 242, 226, ${0.34 * (1 - wordProgress)})`,
          transform: `translate3d(0, ${(1 - wordProgress) * 0.16}em, 0)`,
        } as CSSProperties
      }),
    [progress],
  )

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
        return (
          <span
            className="mr-[0.23em] inline-block transition-[color,filter,opacity,text-shadow,transform] duration-500 ease-lily last:mr-0"
            key={id}
            style={wordStyles[index]}
          >
            {word}
          </span>
        )
      })}
    </p>
  )
}

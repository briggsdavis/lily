"use client"
import { useEffect, useRef } from "react"
import {
  EditableText,
  ColorSection,
  useEditorMode,
  usePageContent,
} from "@/components/page-content"

const rows = [
  { text: "CHARMING · SEASONAL · WARM · CONSIDERED ·", direction: 1 },
  { text: "INTIMATE · GENEROUS · UNHURRIED · GATHERED ·", direction: -1 },
] as const

export function AboutMarquee() {
  const editing = useEditorMode()
  const content = usePageContent()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (editing) return
    const section = sectionRef.current
    if (!section) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let frame = 0
    const update = () => {
      frame = 0
      const bounds = section.getBoundingClientRect()
      const progress = (window.innerHeight - bounds.top) / (window.innerHeight + bounds.height)
      section.querySelectorAll<HTMLElement>("[data-marquee-row]").forEach((row, index) => {
        const travel = row.scrollWidth / 2
        const offset = (progress * 0.9 + index * 0.15) * travel
        const x = rows[index].direction === 1 ? -offset : offset - travel
        row.style.transform = `translate3d(${x}px,0,0)`
      })
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
  }, [editing])

  return (
    <ColorSection
      field="about.marquee.color"
      className="group/marquee flex flex-col gap-2 overflow-hidden bg-dark-green py-7 text-pink md:gap-4 md:py-10"
      data-nav-tone="dark"
      ref={sectionRef}
    >
      {rows.map((row, index) => (
        <div
          className={`flex w-max whitespace-nowrap will-change-transform ${
            index === 0 ? "text-cream" : "text-pink/60 transition-colors hover:text-cream"
          }`}
          data-marquee-row
          key={index}
        >
          {(editing ? [0] : [0, 1, 2, 3]).map((copy) => (
            <span
              aria-hidden={copy > 0}
              className={`pr-[0.6em] font-header-stencil leading-none ${editing ? "text-sm md:text-base" : "text-6xl md:text-8xl lg:text-[9rem]"}`}
              key={copy}
            >
              {editing ? (
                <EditableText field={`about.marquee.row${index}`}>{row.text}</EditableText>
              ) : (
                (content?.fields[`about.marquee.row${index}`] ?? row.text)
              )}
            </span>
          ))}
        </div>
      ))}
    </ColorSection>
  )
}

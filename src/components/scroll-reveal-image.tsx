"use client"
import { CSSProperties, useEffect, useRef } from "react"
import { EditableText, useEditorMode, MediaEditControl } from "@/components/page-content"
import { MediaImage } from "@/components/page-media"
import { PillLink } from "@/components/pill-button"

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => value * value * (3 - 2 * value)
const initialProgress = { "--open": 0, "--meet": 0, "--reserve": 0 } as CSSProperties
// The walls slide apart with transforms, which stay on the compositor. Animating clip-path
// on the full-screen image forced a repaint every frame and stuttered on mobile Safari.
const leftWallPosition = { transform: "translate3d(calc(var(--open) * -100%), 0, 0)" }
const rightWallPosition = { transform: "translate3d(calc(var(--open) * 100%), 0, 0)" }
const headingStyle = {
  opacity: "var(--meet)",
  transform: "translate3d(0, calc((1 - var(--meet)) * 1rem), 0)",
} as CSSProperties
const reserveButtonStyle = {
  opacity: "var(--reserve)",
  transform: "translate3d(0, calc((1 - var(--reserve)) * 1rem), 0)",
} as CSSProperties

export function ScrollRevealImage() {
  const editing = useEditorMode()
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    if (editing) return
    const section = sectionRef.current
    if (!section) return

    const apply = (open: number, meet: number, reserve: number) => {
      section.style.setProperty("--open", String(open))
      section.style.setProperty("--meet", String(meet))
      section.style.setProperty("--reserve", String(reserve))
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(1, 1, 1)
      return
    }

    // iOS changes innerHeight as the toolbar collapses mid-scroll, which made progress jump.
    // Only re-measure when the width changes (rotation or a real resize).
    let viewport = window.innerHeight
    let viewportWidth = window.innerWidth
    let frame = 0
    const update = () => {
      frame = 0
      const sectionTop = section.getBoundingClientRect().top
      const revealStart = viewport * 0.88
      const scrolledIntoReveal = revealStart - sectionTop

      const open = ease(clamp(scrolledIntoReveal / (viewport * 1.15)))
      const meet = ease(clamp((scrolledIntoReveal - viewport * 0.55) / (viewport * 0.85)))
      const reserve = ease(clamp((scrolledIntoReveal - viewport * 1.1) / (viewport * 0.5)))

      apply(open, meet, reserve)
    }
    const schedule = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener("scroll", schedule, { passive: true })
    const resize = () => {
      if (window.innerWidth !== viewportWidth) {
        viewportWidth = window.innerWidth
        viewport = window.innerHeight
      }
      schedule()
    }
    window.addEventListener("resize", resize)
    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener("scroll", schedule)
      window.removeEventListener("resize", resize)
    }
  }, [editing])

  return (
    <section
      className={editing ? "relative h-svh bg-dark-maroon" : "relative h-[280svh] bg-dark-maroon"}
      data-nav-tone="image"
      ref={sectionRef}
      style={initialProgress}
    >
      <MediaEditControl mediaKey="home.evening" />
      <div className="sticky top-0 h-svh overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <MediaImage
            mediaKey="home.evening"
            alt="Lily's dining room in the evening"
            className="object-cover"
            fill
            sizes="100vw"
            src="/images/lily-romantic-interior-9x16.webp"
          />
        </div>

        {editing ? null : (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-0 w-[calc(50%+1px)] bg-dark-maroon will-change-transform"
              style={leftWallPosition}
            />
            <div
              aria-hidden="true"
              className="absolute inset-y-0 right-0 w-[calc(50%+1px)] bg-dark-maroon will-change-transform"
              style={rightWallPosition}
            />
          </>
        )}

        <p
          className="absolute inset-0 flex flex-col items-center justify-center gap-[0.15em] px-page text-center font-demibold text-[5vw] leading-tight font-semibold text-cream uppercase will-change-[opacity,transform] xl:flex-row xl:gap-[0.3em] xl:text-[2.6vw]"
          style={editing ? undefined : headingStyle}
        >
          <span
            className="block shrink-0 whitespace-nowrap"
          >
            <EditableText field="home.evening.text1">Come for dinner,</EditableText>
          </span>
          <span
            className="block shrink-0 whitespace-nowrap italic"
          >
            <EditableText field="home.evening.text2">stay for the evening.</EditableText>
          </span>
        </p>

        <div
          className="absolute inset-x-0 top-[62%] z-10 flex justify-center will-change-[opacity,transform]"
          style={editing ? undefined : reserveButtonStyle}
        >
          <PillLink field="home.evening.button" color="cream" href="/contact?reason=reservation">
            Reserve a table
          </PillLink>
        </div>
      </div>
    </section>
  )
}

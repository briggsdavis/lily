"use client"
import { ReactNode, useEffect, useRef } from "react"
import { useEditorMode, ColorSection } from "@/components/page-content"

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const ease = (value: number) => 1 - (1 - value) ** 2
const maximumTilt = 10.8
const initialTilt = { transform: `rotate(${maximumTilt}deg)` }

export function ScrollTilt({
  children,
  className,
  colorField,
}: {
  children: ReactNode
  className?: string
  colorField?: string
}) {
  const editing = useEditorMode()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (editing) return
    const element = ref.current
    if (!element) return

    const apply = (tilt: number) => {
      element.style.transform = `rotate(${tilt * maximumTilt}deg)`
    }

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      apply(0)
      return
    }

    let frame = 0
    const update = () => {
      frame = 0
      const height = window.innerHeight
      // Starts tilting as the top enters the bottom of the viewport, flat around mid-screen.
      // Measure the untransformed top via the offset parent so the tilt doesn't skew the reading.
      const parent = element.offsetParent ?? document.body
      const top = parent.getBoundingClientRect().top + element.offsetTop
      const progress = clamp((height - top) / (height * 0.8))
      apply(1 - ease(progress))
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
      as="div"
      field={colorField ?? ""}
      className={`origin-top-left will-change-transform ${className ?? ""}`}
      ref={ref}
      style={editing ? undefined : initialTilt}
    >
      {children}
    </ColorSection>
  )
}

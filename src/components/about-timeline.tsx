"use client"

import Image from "next/image"
import { useEffect, useRef, useState } from "react"

const stages = [
  {
    label: "2001",
    title: "Cala Lily opens.",
    text: "Chef Rick Rivero and Paul Anzaldi open the doors in Gibsonia with grill master Ron Jelinek and a kitchen team that stays together for over twenty years.",
    image: "/images/hero-restaurant-unsplash.jpg",
    alt: "Lily's dining room set for the evening",
  },
  {
    label: "Every night",
    title: "A blend of kitchens.",
    text: "Euro-American cooking, steaks and chops from the grill, and a chef who steps out to introduce each course.",
    image: "/images/lily-seasonal-main-dish-4x5.webp",
    alt: "A seasonal main dish",
  },
  {
    label: "2026",
    title: "Lily begins.",
    text: "After 25 years, new owners take the room and keep the team. The seasons now lead the menu, and the bar holds the same standard.",
    image: "/images/lily-romantic-interior-9x16.webp",
    alt: "Lily's dining room in the evening",
  },
] as const

const clamp = (value: number) => Math.min(1, Math.max(0, value))
const stageAt = (progress: number) => (progress < 0.33 ? 0 : progress < 0.72 ? 1 : 2)
const initialProgressStyle = { transform: "scaleX(0)" }

export function AboutTimeline() {
  const ref = useRef<HTMLElement>(null)
  const barRef = useRef<HTMLSpanElement>(null)
  const [year, setYear] = useState(2001)
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const section = ref.current
    if (!section) return

    let frame = 0
    const update = () => {
      frame = 0
      const distance = section.offsetHeight - window.innerHeight
      const progress = clamp(-section.getBoundingClientRect().top / distance)
      setYear(2001 + Math.round(clamp(progress / 0.9) * 25))
      setStage(stageAt(progress))
      barRef.current?.style.setProperty("transform", `scaleX(${progress})`)
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
    <section className="relative h-[320svh] bg-burgundy text-cream" data-nav-tone="dark" ref={ref}>
      <div className="sticky top-0 grid h-dvh grid-rows-[1fr_auto] px-page pt-28 pb-8">
        <div className="grid min-h-0 items-center gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-6">
            <p
              aria-label="Years at this table"
              className="font-display text-[5.5rem] leading-none font-medium text-blush tabular-nums sm:text-[8rem] lg:text-[12rem]"
            >
              {year}
            </p>
            <div className="mt-6 grid max-w-lg md:mt-10">
              {stages.map((item, index) => (
                <div
                  aria-hidden={index !== stage}
                  className={`transition-[opacity,filter,transform] duration-700 ease-lily ${
                    index === stage
                      ? "opacity-100"
                      : "pointer-events-none translate-y-3 opacity-0 blur-md"
                  } [grid-area:1/1]`}
                  key={item.label}
                >
                  <h2 className="mb-3 font-display text-3xl font-medium md:text-4xl">
                    {item.title}
                  </h2>
                  <p className="text-sm leading-7 text-cream/80 md:text-base md:leading-8">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[34svh] overflow-hidden md:col-span-6 md:h-[62svh]">
            {stages.map((item, index) => (
              <div
                aria-hidden={index !== stage}
                className={`absolute inset-0 transition-[clip-path] duration-1000 ease-lily ${
                  index === stage
                    ? "z-10 [clip-path:inset(0_0_0_0)]"
                    : "z-0 [clip-path:inset(100%_0_0_0)]"
                }`}
                key={item.image}
              >
                <Image
                  alt={index === stage ? item.alt : ""}
                  className="object-cover"
                  fill
                  priority={index === 0}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  src={item.image}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4 text-xs font-bold tracking-[0.2em] uppercase">
          <span>2001</span>
          <span className="relative h-px grow bg-cream/30">
            <span
              className="absolute inset-0 origin-left bg-cream"
              ref={barRef}
              style={initialProgressStyle}
            />
          </span>
          <span>2026</span>
        </div>
      </div>
    </section>
  )
}

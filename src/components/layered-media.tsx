"use client"

import Image from "next/image"
import { ReactNode } from "react"

export type LayeredMediaItem = {
  alt: string
  foregroundImageClassName?: string
  src: string
}

export function LayeredMedia({
  active,
  backgroundBlurClassName = "blur-lg",
  backgroundSizes,
  backgroundTransitionClassName = "duration-1000 ease-lily",
  caption,
  className = "",
  foregroundAspectClassName = "aspect-4/5",
  foregroundClassName = "w-1/2",
  foregroundImageClassName = "",
  foregroundPositionClassName = "left-1/2 -translate-x-1/2",
  foregroundTransitionClassName = "duration-1000 ease-lily",
  foregroundTransitionDelayClassName = "",
  foregroundSizes,
  items,
  priority = false,
}: {
  active: number
  backgroundBlurClassName?: string
  backgroundSizes: string
  backgroundTransitionClassName?: string
  caption?: ReactNode
  className?: string
  foregroundAspectClassName?: string
  foregroundClassName?: string
  foregroundImageClassName?: string
  foregroundPositionClassName?: string
  foregroundTransitionClassName?: string
  foregroundTransitionDelayClassName?: string
  foregroundSizes: string
  items: readonly LayeredMediaItem[]
  priority?: boolean
}) {
  return (
    <div className={`isolate overflow-hidden ${className}`}>
      {items.map((item, index) => (
        <div
          aria-hidden={index !== active}
          className={`absolute -inset-6 transition-[opacity,filter] ${backgroundTransitionClassName} ${
            index === active ? `opacity-100 ${backgroundBlurClassName}` : "opacity-0 blur-2xl"
          }`}
          key={`background-${item.src}`}
        >
          <Image
            alt=""
            className="scale-110 object-cover"
            fill
            priority={priority}
            sizes={backgroundSizes}
            src={item.src}
          />
        </div>
      ))}

      {items.map((item, index) => (
        <div
          aria-hidden={index !== active}
          className={`absolute top-1/2 -translate-y-1/2 ${foregroundPositionClassName} ${foregroundClassName} ${index === active ? "z-10" : "pointer-events-none z-0"}`}
          key={`foreground-${item.src}`}
        >
          <div
            className={`relative overflow-hidden transition-[clip-path] ${foregroundTransitionClassName} ${foregroundTransitionDelayClassName} ${foregroundAspectClassName} ${
              index === active ? "[clip-path:inset(0_0_0_0)]" : "[clip-path:inset(100%_0_0_0)]"
            }`}
          >
            <Image
              alt={index === active ? item.alt : ""}
              className={`object-cover ${foregroundImageClassName} ${item.foregroundImageClassName ?? ""}`}
              fill
              priority={priority}
              sizes={foregroundSizes}
              src={item.src}
            />
          </div>
          {caption ? (
            <div
              className={`pt-3 transition-[opacity,filter] duration-700 ease-lily ${
                index === active ? "opacity-100 blur-none" : "opacity-0 blur-md"
              }`}
            >
              {caption}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

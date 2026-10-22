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
  captionPlacement = "below",
  className = "",
  foregroundAspectClassName = "aspect-4/5",
  foregroundClassName = "w-1/2",
  foregroundHiddenClipClassName = "[clip-path:inset(100%_0_0_0)]",
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
  /** One caption for every item, or a function returning each item's own caption. */
  caption?: ReactNode | ((index: number) => ReactNode)
  /**
   * "below" stacks the caption under the image; "overlay" lays it over the image box;
   * "beside" hangs the caption left of the image, matching its height, so every image
   * shares one position regardless of caption width. In "beside" mode
   * foregroundClassName sizes the image itself, so use non-percentage widths.
   */
  captionPlacement?: "below" | "overlay" | "beside"
  className?: string
  foregroundAspectClassName?: string
  foregroundClassName?: string
  /** Clip-path class for inactive images; animating from it to inset(0) is the reveal. */
  foregroundHiddenClipClassName?: string
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
            priority={priority && index === active}
            sizes={backgroundSizes}
            src={item.src}
          />
        </div>
      ))}

      {items.map((item, index) => (
        <div
          aria-hidden={index !== active}
          className={`absolute top-1/2 -translate-y-1/2 ${foregroundPositionClassName} ${
            captionPlacement === "beside" ? "" : foregroundClassName
          } ${index === active ? "z-10" : "pointer-events-none z-0"}`}
          key={`foreground-${item.src}`}
        >
          <div
            className={`relative overflow-hidden transition-[clip-path] ${
              captionPlacement === "beside" ? `shrink-0 ${foregroundClassName}` : ""
            } ${foregroundTransitionClassName} ${foregroundTransitionDelayClassName} ${foregroundAspectClassName} ${
              index === active ? "[clip-path:inset(0_0_0_0)]" : foregroundHiddenClipClassName
            }`}
          >
            <Image
              alt={index === active ? item.alt : ""}
              className={`object-cover ${foregroundImageClassName} ${item.foregroundImageClassName ?? ""}`}
              fill
              priority={priority && index === active}
              sizes={foregroundSizes}
              src={item.src}
            />
          </div>
          {caption ? (
            <div
              className={`transition-[opacity,filter] duration-700 ease-lily ${
                captionPlacement === "overlay"
                  ? "pointer-events-none absolute inset-0 z-20"
                  : captionPlacement === "beside"
                    ? "pointer-events-none absolute inset-y-0 right-full mr-1.5 md:mr-2"
                    : "pt-3"
              } ${index === active ? "opacity-100 blur-none" : "opacity-0 blur-md"}`}
            >
              {typeof caption === "function" ? caption(index) : caption}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  )
}

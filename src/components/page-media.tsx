"use client"

import { useQuery } from "convex/react"
import Image, { type ImageProps } from "next/image"
import { mediaSlots, type MediaKey } from "@/lib/page-media"
import { api } from "../../convex/_generated/api"

export function usePageMedia() {
  return useQuery(api.pageMedia.list, {})
}
export function MediaImage({ mediaKey, ...props }: ImageProps & { mediaKey: MediaKey }) {
  const media = usePageMedia()?.find((item) => item.key === mediaKey)
  if (media?.kind === "video" && media.url)
    return (
      <video
        aria-label={props.alt}
        autoPlay
        muted
        loop
        playsInline
        src={media.url}
        className={`${props.fill ? "absolute inset-0 h-full w-full " : ""}${props.className ?? ""}`}
      />
    )
  return <Image {...props} src={media?.url ?? props.src} />
}
export function useMediaSource(key: MediaKey) {
  const media = usePageMedia()?.find((item) => item.key === key)
  return media?.url ?? mediaSlots.find((slot) => slot.key === key)!.src
}

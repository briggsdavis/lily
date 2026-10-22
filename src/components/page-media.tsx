"use client"

import { useQuery } from "convex/react"
import Image, { type ImageProps } from "next/image"
import { useState } from "react"
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
        id={`hero-video-${mediaKey}`}
        key={media.url}
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

export function HeroSoundToggle({ mediaKey }: { mediaKey: MediaKey }) {
  const media = usePageMedia()?.find((item) => item.key === mediaKey)
  if (media?.kind !== "video" || !media.url) return null
  return <SoundButton key={media.url} mediaKey={mediaKey} />
}

function SoundButton({ mediaKey }: { mediaKey: MediaKey }) {
  const [muted, setMuted] = useState(true)
  const toggleSound = () => {
    const video = document.getElementById(`hero-video-${mediaKey}`)
    if (!(video instanceof HTMLVideoElement)) return
    video.muted = !video.muted
    setMuted(video.muted)
  }
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={muted ? "Turn hero video sound on" : "Mute hero video"}
      aria-pressed={!muted}
      className="absolute right-5 bottom-5 z-40 grid size-11 cursor-pointer place-items-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:right-8 md:bottom-8"
    >
      <svg
        aria-hidden="true"
        className="size-5"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M11 5 6 9H3v6h3l5 4V5Z" />
        {muted ? (
          <path d="m16 9 6 6m0-6-6 6" />
        ) : (
          <>
            <path d="M15 8a6 6 0 0 1 0 8" />
            <path d="M18 5a10 10 0 0 1 0 14" />
          </>
        )}
      </svg>
    </button>
  )
}

"use client"
import { useQuery } from "convex/react"
import Image, { type ImageProps } from "next/image"
import { useEffect, useRef, useState } from "react"
import { usePageContent, useEditorMode } from "@/components/page-content"
import { mediaSlots, type MediaKey } from "@/lib/page-media"
import { api } from "../../convex/_generated/api"

export function usePageMedia() {
  const published = useQuery(api.pageMedia.list, {})
  const content = usePageContent()
  return published === undefined
    ? undefined
    : !content?.media.length
      ? published
      : [
          ...published.filter((item) => !content?.media.some((draft) => draft.key === item.key)),
          ...(content?.media ?? []),
        ]
}
export function MediaImage({ mediaKey, ...props }: ImageProps & { mediaKey: MediaKey }) {
  const media = usePageMedia()?.find((item) => item.key === mediaKey)
  const editing = useEditorMode()
  if (editing && media?.kind === "video" && media.url)
    return (
      <video
        data-media-key={mediaKey}
        aria-label={props.alt}
        muted
        playsInline
        preload="metadata"
        src={media.url}
        className={`${props.fill ? "absolute inset-0 h-full w-full " : ""}${props.className ?? ""}`}
      />
    )
  if (media?.kind === "video" && media.url)
    return (
      <BackgroundVideo
        mediaKey={mediaKey}
        key={media.url}
        alt={props.alt}
        src={media.url}
        className={`${props.fill ? "absolute inset-0 h-full w-full " : ""}${props.className ?? ""}`}
      />
    )
  return <Image data-media-key={mediaKey} {...props} src={media?.url ?? props.src} />
}
function BackgroundVideo({
  mediaKey,
  alt,
  src,
  className,
}: {
  mediaKey: MediaKey
  alt: string
  src: string
  className: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const video = ref.current
    if (!video) return
    const section = video.closest("section") ?? video
    let visible = false
    const stop = () => {
      video.muted = true
      video.pause()
    }
    const update = () => {
      if (!visible || document.hidden) {
        stop()
        return
      }
      // Autoplay is best-effort on mobile (for example, Low Power Mode may block it).
      void video.play().catch(() => {
        video.muted = true
      })
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting && entry.intersectionRatio >= 0.05
        update()
      },
      { threshold: [0, 0.05] },
    )
    observer.observe(section)
    document.addEventListener("visibilitychange", update)
    window.addEventListener("pagehide", stop)
    return () => {
      observer.disconnect()
      document.removeEventListener("visibilitychange", update)
      window.removeEventListener("pagehide", stop)
      stop()
    }
  }, [])
  return (
    <video
      ref={ref}
      data-media-key={mediaKey}
      id={`hero-video-${mediaKey}`}
      aria-label={alt}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      src={src}
      className={className}
    />
  )
}

export function useMediaSource(key: MediaKey) {
  const media = usePageMedia()?.find((item) => item.key === key)
  return media?.url ?? mediaSlots.find((slot) => slot.key === key)!.src
}

export function HeroSoundToggle({ mediaKey }: { mediaKey: MediaKey }) {
  const editing = useEditorMode()
  const media = usePageMedia()?.find((item) => item.key === mediaKey)
  if (editing || media?.kind !== "video" || !media.url) return null
  return <SoundButton key={media.url} mediaKey={mediaKey} />
}

function SoundButton({ mediaKey }: { mediaKey: MediaKey }) {
  const [muted, setMuted] = useState(true)
  useEffect(() => {
    const video = document.getElementById(`hero-video-${mediaKey}`)
    if (!(video instanceof HTMLVideoElement)) return
    const sync = () => setMuted(video.muted)
    sync()
    video.addEventListener("volumechange", sync)
    return () => video.removeEventListener("volumechange", sync)
  }, [mediaKey])
  const toggleSound = () => {
    const video = document.getElementById(`hero-video-${mediaKey}`)
    if (!(video instanceof HTMLVideoElement)) return
    video.muted = !video.muted
    setMuted(video.muted)
    // Call play within the tap gesture so iOS can resume a blocked autoplay video.
    if (video.paused)
      void video.play().catch(() => {
        video.muted = true
        setMuted(true)
      })
  }
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={muted ? "Turn hero video sound on" : "Mute hero video"}
      aria-pressed={!muted}
      className="absolute right-5 bottom-[max(1.25rem,env(safe-area-inset-bottom))] z-40 grid size-12 cursor-pointer touch-manipulation place-items-center rounded-full border border-white/40 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/50 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white md:right-8 md:bottom-8"
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

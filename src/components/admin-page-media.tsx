"use client"

import { useMutation } from "convex/react"
import Image from "next/image"
import { useId, useRef, useState, type ChangeEvent } from "react"
import { usePageMedia } from "@/components/page-media"
import { useMediaUpload } from "@/components/use-media-upload"
import { mediaSlots, imageLimitMb, videoLimitMb } from "@/lib/page-media"
import { api } from "../../convex/_generated/api"

export function AdminPageMedia({ page }: { page: (typeof mediaSlots)[number]["page"] }) {
  const slots = mediaSlots.filter((slot) => slot.page === page)
  const [active, setActive] = useState(0)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState("")
  const input = useRef<HTMLInputElement>(null)
  const id = useId()
  const saved = usePageMedia()
  const uploadMedia = useMediaUpload()
  const save = useMutation(api.pageMedia.save)
  const slot = slots[active]
  const current = saved?.find((item) => item.key === slot.key)
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0]
    event.currentTarget.value = ""
    if (!file) return
    setBusy(true)
    setMessage("")
    try {
      const uploaded = await uploadMedia(file, slot.video)
      await save({
        key: slot.key,
        storageId: uploaded.storageId as import("../../convex/_generated/dataModel").Id<"_storage">,
      })
      setMessage("Saved. Your new media is now on the website.")
    } catch (reason) {
      setMessage(reason instanceof Error ? reason.message : "Could not save. Please try again.")
    } finally {
      setBusy(false)
    }
  }
  return (
    <section
      className="mb-10 rounded-2xl border border-deep-brown/10 bg-white p-5 md:p-6"
      aria-label="Page images"
    >
      {slots.length > 1 && (
        <div role="tablist" aria-label="Image locations" className="mb-6 flex flex-wrap gap-2">
          {slots.map((item, index) => (
            <button
              key={item.key}
              role="tab"
              id={`${id}-tab-${index}`}
              aria-selected={active === index}
              aria-controls={`${id}-panel`}
              disabled={busy}
              onClick={() => {
                setActive(index)
                setMessage("")
              }}
              className={`rounded-lg border px-3 py-2 text-sm focus-visible:outline-2 ${active === index ? "border-deep-brown bg-deep-brown text-white" : "border-deep-brown/15 hover:bg-stone-50"}`}
            >
              {index + 1}. {item.title}
            </button>
          ))}
        </div>
      )}
      <div
        role={slots.length > 1 ? "tabpanel" : undefined}
        id={`${id}-panel`}
        aria-labelledby={slots.length > 1 ? `${id}-tab-${active}` : undefined}
        className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]"
      >
        <div className="flex h-64 items-center justify-center overflow-hidden rounded-xl bg-stone-100 md:h-80">
          {current?.kind === "video" && current.url ? (
            <video
              key={current.url}
              src={current.url}
              controls
              muted
              className="h-full w-full object-contain"
            />
          ) : (
            <Image
              width={800}
              height={600}
              src={current?.url ?? slot.src}
              alt={`Current ${slot.title.toLowerCase()}`}
              className="h-full w-full object-contain"
            />
          )}
        </div>
        <div className="self-center">
          <h2 className="text-xl font-semibold">{slot.title}</h2>
          <p className="mt-2 text-sm text-deep-brown/70">{slot.description}</p>
          <p className="mt-3 text-sm text-deep-brown/60">
            Suggested aspect ratio: about {slot.ratio}. Cropping varies by screen size.
          </p>
          <p className="mt-1 text-xs text-deep-brown/60">
            Images up to {imageLimitMb} MB
            {slot.video ? `; videos up to ${videoLimitMb} MB (starts muted and loops)` : ""}.
          </p>
          <input
            ref={input}
            type="file"
            accept={slot.video ? "image/*,video/mp4,video/webm" : "image/*"}
            className="sr-only"
            disabled={busy || saved === undefined}
            onChange={upload}
            aria-label={`Choose ${slot.title.toLowerCase()}`}
          />
          <button
            type="button"
            disabled={busy || saved === undefined}
            onClick={() => input.current?.click()}
            className="mt-5 rounded-xl bg-deep-brown px-5 py-3 text-sm font-semibold text-white disabled:opacity-50"
          >
            {busy
              ? "Saving…"
              : `Change ${slot.video ? "image or video" : slot.title.toLowerCase()}`}
          </button>
          <output className="mt-3 block text-sm">{message}</output>
        </div>
      </div>
    </section>
  )
}

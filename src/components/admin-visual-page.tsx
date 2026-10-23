"use client"

import { useMutation, useQuery } from "convex/react"
import type { FunctionArgs } from "convex/server"
import { ConvexError } from "convex/values"
import Image from "next/image"
import { useEffect, useRef, useState, type ReactNode, type MouseEvent } from "react"
import { createPortal } from "react-dom"
import { AboutContent } from "@/components/about-content"
import { AdminButton, AdminModal, adminInput } from "@/components/admin-ui"
import { HomeContent } from "@/components/home-content"
import { PageContentContext, type EditSelection } from "@/components/page-content"
import { useMediaUpload } from "@/components/use-media-upload"
import { mediaSlots, imageLimitMb, videoLimitMb } from "@/lib/page-media"
import {
  normalizeHex,
  validPageLink,
  siteColorTokens,
  type EditablePage,
  type PageFields,
  type DraftMedia,
} from "@/lib/visual-page"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

export function AdminVisualPage({ page }: { page: EditablePage }) {
  const published = useQuery(api.visualPages.published, { page })
  const media = useQuery(api.pageMedia.list, {})
  const savedColors = useQuery(api.visualPages.colors, {}) ?? []
  const save = useMutation(api.visualPages.save)
  if (!published || !media) return <p className="py-10 text-sm">Loading page editor…</p>
  return (
    <VisualPage
      key={page}
      page={page}
      initial={published}
      latest={published}
      savedColors={savedColors}
      save={save}
    />
  )
}

export function VisualPage({
  page,
  initial,
  latest,
  savedColors,
  save,
}: {
  page: EditablePage
  initial: { fields: PageFields; revision: number }
  latest: { fields: PageFields; revision: number }
  savedColors: string[]
  save: (args: FunctionArgs<typeof api.visualPages.save>) => Promise<number>
}) {
  const [baseline, setBaseline] = useState(initial)
  const [fields, setFields] = useState(initial.fields)
  const [media, setMedia] = useState<DraftMedia[]>([])
  const [selection, setSelection] = useState<EditSelection | null>(null)
  const [sitePalette, setSitePalette] = useState<string[]>([])
  const select = (selection: EditSelection) => {
    if (selection.kind === "color") {
      const style = getComputedStyle(document.documentElement)
      setSitePalette(
        siteColorTokens
          .map((token) => normalizeHex(style.getPropertyValue(`--color-${token}`)))
          .filter((value): value is string => value !== null),
      )
    }
    setSelection(selection)
  }
  const saveInFlight = useRef(false)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")
  const [generation, setGeneration] = useState(0)
  const dirty = JSON.stringify(fields) !== JSON.stringify(baseline.fields) || media.length > 0
  const conflict = latest !== undefined && latest.revision !== baseline.revision
  useEffect(() => {
    if (!dirty) return
    const beforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ""
    }
    const navigate = (event: globalThis.MouseEvent) => {
      const target = event.target instanceof Element ? event.target.closest("a[href]") : null
      if (!target || target.closest("[data-visual-canvas]")) return
      if (!window.confirm("Leave this page and discard your unsaved changes?")) {
        event.preventDefault()
        event.stopImmediatePropagation()
      }
    }
    window.addEventListener("beforeunload", beforeUnload)
    document.addEventListener("click", navigate, true)
    return () => {
      window.removeEventListener("beforeunload", beforeUnload)
      document.removeEventListener("click", navigate, true)
    }
  }, [dirty])
  const discard = () => {
    if (dirty && !window.confirm("Discard all unsaved changes?")) return
    const published = latest ?? baseline
    setBaseline(published)
    setFields(published.fields)
    setMedia([])
    setSelection(null)
    setMessage("")
    setGeneration((value) => value + 1)
  }
  const publish = async () => {
    if (saveInFlight.current || selection || !dirty || conflict) return
    saveInFlight.current = true
    setSaving(true)
    setMessage("")
    try {
      const revision = await save({
        page,
        revision: baseline.revision,
        fields,
        media: media.map((item) => ({
          key: item.key,
          storageId: item.storageId as Id<"_storage">,
        })),
      })
      setBaseline({ fields, revision })
      setMedia([])
      setMessage("Saved. Your changes are now live.")
    } catch (error) {
      setMessage(
        error instanceof ConvexError
          ? String(error.data)
          : "Could not save. Your draft is still here. Please try again.",
      )
    } finally {
      saveInFlight.current = false
      setSaving(false)
    }
  }
  const canvasClick = (event: MouseEvent<HTMLDivElement>) => {
    if (saveInFlight.current) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    const target = event.target as Element
    if (!target?.closest) return
    if (target.closest("[data-edit-field], [data-editor-control]")) return
    const interactive = target.closest("a, button")
    if (interactive) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    // Decorative images remain fixed; only registered page media can be replaced.
    if (target.matches("img") && !target.hasAttribute("data-media-key")) return
    const image =
      target.closest("[data-media-key]") ??
      target.closest("section")?.querySelector("[data-media-key]")
    const key = image?.getAttribute("data-media-key")
    if (key && mediaSlots.some((slot) => slot.page === page && slot.key === key)) {
      event.preventDefault()
      event.stopPropagation()
      setSelection({ key, kind: "media", value: "" })
    }
  }
  return (
    <>
      <header className="sticky top-0 z-50 -mx-2.5 mb-2.5 flex flex-wrap items-center justify-between gap-2 bg-[#f6f5f2]/95 px-2.5 py-2 backdrop-blur-sm md:-mx-4 md:px-4">
        <div>
          <h1 className="text-2xl font-semibold">{page === "home" ? "Home" : "About"}</h1>
          <p className="mt-1 text-xs opacity-65">
            {dirty ? "Unsaved changes" : "Published page"} · Click text, buttons, or images to edit.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton kind="secondary" onClick={discard} disabled={saving}>
            {conflict ? "Reload published page" : "Discard changes"}
          </AdminButton>
          <AdminButton
            onClick={publish}
            disabled={saving || Boolean(selection) || !dirty || conflict}
          >
            {saving ? "Saving…" : "Save changes"}
          </AdminButton>
        </div>
      </header>
      {conflict && (
        <p className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm">
          This page has been updated since you opened it. Reload the published page before saving to
          avoid overwriting someone else’s changes.
        </p>
      )}
      <output className="block text-sm empty:hidden" aria-live="polite">
        {message}
      </output>
      <PageContentContext.Provider
        value={{ page, fields, media, editing: true, select: saving ? undefined : select }}
      >
        <PreviewFrame>
          <div
            key={generation}
            inert={saving}
            data-visual-canvas
            className="visual-page-canvas bg-cream font-body"
            onClickCapture={canvasClick}
          >
            {page === "home" ? <HomeContent /> : <AboutContent />}
          </div>
        </PreviewFrame>
      </PageContentContext.Provider>
      {selection && (
        <EditDialog
          key={`${selection.kind}-${selection.key}`}
          selection={selection}
          colors={[
            ...new Set([
              ...sitePalette,
              ...savedColors,
              ...Object.values(fields).filter((value) => normalizeHex(value)),
            ]),
          ]}
          onClose={() => setSelection(null)}
          onApply={(value, href) => {
            setFields((current) => ({
              ...current,
              [selection.key]: value,
              ...(href === undefined ? {} : { [selection.key + ".href"]: href }),
            }))
            setMessage("")
            setSelection(null)
          }}
          onMedia={(item) => {
            setMedia((current) => [
              ...current.filter((existing) => existing.key !== item.key),
              item,
            ])
            setMessage("")
          }}
          draftMedia={media.find((item) => item.key === selection.key)}
        />
      )}
    </>
  )
}

// An iframe gives the preview its own responsive viewport and isolates all page styles.
function PreviewFrame({ children }: { children: ReactNode }) {
  const frame = useRef<HTMLIFrameElement>(null)
  const [target, setTarget] = useState<HTMLElement | null>(null)
  useEffect(() => {
    const doc = frame.current?.contentDocument
    if (!doc) return
    doc.head.innerHTML = ""
    document
      .querySelectorAll('link[rel="stylesheet"], style')
      .forEach((node) => doc.head.appendChild(node.cloneNode(true)))
    doc.body.style.margin = "0"
    const root = doc.createElement("div")
    doc.body.replaceChildren(root)
    setTarget(root)
  }, [])
  return (
    <div className="overflow-hidden rounded-t-xl">
      <iframe
        ref={frame}
        title="Editable page preview"
        className="block h-[80dvh] w-full border-0 bg-cream"
      />
      {target && createPortal(children, target)}
    </div>
  )
}

function EditDialog({
  selection,
  colors,
  onClose,
  onApply,
  onMedia,
  draftMedia,
}: {
  selection: EditSelection
  colors: string[]
  onClose: () => void
  onApply: (value: string, href?: string) => void
  onMedia: (item: DraftMedia) => void
  draftMedia?: DraftMedia
}) {
  const [value, setValue] = useState(selection.value)
  const [href, setHref] = useState(selection.href ?? "")
  const [error, setError] = useState("")
  const [busy, setBusy] = useState(false)
  const uploadMedia = useMediaUpload()
  const publishedMedia = useQuery(api.pageMedia.list, {})
  const slot = mediaSlots.find((item) => item.key === selection.key)
  const current = draftMedia ?? publishedMedia?.find((item) => item.key === selection.key)
  const apply = () => {
    if (selection.kind === "color") {
      const hex = normalizeHex(value)
      if (!hex) {
        setError("Enter a valid hex color, such as #623f49.")
        return
      }
      onApply(hex)
      return
    }
    if (selection.kind === "button" && (!value.trim() || !validPageLink(href))) {
      setError("Enter button text and a valid internal path, HTTPS, email, or telephone link.")
      return
    }
    onApply(value, selection.kind === "button" ? href : undefined)
  }
  return (
    <AdminModal
      title={
        selection.kind === "media"
          ? "Change image or video"
          : selection.kind === "color"
            ? "Section color"
            : selection.kind === "button"
              ? "Edit button"
              : "Edit text"
      }
      onClose={() => {
        if (!busy) onClose()
      }}
    >
      <div className="space-y-4">
        {selection.kind === "media" && slot ? (
          <>
            <p className="text-sm opacity-70">{slot.description}</p>
            {current?.kind === "video" && current.url ? (
              <video
                src={current.url}
                controls
                muted
                playsInline
                className="max-h-72 w-full rounded-xl bg-stone-100 object-contain"
              />
            ) : (
              <Image
                src={current?.url ?? slot.src}
                alt="Current image"
                width={800}
                height={500}
                className="max-h-72 w-full rounded-xl bg-stone-100 object-contain"
              />
            )}
            <p className="text-xs opacity-65">
              Suggested ratio: {slot.ratio}. Images up to {imageLimitMb} MB
              {slot.video ? `; MP4 or WebM videos up to ${videoLimitMb} MB` : ""}.
            </p>
            <label className="block cursor-pointer rounded-xl border border-dashed border-deep-brown/30 bg-white p-4 text-center text-sm">
              <span>
                {busy ? "Uploading…" : slot.video ? "Choose image or video" : "Choose image"}
              </span>
              <input
                type="file"
                aria-label="Choose replacement media"
                className="sr-only"
                accept={slot.video ? "image/*,video/mp4,video/webm" : "image/*"}
                disabled={busy}
                onChange={async (event) => {
                  const file = event.currentTarget.files?.[0]
                  event.currentTarget.value = ""
                  if (!file) return
                  setBusy(true)
                  setError("")
                  try {
                    const uploaded = await uploadMedia(file, slot.video)
                    onMedia({ key: slot.key, ...uploaded })
                    setError("Added to your draft. Use Save changes to publish.")
                  } catch (reason) {
                    setError(
                      reason instanceof Error
                        ? reason.message
                        : "Upload failed. Your previous media is unchanged. Please try again.",
                    )
                  } finally {
                    setBusy(false)
                  }
                }}
              />
            </label>
          </>
        ) : (
          <>
            <label className="grid gap-2 text-sm font-medium">
              {selection.kind === "color"
                ? "Hex color"
                : selection.kind === "button"
                  ? "Button text"
                  : "Text"}
              {selection.kind === "text" ? (
                <textarea
                  className={`${adminInput} min-h-40`}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  maxLength={10000}
                />
              ) : (
                <input
                  className={adminInput}
                  value={value}
                  onChange={(event) => setValue(event.target.value)}
                  maxLength={selection.kind === "color" ? 7 : 10000}
                />
              )}
            </label>
            {selection.kind === "button" && (
              <label className="grid gap-2 text-sm font-medium">
                Link
                <input
                  className={adminInput}
                  value={href}
                  onChange={(event) => setHref(event.target.value)}
                  placeholder="/contact?reason=reservation"
                />
              </label>
            )}
            {selection.kind === "color" && (
              <>
                <div
                  className="h-16 rounded-xl border border-deep-brown/15"
                  style={{ backgroundColor: normalizeHex(value) ?? "transparent" }}
                />
                <p className="text-xs opacity-65">Existing site colors and saved custom colors</p>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => (
                    <button
                      type="button"
                      key={color}
                      aria-label={`Use ${color}`}
                      title={color}
                      className="size-9 cursor-pointer rounded-full border border-black/20 focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{ backgroundColor: color }}
                      onClick={() => setValue(color)}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        )}
        <output className="block text-sm" aria-live="polite">
          {error}
        </output>
        <div className="flex justify-end gap-2">
          <AdminButton kind="secondary" onClick={onClose} disabled={busy}>
            {selection.kind === "media" ? "Done" : "Cancel"}
          </AdminButton>
          {selection.kind !== "media" && <AdminButton onClick={apply}>Apply to draft</AdminButton>}
        </div>
        <p className="text-xs opacity-60">Changes stay unpublished until you click Save changes.</p>
      </div>
    </AdminModal>
  )
}

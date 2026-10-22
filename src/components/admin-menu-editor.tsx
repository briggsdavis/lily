"use client"

import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import type { ChangeEvent, PointerEvent, ReactNode } from "react"
import { useEffect, useMemo, useRef, useState } from "react"
import { AdminButton, AdminModal } from "@/components/admin-ui"
import {
  adminMenuPagesRef,
  generateUploadUrlRef,
  resolveUploadRef,
  saveMenuPageRef,
  setMenuArchivedRef,
  type MenuItemRecord,
  type MenuPageRecord,
  type MenuSectionRecord,
} from "@/lib/admin-api"

const palette = ["espresso", "dark-maroon", "deep-brown"] as const
const paletteLabels: Record<(typeof palette)[number], string> = {
  espresso: "Dark brown",
  "dark-maroon": "Wine",
  "deep-brown": "Maroon",
}
const tones: Record<MenuSectionRecord["backgroundColor"], string> = {
  cream: "bg-cream text-deep-brown",
  mauve: "bg-mauve text-deep-brown",
  espresso: "bg-espresso text-cream",
  "dark-maroon": "bg-dark-maroon text-cream",
  "deep-brown": "bg-deep-brown text-cream",
}

function PlusIcon() {
  return (
    <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
    </svg>
  )
}

function move<T>(values: T[], from: number, to: number) {
  const next = [...values]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

function EditableText({
  ariaLabel,
  className,
  multiline = false,
  onChange,
  placeholder,
  value,
}: {
  ariaLabel: string
  className: string
  multiline?: boolean
  onChange: (value: string) => void
  placeholder: string
  value: string
}) {
  const shared = `${className} w-full resize-none rounded-md border border-transparent bg-transparent px-2 py-1 outline-none hover:border-current/20 focus:border-current/35 focus:bg-white/10`
  return multiline ? (
    <textarea
      aria-label={ariaLabel}
      className={shared}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder={placeholder}
      rows={2}
      value={value}
    />
  ) : (
    <input
      aria-label={ariaLabel}
      className={shared}
      onChange={(event) => onChange(event.currentTarget.value)}
      placeholder={placeholder}
      value={value}
    />
  )
}

function InlineImage({
  children,
  onChange,
}: {
  children: ReactNode
  onChange: (value: string) => void
}) {
  const generateUploadUrl = useMutation(generateUploadUrlRef)
  const resolveUpload = useMutation(resolveUploadRef)
  const [uploading, setUploading] = useState(false)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  async function upload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.currentTarget.files?.[0]
    if (!file || !file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) return
    setUploading(true)
    try {
      const uploadUrl = await generateUploadUrl({})
      const response = await fetch(uploadUrl, {
        body: file,
        headers: { "Content-Type": file.type },
        method: "POST",
      })
      const { storageId } = (await response.json()) as { storageId?: string }
      if (!storageId) throw new Error("Upload failed")
      const url = await resolveUpload({ storageId })
      if (url) onChange(url)
    } finally {
      setUploading(false)
    }
  }
  return (
    <div className="group/image relative h-full overflow-hidden">
      {children}
      <input
        accept="image/*"
        className="sr-only"
        disabled={uploading}
        onChange={upload}
        ref={inputRef}
        type="file"
      />
      <button
        aria-label="Replace image"
        className="absolute inset-0 z-[5] cursor-pointer"
        disabled={uploading}
        onClick={() => {
          if (!inputRef.current) return
          inputRef.current.value = ""
          inputRef.current.click()
        }}
        onPointerEnter={(event) => setCursor({ x: event.clientX, y: event.clientY })}
        onPointerLeave={() => setCursor(null)}
        onPointerMove={(event: PointerEvent<HTMLButtonElement>) =>
          setCursor({ x: event.clientX, y: event.clientY })
        }
        type="button"
      />
      {cursor ? (
        <span
          className="pointer-events-none fixed z-110 rounded-full bg-black/80 px-3 py-1.5 text-xs font-semibold text-white shadow-lg"
          style={{ left: cursor.x + 14, top: cursor.y + 14 }}
        >
          {uploading ? "Uploading…" : "Click to Replace"}
        </span>
      ) : null}
    </div>
  )
}

export function AdminMenuEditor({ id }: { id?: string }) {
  const router = useRouter()
  const pages = useQuery(adminMenuPagesRef, { archived: false })
  const existing = useMemo(() => pages?.find((page) => page._id === id), [id, pages])
  const [page, setPage] = useState<MenuPageRecord | null>(null)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const [addingSection, setAddingSection] = useState(false)
  const [newSection, setNewSection] = useState<{
    backgroundColor: (typeof palette)[number]
    imageSide: "left" | "right"
  }>({ backgroundColor: "espresso", imageSide: "left" })
  const save = useMutation(saveMenuPageRef)
  const archive = useMutation(setMenuArchivedRef)

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    if (existing) setPage(existing)
  }, [existing])

  const patchSection = (index: number, patch: Partial<MenuSectionRecord>) =>
    setPage((current) =>
      current
        ? {
            ...current,
            sections: current.sections.map((section, position) =>
              position === index ? { ...section, ...patch } : section,
            ),
          }
        : current,
    )
  const patchItem = (sectionIndex: number, itemIndex: number, patch: Partial<MenuItemRecord>) => {
    if (!page) return
    patchSection(sectionIndex, {
      items: page.sections[sectionIndex].items.map((item, index) =>
        index === itemIndex ? { ...item, ...patch } : item,
      ),
    })
  }

  async function submit() {
    if (!page) return
    setSaving(true)
    setNotice("")
    try {
      const { _id, updatedAt: _updatedAt, ...value } = page
      await save({
        ...value,
        heroImageAlt: value.title,
        id: _id,
        sections: value.sections.map((section) => ({ ...section, imageAlt: section.title })),
      })
      setNotice("Saved. These changes are now live.")
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save this menu page.")
    } finally {
      setSaving(false)
    }
  }

  function addSection() {
    if (!page) return
    setPage({
      ...page,
      sections: [
        ...page.sections,
        {
          backgroundColor: newSection.backgroundColor,
          image: "",
          imageAlt: "",
          imageSide: newSection.imageSide,
          items: [],
          key: crypto.randomUUID(),
          title: "New section",
        },
      ],
    })
    setAddingSection(false)
  }

  if (id && pages && !existing) return <p>That menu page could not be found.</p>
  if (!page) return <p>Loading menu editor…</p>

  return (
    <div>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{page.title || "Menu page"}</h1>
          <p className="mt-1 text-sm text-deep-brown/60">
            Click any text or image below to edit it directly.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <AdminButton disabled={saving} onClick={submit}>
            {saving ? "Saving…" : "Save changes"}
          </AdminButton>
          <AdminButton
            kind="danger"
            onClick={async () => {
              await archive({ archived: true, id: page._id })
              router.push("/admin")
            }}
          >
            Move to archive
          </AdminButton>
        </div>
      </header>
      {notice ? (
        <p
          aria-live="polite"
          className="mb-5 rounded-xl border border-deep-brown/10 bg-white px-4 py-3 text-sm shadow-sm"
        >
          {notice}
        </p>
      ) : null}

      <div className="overflow-hidden rounded-3xl border border-deep-brown/10 bg-white shadow-xl shadow-deep-brown/5">
        <section className="relative min-h-[25rem] text-cream">
          <InlineImage onChange={(heroImage) => setPage({ ...page, heroImage })}>
            <div
              className="absolute inset-0 bg-dark-maroon bg-cover bg-center"
              style={{
                backgroundImage: page.heroImage
                  ? `linear-gradient(#32151a66,#32151a99),url(${page.heroImage})`
                  : undefined,
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
              }}
            />
            <div className="pointer-events-none relative z-10 flex min-h-[25rem] items-center justify-center p-8 text-center md:p-14">
              <div className="pointer-events-auto flex w-full max-w-3xl flex-col items-center">
                <EditableText
                  ariaLabel="Page title"
                  className="text-center font-display text-5xl font-medium tracking-[0.03em] uppercase md:text-7xl"
                  onChange={(title) => setPage({ ...page, title })}
                  placeholder="Menu title"
                  value={page.title}
                />
                <EditableText
                  ariaLabel="Hero description"
                  className="mt-3 max-w-[56ch] text-center text-base leading-relaxed md:text-lg"
                  multiline
                  onChange={(description) => setPage({ ...page, description })}
                  placeholder="Menu description"
                  value={page.description}
                />
              </div>
            </div>
          </InlineImage>
        </section>

        {page.sections.map((section, sectionIndex) => (
          <section
            className={`relative grid min-h-[30rem] md:grid-cols-2 ${tones[section.backgroundColor]}`}
            key={section.key}
          >
            <div
              className={`min-h-72 md:min-h-full ${section.imageSide === "right" ? "md:order-2" : ""}`}
            >
              <InlineImage onChange={(image) => patchSection(sectionIndex, { image })}>
                <div
                  className="h-full min-h-72 bg-cover bg-center"
                  style={{
                    backgroundImage: section.image
                      ? `url(${section.image})`
                      : "linear-gradient(135deg,#d8c8ba,#8f7064)",
                  }}
                />
              </InlineImage>
            </div>
            <div className="flex flex-col justify-center p-7 md:p-12 lg:p-16">
              <EditableText
                ariaLabel="Section title"
                className="font-display text-4xl font-medium md:text-5xl"
                onChange={(title) => patchSection(sectionIndex, { title })}
                placeholder="Section title"
                value={section.title}
              />
              <div className="mt-8 grid gap-5">
                {section.items.map((item, itemIndex) => (
                  <div
                    className="group/item relative border-b border-current/15 pb-5"
                    key={item.key}
                  >
                    <div className="grid grid-cols-[1fr_6rem] gap-3">
                      <EditableText
                        ariaLabel="Item title"
                        className="font-semibold"
                        onChange={(title) => patchItem(sectionIndex, itemIndex, { title })}
                        placeholder="Menu item"
                        value={item.title}
                      />
                      <EditableText
                        ariaLabel="Item price"
                        className="text-right font-semibold"
                        onChange={(price) => patchItem(sectionIndex, itemIndex, { price })}
                        placeholder="$0"
                        value={item.price}
                      />
                    </div>
                    <EditableText
                      ariaLabel="Item description"
                      className="mt-1 text-sm leading-relaxed opacity-75"
                      multiline
                      onChange={(description) =>
                        patchItem(sectionIndex, itemIndex, { description })
                      }
                      placeholder="Item description"
                      value={item.description}
                    />
                    <div className="absolute -top-9 -right-1 flex gap-1 opacity-0 group-focus-within/item:opacity-100 group-hover/item:opacity-100">
                      <button
                        aria-label="Move item up"
                        className="grid size-7 cursor-pointer place-items-center rounded-full bg-white text-xs text-deep-brown shadow disabled:cursor-not-allowed disabled:opacity-35"
                        disabled={itemIndex === 0}
                        onClick={() =>
                          patchSection(sectionIndex, {
                            items: move(section.items, itemIndex, itemIndex - 1),
                          })
                        }
                        type="button"
                      >
                        ↑
                      </button>
                      <button
                        aria-label="Move item down"
                        className="grid size-7 cursor-pointer place-items-center rounded-full bg-white text-xs text-deep-brown shadow disabled:cursor-not-allowed disabled:opacity-35"
                        disabled={itemIndex === section.items.length - 1}
                        onClick={() =>
                          patchSection(sectionIndex, {
                            items: move(section.items, itemIndex, itemIndex + 1),
                          })
                        }
                        type="button"
                      >
                        ↓
                      </button>
                      <button
                        aria-label="Delete item"
                        className="grid size-7 cursor-pointer place-items-center rounded-full bg-white text-xs text-red-700 shadow"
                        onClick={() =>
                          patchSection(sectionIndex, {
                            items: section.items.filter((_, index) => index !== itemIndex),
                          })
                        }
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  aria-label={`Add item to ${section.title}`}
                  className="grid size-9 cursor-pointer place-items-center rounded-full border border-dashed border-current/35 opacity-70 transition-[transform,opacity] hover:scale-105 hover:opacity-100"
                  onClick={() =>
                    patchSection(sectionIndex, {
                      items: [
                        ...section.items,
                        { description: "", key: crypto.randomUUID(), price: "", title: "" },
                      ],
                    })
                  }
                  type="button"
                >
                  <PlusIcon />
                </button>
              </div>
            </div>
            <div className="absolute top-4 right-4 flex flex-wrap items-center gap-1 rounded-xl bg-white/95 p-1.5 text-deep-brown shadow-lg">
              <select
                aria-label="Section background"
                className="h-8 rounded-lg border-0 bg-stone-100 px-2 text-xs outline-none"
                onChange={(event) =>
                  patchSection(sectionIndex, {
                    backgroundColor: event.currentTarget
                      .value as MenuSectionRecord["backgroundColor"],
                  })
                }
                value={section.backgroundColor}
              >
                {palette.map((color) => (
                  <option key={color} value={color}>
                    {paletteLabels[color]}
                  </option>
                ))}
              </select>
              <button
                aria-label="Move section up"
                className="grid size-8 cursor-pointer place-items-center rounded-lg hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-35"
                disabled={sectionIndex === 0}
                onClick={() =>
                  setPage({
                    ...page,
                    sections: move(page.sections, sectionIndex, sectionIndex - 1),
                  })
                }
                type="button"
              >
                ↑
              </button>
              <button
                aria-label="Move section down"
                className="grid size-8 cursor-pointer place-items-center rounded-lg hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-35"
                disabled={sectionIndex === page.sections.length - 1}
                onClick={() =>
                  setPage({
                    ...page,
                    sections: move(page.sections, sectionIndex, sectionIndex + 1),
                  })
                }
                type="button"
              >
                ↓
              </button>
              <button
                aria-label="Delete section"
                className="grid size-8 cursor-pointer place-items-center rounded-lg text-red-700 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-35"
                disabled={page.sections.length === 1}
                onClick={() =>
                  setPage({
                    ...page,
                    sections: page.sections.filter((_, index) => index !== sectionIndex),
                  })
                }
                type="button"
              >
                ×
              </button>
            </div>
          </section>
        ))}
        <div className="grid place-items-center bg-white py-8">
          <button
            aria-label="Add menu section"
            className="grid size-11 cursor-pointer place-items-center rounded-full border border-dashed border-deep-brown/30 text-deep-brown/60 transition-[transform,color,border-color] hover:scale-105 hover:border-deep-brown hover:text-deep-brown"
            onClick={() => setAddingSection(true)}
            type="button"
          >
            <PlusIcon />
          </button>
        </div>
      </div>

      {addingSection ? (
        <AdminModal onClose={() => setAddingSection(false)} title="Add a menu section">
          <p className="mb-5 text-sm text-deep-brown/60">
            Choose the image position and section color. You can edit the content directly after
            adding it.
          </p>
          <h3 className="mb-3 text-sm font-semibold">Image position</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {(["left", "right"] as const).map((side) => (
              <button
                aria-pressed={newSection.imageSide === side}
                className="cursor-pointer rounded-2xl border border-deep-brown/15 bg-white p-5 text-left shadow-sm hover:border-deep-brown/35 aria-pressed:border-deep-brown aria-pressed:bg-deep-brown/5"
                key={side}
                onClick={() => setNewSection({ ...newSection, imageSide: side })}
                type="button"
              >
                <span className="mb-4 grid grid-cols-2 overflow-hidden rounded-xl border border-deep-brown/10">
                  {side === "left" ? (
                    <>
                      <span className="h-24 bg-deep-brown/25" />
                      <span className="h-24 bg-stone-50" />
                    </>
                  ) : (
                    <>
                      <span className="h-24 bg-stone-50" />
                      <span className="h-24 bg-deep-brown/25" />
                    </>
                  )}
                </span>
                <strong className="text-sm">Image on the {side}</strong>
              </button>
            ))}
          </div>
          <h3 className="mt-6 mb-3 text-sm font-semibold">Background color</h3>
          <div className="grid gap-3 sm:grid-cols-3">
            {palette.map((color) => (
              <button
                aria-pressed={newSection.backgroundColor === color}
                className="cursor-pointer rounded-2xl border border-deep-brown/15 bg-white p-3 text-left shadow-sm hover:border-deep-brown/35 aria-pressed:border-deep-brown aria-pressed:ring-2 aria-pressed:ring-deep-brown/15"
                key={color}
                onClick={() => setNewSection({ ...newSection, backgroundColor: color })}
                type="button"
              >
                <span className={`mb-3 block h-16 rounded-xl ${tones[color]}`} />
                <span className="text-sm font-semibold">{paletteLabels[color]}</span>
              </button>
            ))}
          </div>
          <div className="mt-7 flex justify-end gap-2">
            <AdminButton kind="secondary" onClick={() => setAddingSection(false)}>
              Cancel
            </AdminButton>
            <AdminButton onClick={addSection}>Add section</AdminButton>
          </div>
        </AdminModal>
      ) : null}
    </div>
  )
}

"use client"

import { useMutation } from "convex/react"
import type { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react"
import { useCallback, useState } from "react"
import { generateUploadUrlRef, resolveUploadRef } from "@/lib/admin-api"

export const adminInput =
  "min-h-11 w-full border border-deep-brown/25 bg-white/30 px-3 py-2 text-sm outline-none focus:border-wine focus:ring-1 focus:ring-wine"

export function AdminHeader({
  eyebrow,
  title,
  actions,
}: {
  actions?: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <header className="mb-9 flex flex-col gap-5 border-b border-deep-brown/15 pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <p className="eyebrow text-wine">{eyebrow}</p>
        <h1 className="mt-2 font-display text-5xl font-medium md:text-6xl">{title}</h1>
      </div>
      {actions}
    </header>
  )
}

export function AdminButton({
  children,
  kind = "primary",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "secondary" | "danger" }) {
  const tone =
    kind === "primary"
      ? "border-wine bg-wine text-cream hover:bg-dark-maroon"
      : kind === "danger"
        ? "border-red-800/40 text-red-900 hover:bg-red-900 hover:text-cream"
        : "border-deep-brown/30 hover:border-wine hover:bg-wine/5"
  return (
    <button
      className={`min-h-11 border px-4 text-sm font-bold ${tone} disabled:cursor-wait disabled:opacity-45`}
      {...props}
    >
      {children}
    </button>
  )
}

export function ImageField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: string) => void
  value: string
}) {
  const generateUploadUrl = useMutation(generateUploadUrlRef)
  const resolveUpload = useMutation(resolveUploadRef)
  const [uploading, setUploading] = useState(false)
  const upload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files?.[0]
      if (!file) return
      if (!file.type.startsWith("image/") || file.size > 8 * 1024 * 1024) return
      setUploading(true)
      try {
        const uploadUrl = await generateUploadUrl({})
        const response = await fetch(uploadUrl, {
          body: file,
          headers: { "Content-Type": file.type },
          method: "POST",
        })
        const payload = (await response.json()) as { storageId?: string }
        if (!payload.storageId) throw new Error("Upload failed")
        const url = await resolveUpload({ storageId: payload.storageId })
        if (url) onChange(url)
      } finally {
        setUploading(false)
      }
    },
    [generateUploadUrl, onChange, resolveUpload],
  )

  return (
    <label className="grid gap-2">
      <span className="text-xs font-bold text-wine uppercase">{label}</span>
      {value ? (
        <span
          className="block h-28 bg-cover bg-center"
          style={{ backgroundImage: `url(${value})` }}
        />
      ) : null}
      <span className="grid min-h-11 cursor-pointer place-items-center border border-dashed border-deep-brown/35 px-3 text-sm hover:border-wine hover:bg-wine/5">
        <input
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={upload}
          type="file"
        />
        {uploading ? "Uploading…" : value ? "Replace image" : "Choose image"}
      </span>
      <input
        className={adminInput}
        onChange={(event) => onChange(event.currentTarget.value)}
        placeholder="Or paste an image URL/path"
        type="text"
        value={value}
      />
    </label>
  )
}

export function AdminModal({
  children,
  onClose,
  title,
}: {
  children: ReactNode
  onClose: () => void
  title: string
}) {
  return (
    <dialog
      aria-labelledby="admin-modal-title"
      className="fixed inset-0 z-100 m-0 grid h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-dark-maroon/65 p-4 text-deep-brown backdrop-blur-sm"
      open
    >
      <button
        aria-label="Close dialog"
        className="fixed inset-0 cursor-default"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section className="relative z-10 m-auto w-full max-w-3xl border border-deep-brown/20 bg-cream p-5 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-6">
          <h2 className="font-display text-3xl" id="admin-modal-title">
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            className="grid size-10 place-items-center border border-deep-brown/25 hover:bg-wine hover:text-cream"
            onClick={onClose}
            type="button"
          >
            ×
          </button>
        </div>
        {children}
      </section>
    </dialog>
  )
}

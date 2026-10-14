"use client"

import { useMutation } from "convex/react"
import type { ButtonHTMLAttributes, ChangeEvent, ReactNode } from "react"
import { useCallback, useState } from "react"
import { generateUploadUrlRef, resolveUploadRef } from "@/lib/admin-api"

export const adminInput =
  "min-h-11 w-full rounded-xl border border-deep-brown/15 bg-white px-3.5 py-2.5 text-sm shadow-sm outline-none transition-[border-color,box-shadow] focus:border-deep-brown/45 focus:ring-4 focus:ring-deep-brown/8"

export function AdminHeader({
  eyebrow: _eyebrow,
  title,
  actions,
}: {
  actions?: ReactNode
  eyebrow: string
  title: string
}) {
  return (
    <header className="mb-8 flex flex-col gap-5 border-b border-deep-brown/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-deep-brown md:text-4xl">
          {title}
        </h1>
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
      ? "border-deep-brown bg-deep-brown text-white hover:bg-deep-brown/90"
      : kind === "danger"
        ? "border-red-200 bg-white text-red-800 hover:bg-red-50"
        : "border-deep-brown/15 bg-white hover:border-deep-brown/30 hover:bg-stone-50"
  return (
    <button
      className={`min-h-11 rounded-xl border px-4 text-sm font-semibold shadow-sm transition-colors ${tone} disabled:cursor-wait disabled:opacity-45`}
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
      <span className="text-sm font-medium text-deep-brown">{label}</span>
      {value ? (
        <span
          className="block h-32 rounded-xl bg-cover bg-center shadow-sm"
          style={{ backgroundImage: `url(${value})` }}
        />
      ) : null}
      <span className="grid min-h-11 cursor-pointer place-items-center rounded-xl border border-dashed border-deep-brown/25 bg-white px-3 text-sm font-medium shadow-sm transition-colors hover:border-deep-brown/45 hover:bg-stone-50">
        <input
          accept="image/*"
          className="sr-only"
          disabled={uploading}
          onChange={upload}
          type="file"
        />
        {uploading ? "Uploading…" : value ? "Replace image" : "Choose image"}
      </span>
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
      className="fixed inset-0 z-100 m-0 grid h-full max-h-none w-full max-w-none overflow-y-auto border-0 bg-deep-brown/55 p-4 text-deep-brown backdrop-blur-sm"
      open
    >
      <button
        aria-label="Close dialog"
        className="fixed inset-0 cursor-default"
        onClick={onClose}
        tabIndex={-1}
        type="button"
      />
      <section className="relative z-10 m-auto w-full max-w-3xl rounded-3xl border border-white/50 bg-[#f8f7f4] p-5 shadow-2xl md:p-8">
        <div className="mb-6 flex items-start justify-between gap-6">
          <h2 className="text-2xl font-semibold tracking-tight" id="admin-modal-title">
            {title}
          </h2>
          <button
            aria-label="Close dialog"
            className="grid size-10 place-items-center rounded-full border border-deep-brown/15 bg-white text-xl shadow-sm hover:bg-stone-100"
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

"use client"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { setVisibilityRef, visibilityRef } from "@/lib/page-visibility"

export function AdminPageToggle({ path, label }: { path: string; label: string }) {
  const disabled = useQuery(visibilityRef, {})
  const save = useMutation(setVisibilityRef)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  const enabled = !disabled?.includes(path)
  return (
    <div className="shrink-0 px-2">
      <button
        type="button"
        role="switch"
        aria-checked={enabled}
        aria-label={`${label} page links`}
        title={`${enabled ? "Disable" : "Enable"} ${label} page links`}
        disabled={busy || disabled === undefined}
        onClick={async () => {
          setBusy(true)
          setError("")
          try {
            await save({ path, enabled: !enabled })
          } catch {
            setError("Could not save page visibility. Please try again.")
          } finally {
            setBusy(false)
          }
        }}
        className={`flex h-5 w-9 items-center rounded-full p-0.5 transition-colors disabled:opacity-50 ${enabled ? "bg-pink" : "bg-white/20"}`}
      >
        <span
          className={`size-4 rounded-full bg-white transition-transform ${enabled ? "translate-x-4" : "translate-x-0"}`}
        />
      </button>
      {error && (
        <p role="alert" className="max-w-32 text-xs text-pink">
          {error}
        </p>
      )}
    </div>
  )
}

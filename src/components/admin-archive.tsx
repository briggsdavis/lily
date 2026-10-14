"use client"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { AdminButton, AdminHeader } from "@/components/admin-ui"
import {
  adminEventsRef,
  adminMenuPagesRef,
  clearArchiveRef,
  listCateringRef,
  listContactRef,
  setCateringStateRef,
  setContactStateRef,
  setEventArchivedRef,
  setMenuArchivedRef,
} from "@/lib/admin-api"

type Collection = "menu" | "events" | "contact" | "catering"

export function AdminArchive() {
  const [collection, setCollection] = useState<Collection>("menu")
  const menus = useQuery(adminMenuPagesRef, { archived: true })
  const events = useQuery(adminEventsRef, { archived: true })
  const contacts = useQuery(listContactRef, { archived: true })
  const catering = useQuery(listCateringRef, { archived: true })
  const restoreMenu = useMutation(setMenuArchivedRef)
  const restoreEvent = useMutation(setEventArchivedRef)
  const restoreContact = useMutation(setContactStateRef)
  const restoreCatering = useMutation(setCateringStateRef)
  const clearArchive = useMutation(clearArchiveRef)
  const rows =
    collection === "menu"
      ? menus
      : collection === "events"
        ? events
        : collection === "contact"
          ? contacts
          : catering

  const label = (row: NonNullable<typeof rows>[number]) =>
    "fullName" in row ? row.fullName : "name" in row ? row.name : row.title
  async function restore(id: string) {
    if (collection === "menu") await restoreMenu({ archived: false, id })
    else if (collection === "events") await restoreEvent({ archived: false, id })
    else if (collection === "contact") await restoreContact({ archived: false, id })
    else await restoreCatering({ archived: false, id })
  }
  async function clear() {
    if (
      !rows?.length ||
      !window.confirm(
        `Permanently delete all ${rows.length} archived ${collection} records? This cannot be undone.`,
      )
    )
      return
    await clearArchive({ collection })
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Recovery"
        title="Archive"
        actions={
          <AdminButton disabled={!rows?.length} kind="danger" onClick={clear}>
            Clear this archive
          </AdminButton>
        }
      />
      <div className="mb-6 flex flex-wrap gap-2">
        {(["menu", "events", "contact", "catering"] as const).map((item) => (
          <button
            className={`min-h-11 border px-4 text-sm font-bold capitalize ${collection === item ? "border-wine bg-wine text-cream" : "border-deep-brown/25 hover:border-wine"}`}
            key={item}
            onClick={() => setCollection(item)}
            type="button"
          >
            {item}
          </button>
        ))}
      </div>
      <div className="grid gap-3">
        {rows?.map((row) => (
          <article
            className="flex flex-wrap items-center justify-between gap-4 border border-deep-brown/15 bg-white/20 p-5"
            key={row._id}
          >
            <div>
              <h2 className="font-display text-2xl">{label(row)}</h2>
              <p className="mt-1 text-xs uppercase opacity-60">
                Archived {collection.slice(0, -1) || collection}
              </p>
            </div>
            <AdminButton kind="secondary" onClick={() => restore(row._id)}>
              Restore
            </AdminButton>
          </article>
        ))}
        {rows?.length === 0 ? (
          <div className="border border-dashed border-deep-brown/25 p-10 text-center">
            <p className="font-display text-3xl">Nothing archived</p>
            <p className="mt-2 text-sm opacity-65">
              Deleted items remain recoverable here until the archive is cleared.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  )
}

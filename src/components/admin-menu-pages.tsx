"use client"

import { useMutation, useQuery } from "convex/react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { AdminButton, AdminHeader } from "@/components/admin-ui"
import {
  adminMenuPagesRef,
  reorderMenuPagesRef,
  setMenuArchivedRef,
  type MenuPageRecord,
} from "@/lib/admin-api"

function move<T>(items: T[], from: number, to: number) {
  const next = [...items]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function AdminMenuPages() {
  const pages = useQuery(adminMenuPagesRef, { archived: false })
  const reorder = useMutation(reorderMenuPagesRef)
  const archive = useMutation(setMenuArchivedRef)
  const [ordered, setOrdered] = useState<MenuPageRecord[]>([])
  useEffect(() => {
    // The server list is the source of truth after a save, restore, or archive action.
    // oxlint-disable-next-line react/set-state-in-effect
    if (pages) setOrdered(pages)
  }, [pages])
  async function shift(index: number, offset: number) {
    const next = move(ordered, index, index + offset)
    setOrdered(next)
    await reorder({ ids: next.map((page) => page._id) })
  }
  return (
    <div>
      <AdminHeader
        eyebrow="Menu editor"
        title="Menu pages"
        actions={
          <Link
            className="inline-flex min-h-11 items-center border border-wine bg-wine px-4 text-sm font-bold text-cream hover:bg-dark-maroon"
            href="/admin/menu/new"
          >
            Add menu page
          </Link>
        }
      />
      <p className="mb-6 max-w-2xl text-sm opacity-70">
        This order is used in the public menu navigation. Changes are saved immediately.
      </p>
      <div className="grid gap-3">
        {ordered.map((page, index) => (
          <article
            className="grid gap-4 border border-deep-brown/15 bg-white/20 p-5 sm:grid-cols-[1fr_auto] sm:items-center"
            key={page._id}
          >
            <div>
              <h2 className="font-display text-3xl">{page.title}</h2>
              <p className="mt-1 text-sm opacity-60">/menu/{page.slug}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <AdminButton disabled={index === 0} kind="secondary" onClick={() => shift(index, -1)}>
                ↑
              </AdminButton>
              <AdminButton
                disabled={index === ordered.length - 1}
                kind="secondary"
                onClick={() => shift(index, 1)}
              >
                ↓
              </AdminButton>
              <Link
                className="inline-flex min-h-11 items-center border border-deep-brown/30 px-4 text-sm font-bold hover:border-wine hover:bg-wine/5"
                href={`/admin/menu/${page._id}`}
              >
                Edit
              </Link>
              <AdminButton kind="danger" onClick={() => archive({ archived: true, id: page._id })}>
                Archive
              </AdminButton>
            </div>
          </article>
        ))}
        {ordered.length === 0 ? (
          <p className="border border-dashed border-deep-brown/25 p-10 text-center">
            No menu pages yet.
          </p>
        ) : null}
      </div>
    </div>
  )
}

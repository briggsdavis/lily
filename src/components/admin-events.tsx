"use client"

import { useMutation, useQuery } from "convex/react"
import { useState } from "react"
import { AdminButton, AdminHeader, AdminModal, ImageField, adminInput } from "@/components/admin-ui"
import {
  adminEventsRef,
  saveEventRef,
  setEventArchivedRef,
  type EventRecord,
} from "@/lib/admin-api"

type EditableEvent = Omit<EventRecord, "_id" | "updatedAt">
const blankEvent = (): EditableEvent => ({
  active: true,
  archived: false,
  date: "",
  description: "",
  leftImage: "",
  leftImageAlt: "",
  recurrence: "none",
  rightImage: "",
  rightImageAlt: "",
  time: "",
  title: "",
})

export function AdminEvents() {
  const events = useQuery(adminEventsRef, { archived: false })
  const save = useMutation(saveEventRef)
  const archive = useMutation(setEventArchivedRef)
  const [editing, setEditing] = useState<(EditableEvent & { _id?: string }) | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  async function submit() {
    if (!editing) return
    setSaving(true)
    setError("")
    try {
      const { _id, ...value } = editing
      await save({ ...value, id: _id })
      setEditing(null)
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Unable to save the event.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <AdminHeader
        eyebrow="Content"
        title="Events"
        actions={<AdminButton onClick={() => setEditing(blankEvent())}>Create event</AdminButton>}
      />
      <div className="grid gap-3">
        {events === undefined ? (
          <p>Loading events…</p>
        ) : events.length === 0 ? (
          <div className="border border-dashed border-deep-brown/25 p-10 text-center">
            <p className="font-display text-3xl">No events yet</p>
            <p className="mt-2 text-sm opacity-70">
              Create the first event to add it to the public calendar.
            </p>
          </div>
        ) : (
          events.map((event) => (
            <article
              className="grid gap-4 border border-deep-brown/15 bg-white/20 p-5 sm:grid-cols-[100px_1fr_auto] sm:items-center"
              key={event._id}
            >
              <div className="grid size-20 place-items-center bg-wine text-center text-cream">
                <span className="text-xs uppercase">
                  {event.date
                    ? new Date(`${event.date}T12:00:00`).toLocaleDateString(undefined, {
                        month: "short",
                      })
                    : "Date"}
                </span>
                <strong className="font-display text-3xl">
                  {event.date ? Number(event.date.slice(-2)) : "—"}
                </strong>
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="font-display text-2xl">{event.title}</h2>
                  <span
                    className={`px-2 py-1 text-[10px] font-bold uppercase ${event.active ? "bg-green-800 text-white" : "bg-deep-brown/10"}`}
                  >
                    {event.active ? "Active" : "Inactive"}
                  </span>
                  {event.recurrence !== "none" ? (
                    <span className="bg-mauve/60 px-2 py-1 text-[10px] font-bold uppercase">
                      {event.recurrence}
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 line-clamp-2 text-sm opacity-70">{event.description}</p>
              </div>
              <div className="flex gap-2">
                <AdminButton kind="secondary" onClick={() => setEditing(event)}>
                  Edit
                </AdminButton>
                <AdminButton
                  kind="danger"
                  onClick={() => archive({ archived: true, id: event._id })}
                >
                  Archive
                </AdminButton>
              </div>
            </article>
          ))
        )}
      </div>
      {editing ? (
        <AdminModal
          onClose={() => setEditing(null)}
          title={editing._id ? "Edit event" : "Create event"}
        >
          <div className="grid gap-5">
            <label className="grid gap-2">
              <span className="text-xs font-bold text-wine uppercase">Title</span>
              <input
                className={adminInput}
                onChange={(e) => setEditing({ ...editing, title: e.currentTarget.value })}
                value={editing.title}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold text-wine uppercase">Description</span>
              <textarea
                className={`${adminInput} min-h-28`}
                onChange={(e) => setEditing({ ...editing, description: e.currentTarget.value })}
                value={editing.description}
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-3">
              <label className="grid gap-2">
                <span className="text-xs font-bold text-wine uppercase">Date</span>
                <input
                  className={adminInput}
                  onChange={(e) => setEditing({ ...editing, date: e.currentTarget.value })}
                  type="date"
                  value={editing.date}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-bold text-wine uppercase">Time</span>
                <input
                  className={adminInput}
                  onChange={(e) => setEditing({ ...editing, time: e.currentTarget.value })}
                  type="time"
                  value={editing.time}
                />
              </label>
              <label className="grid gap-2">
                <span className="text-xs font-bold text-wine uppercase">Repeats</span>
                <select
                  className={adminInput}
                  onChange={(e) =>
                    setEditing({
                      ...editing,
                      recurrence: e.currentTarget.value as EditableEvent["recurrence"],
                    })
                  }
                  value={editing.recurrence}
                >
                  <option value="none">One-off</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </label>
            </div>
            <label className="flex min-h-11 items-center gap-3 border border-deep-brown/20 px-3">
              <input
                checked={editing.active}
                onChange={(e) => setEditing({ ...editing, active: e.currentTarget.checked })}
                type="checkbox"
              />{" "}
              Active and visible on the site
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="grid gap-3">
                <ImageField
                  label="Left hover image"
                  onChange={(leftImage) => setEditing({ ...editing, leftImage })}
                  value={editing.leftImage}
                />
                <input
                  aria-label="Left image description"
                  className={adminInput}
                  onChange={(e) => setEditing({ ...editing, leftImageAlt: e.currentTarget.value })}
                  placeholder="Image description"
                  value={editing.leftImageAlt}
                />
              </div>
              <div className="grid gap-3">
                <ImageField
                  label="Right hover image"
                  onChange={(rightImage) => setEditing({ ...editing, rightImage })}
                  value={editing.rightImage}
                />
                <input
                  aria-label="Right image description"
                  className={adminInput}
                  onChange={(e) => setEditing({ ...editing, rightImageAlt: e.currentTarget.value })}
                  placeholder="Image description"
                  value={editing.rightImageAlt}
                />
              </div>
            </div>
            <div className="grid gap-3 border-t border-deep-brown/15 pt-5">
              <p className="text-xs font-bold text-wine uppercase">Optional button</p>
              <input
                className={adminInput}
                onChange={(e) =>
                  setEditing({ ...editing, buttonLabel: e.currentTarget.value || undefined })
                }
                placeholder="Button label"
                value={editing.buttonLabel ?? ""}
              />
              <input
                className={adminInput}
                onChange={(e) =>
                  setEditing({ ...editing, buttonLink: e.currentTarget.value || undefined })
                }
                placeholder="Button link"
                value={editing.buttonLink ?? ""}
              />
            </div>
            {error ? <p className="text-sm text-red-800">{error}</p> : null}
            <div className="flex justify-end gap-2">
              <AdminButton kind="secondary" onClick={() => setEditing(null)}>
                Cancel
              </AdminButton>
              <AdminButton disabled={saving} onClick={submit}>
                {saving ? "Saving…" : "Save event"}
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      ) : null}
    </div>
  )
}

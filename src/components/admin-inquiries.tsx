"use client"

import { useMutation, useQuery } from "convex/react"
import { useMemo, useState } from "react"
import { AdminButton, AdminHeader, AdminModal, adminInput } from "@/components/admin-ui"
import {
  listCateringRef,
  listContactRef,
  setCateringStateRef,
  setContactStateRef,
  type CateringInquiry,
  type ContactInquiry,
} from "@/lib/admin-api"

type Kind = "contact" | "catering"
type Inquiry = ContactInquiry | CateringInquiry

export function AdminInquiries({ kind }: { kind: Kind }) {
  const contact = useQuery(listContactRef, kind === "contact" ? { archived: false } : "skip")
  const catering = useQuery(listCateringRef, kind === "catering" ? { archived: false } : "skip")
  const setContact = useMutation(setContactStateRef)
  const setCatering = useMutation(setCateringStateRef)
  const [query, setQuery] = useState("")
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all")
  const [selected, setSelected] = useState<Inquiry | null>(null)
  const entries = (kind === "contact" ? contact : catering) as Inquiry[] | undefined
  const filtered = useMemo(
    () =>
      entries?.filter((entry) => {
        const matchesState = filter === "all" || (filter === "read" ? entry.read : !entry.read)
        const text = JSON.stringify(entry).toLowerCase()
        return matchesState && text.includes(query.toLowerCase())
      }),
    [entries, filter, query],
  )
  const setState = (id: string, state: { archived?: boolean; read?: boolean }) =>
    kind === "contact" ? setContact({ id, ...state }) : setCatering({ id, ...state })
  const name = (entry: Inquiry) => ("fullName" in entry ? entry.fullName : entry.name)

  return (
    <div>
      <AdminHeader
        eyebrow="Inbox"
        title={kind === "contact" ? "Contact inquiries" : "Catering inquiries"}
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-[1fr_180px]">
        <label>
          <span className="sr-only">Search</span>
          <input
            className={adminInput}
            onChange={(e) => setQuery(e.currentTarget.value)}
            placeholder="Search name, email, or details…"
            type="search"
            value={query}
          />
        </label>
        <label className="relative">
          <span className="sr-only">Read status</span>
          <select
            className={`${adminInput} appearance-none pr-11`}
            onChange={(e) => setFilter(e.currentTarget.value as typeof filter)}
            value={filter}
          >
            <option value="all">All inquiries</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
          </select>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-deep-brown/55"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path d="m7 10 5 5 5-5" stroke="currentColor" strokeLinecap="round" strokeWidth="2" />
          </svg>
        </label>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-deep-brown/10 bg-white shadow-sm">
        <table className="w-full min-w-180 border-collapse text-left">
          <thead className="bg-deep-brown text-xs text-white">
            <tr>
              <th className="p-4">Status</th>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Received</th>
              <th className="p-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered?.map((entry) => (
              <tr
                className={`border-t border-deep-brown/10 ${entry.read ? "bg-white" : "bg-stone-50 font-semibold"}`}
                key={entry._id}
              >
                <td className="p-4">
                  <span
                    className={`inline-flex size-2 rounded-full ${entry.read ? "bg-deep-brown/30" : "bg-wine"}`}
                  />{" "}
                  <span className="ml-2 text-xs uppercase">{entry.read ? "Read" : "New"}</span>
                </td>
                <td className="p-4">{name(entry)}</td>
                <td className="p-4 font-normal">{entry.email}</td>
                <td className="p-4 font-normal">
                  {new Date(entry.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4">
                  <AdminButton kind="secondary" onClick={() => setSelected(entry)}>
                    Open
                  </AdminButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered?.length === 0 ? (
          <p className="p-10 text-center opacity-65">No inquiries match those filters.</p>
        ) : null}
      </div>
      {selected ? (
        <AdminModal
          onClose={() => setSelected(null)}
          title={`${name(selected)} — ${selected.read ? "read" : "new"}`}
        >
          <dl className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
            {Object.entries(selected)
              .filter(
                ([key]) => !key.startsWith("_") && !["archived", "read", "createdAt"].includes(key),
              )
              .map(([key, value]) => (
                <div
                  className={
                    key.toLowerCase().includes("message") ||
                    key.toLowerCase().includes("instruction")
                      ? "sm:col-span-2"
                      : ""
                  }
                  key={key}
                >
                  <dt className="text-xs font-semibold text-deep-brown/55">
                    {key.replace(/([A-Z])/g, " $1")}
                  </dt>
                  <dd className="mt-1 text-sm whitespace-pre-wrap">
                    {Array.isArray(value) ? value.join(", ") || "—" : String(value || "—")}
                  </dd>
                </div>
              ))}
          </dl>
          <div className="mt-8 flex flex-wrap justify-end gap-2">
            <AdminButton
              kind="secondary"
              onClick={async () => {
                await setState(selected._id, { read: !selected.read })
                setSelected({ ...selected, read: !selected.read })
              }}
            >
              {selected.read ? "Mark unread" : "Mark read"}
            </AdminButton>
            <AdminButton
              kind="danger"
              onClick={async () => {
                await setState(selected._id, { archived: true })
                setSelected(null)
              }}
            >
              Archive
            </AdminButton>
          </div>
        </AdminModal>
      ) : null}
    </div>
  )
}

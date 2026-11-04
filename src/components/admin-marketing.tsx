"use client"
import { useConvex, useMutation, usePaginatedQuery, useQuery } from "convex/react"
import { useState, type ReactNode } from "react"
import { AdminButton, AdminHeader, AdminModal, adminInput } from "@/components/admin-ui"
import { MarketingPopupCard, type PopupContent } from "@/components/marketing-popup-card"
import { useMediaUpload } from "@/components/use-media-upload"
import { marketingEmailCsvRow } from "@/lib/marketing-csv"
import { normalizeHex, siteColorTokens } from "@/lib/visual-page"
import { api } from "../../convex/_generated/api"
import type { Doc, Id } from "../../convex/_generated/dataModel"

const blankAnnouncement = {
  text: "",
  link: "",
  textColor: "#fdf2e2",
  backgroundColor: "#5a2631",
  active: false,
}
const blankPopup = {
  title: "",
  body: "",
  layout: "none" as PopupContent["layout"],
  imageId: undefined as Id<"_storage"> | undefined,
  imageAlt: "",
  buttonText: "",
  buttonLink: "",
  captureEmail: false,
  active: false,
}
function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      {children}
    </label>
  )
}
function ColorField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  return (
    <fieldset className="grid gap-3">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="flex gap-2">
        <input
          aria-label={`${label} picker`}
          type="color"
          value={normalizeHex(value) ?? "#000000"}
          onChange={(e) => onChange(e.target.value)}
          className="h-11 w-14 cursor-pointer rounded-lg border border-deep-brown/15"
        />
        <input
          aria-label={`${label} hex`}
          className={adminInput}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#5a2631"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {siteColorTokens.map((token) => (
          <button
            key={token}
            type="button"
            title={token}
            aria-label={`Use ${token} for ${label.toLowerCase()}`}
            className="size-7 rounded-full border border-black/20 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{ backgroundColor: `var(--color-${token})` }}
            onClick={(e) => {
              const color = getComputedStyle(e.currentTarget)
                .getPropertyValue(`--color-${token}`)
                .trim()
              onChange(color)
            }}
          />
        ))}
      </div>
    </fieldset>
  )
}
export function AdminMarketing({ kind }: { kind: "announcements" | "popups" }) {
  const data = useQuery(api.marketing.list)
  const saveAnnouncement = useMutation(api.marketing.saveAnnouncement),
    savePopup = useMutation(api.marketing.savePopup)
  const setActive = useMutation(api.marketing.setActive),
    remove = useMutation(api.marketing.remove)
  const upload = useMediaUpload()
  const [editing, setEditing] = useState(false),
    [id, setId] = useState<string | undefined>()
  const [announcement, setAnnouncement] = useState(blankAnnouncement),
    [popup, setPopup] = useState(blankPopup)
  const [buttonEnabled, setButtonEnabled] = useState(false)
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [uploading, setUploading] = useState(false)
  const [tab, setTab] = useState("popups")
  const [deleting, setDeleting] = useState<Doc<"announcements"> | Doc<"popups"> | null>(null)
  const convex = useConvex()
  const isBar = kind === "announcements"
  async function task(action: () => Promise<unknown>) {
    setBusy(true)
    setError("")
    try {
      await action()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save. Please try again.")
    } finally {
      setBusy(false)
    }
  }
  function create() {
    setId(undefined)
    setAnnouncement(blankAnnouncement)
    setPopup(blankPopup)
    setButtonEnabled(false)
    setImageUrl(null)
    setError("")
    setEditing(true)
  }
  async function edit(row: Doc<"announcements"> | Doc<"popups">) {
    setError("")
    setId(row._id)
    if ("text" in row)
      setAnnouncement({
        text: row.text,
        link: row.link,
        textColor: row.textColor,
        backgroundColor: row.backgroundColor,
        active: row.active,
      })
    else {
      setButtonEnabled(Boolean(row.buttonText && row.buttonLink))
      setPopup({
        title: row.title,
        body: row.body,
        layout: row.layout,
        imageId: row.imageId,
        imageAlt: row.imageAlt,
        buttonText: row.buttonText,
        buttonLink: row.buttonLink,
        captureEmail: row.captureEmail,
        active: row.active,
      })
      setImageUrl(
        row.imageId ? await convex.query(api.marketing.imageUrl, { id: row.imageId }) : null,
      )
    }
    setEditing(true)
  }
  const rows = isBar ? data?.announcements : data?.popups
  return (
    <>
      <AdminHeader
        eyebrow="Marketing"
        title={isBar ? "Announcement Bar" : "Pop-Ups"}
        actions={
          <AdminButton disabled={busy} onClick={create}>
            Create {isBar ? "announcement" : "pop-up"}
          </AdminButton>
        }
      />
      {!isBar && (
        <div className="mb-6 flex gap-2">
          <AdminButton
            kind={tab === "popups" ? "primary" : "secondary"}
            onClick={() => setTab("popups")}
          >
            Pop-Ups
          </AdminButton>
          <AdminButton
            kind={tab === "emails" ? "primary" : "secondary"}
            onClick={() => setTab("emails")}
          >
            Emails acquired
          </AdminButton>
        </div>
      )}
      {error && (
        <p role="alert" className="mb-4 text-sm text-red-800">
          {error}
        </p>
      )}
      {!isBar && tab === "emails" ? (
        <AcquiredEmails />
      ) : (
        <div className="grid gap-3">
          <p className="mb-3 text-sm text-deep-brown/65">
            Only one {isBar ? "announcement bar" : "pop-up"} can be active. Activating another
            switches the previous one off.
          </p>
          {rows === undefined ? (
            <p>Loading…</p>
          ) : rows.length === 0 ? (
            <p className="rounded-xl border border-dashed border-deep-brown/20 p-8">
              No {isBar ? "announcements" : "pop-ups"} yet. Create your first one above.
            </p>
          ) : (
            rows.map((row) => (
              <div
                key={row._id}
                className="flex flex-col gap-4 rounded-xl border border-deep-brown/10 bg-white p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <h2 className="truncate font-semibold">{"text" in row ? row.text : row.title}</h2>
                  <span
                    className={`mt-2 inline-block rounded-full px-2.5 py-1 text-xs ${row.active ? "bg-green-100 text-green-900" : "bg-stone-100 text-stone-600"}`}
                  >
                    {row.active ? "Active" : "Inactive"}
                  </span>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2">
                  <AdminButton
                    kind="secondary"
                    disabled={busy}
                    onClick={() =>
                      void task(() => setActive({ id: row._id, kind, active: !row.active }))
                    }
                  >
                    {row.active ? "Deactivate" : "Activate"}
                  </AdminButton>
                  <AdminButton
                    kind="secondary"
                    disabled={busy}
                    onClick={() => void task(() => edit(row))}
                  >
                    Edit
                  </AdminButton>
                  <AdminButton kind="danger" disabled={busy} onClick={() => setDeleting(row)}>
                    Delete
                  </AdminButton>
                </div>
              </div>
            ))
          )}
        </div>
      )}
      {deleting && (
        <AdminModal
          title="Delete this item?"
          onClose={() => {
            if (!busy) setDeleting(null)
          }}
        >
          <p className="mb-6">
            This permanently removes the {isBar ? "announcement" : "pop-up"}. Acquired emails are
            preserved.
          </p>
          {error && (
            <p role="alert" className="mb-4 text-sm text-red-800">
              {error}
            </p>
          )}
          <div className="flex gap-2">
            <AdminButton
              kind="danger"
              disabled={busy}
              onClick={() =>
                void task(async () => {
                  await remove({ id: deleting._id })
                  setDeleting(null)
                })
              }
            >
              Delete
            </AdminButton>
            <AdminButton kind="secondary" disabled={busy} onClick={() => setDeleting(null)}>
              Cancel
            </AdminButton>
          </div>
        </AdminModal>
      )}
      {editing && (
        <AdminModal
          title={`${id ? "Edit" : "Create"} ${isBar ? "announcement" : "pop-up"}`}
          onClose={() => {
            if (!busy && !uploading) setEditing(false)
          }}
        >
          <form
            className="grid gap-6"
            onSubmit={(e) => {
              e.preventDefault()
              void task(async () => {
                if (isBar)
                  await saveAnnouncement({
                    ...announcement,
                    id: id as Id<"announcements"> | undefined,
                  })
                else
                  await savePopup({
                    ...popup,
                    buttonText: buttonEnabled ? popup.buttonText : "",
                    buttonLink: buttonEnabled ? popup.buttonLink : "",
                    id: id as Id<"popups"> | undefined,
                  })
                setEditing(false)
              })
            }}
          >
            <fieldset disabled={busy || uploading} className="contents">
              {isBar ? (
                <>
                  <Field label="Announcement text">
                    <textarea
                      required
                      maxLength={500}
                      className={adminInput}
                      value={announcement.text}
                      onChange={(e) => setAnnouncement({ ...announcement, text: e.target.value })}
                    />
                  </Field>
                  <Field label="Link (opens in a new tab)">
                    <input
                      required
                      className={adminInput}
                      value={announcement.link}
                      onChange={(e) => setAnnouncement({ ...announcement, link: e.target.value })}
                      placeholder="/events or https://…"
                    />
                  </Field>
                  <div className="grid gap-6 sm:grid-cols-2">
                    <ColorField
                      label="Text color"
                      value={announcement.textColor}
                      onChange={(textColor) => setAnnouncement({ ...announcement, textColor })}
                    />
                    <ColorField
                      label="Background color"
                      value={announcement.backgroundColor}
                      onChange={(backgroundColor) =>
                        setAnnouncement({ ...announcement, backgroundColor })
                      }
                    />
                  </div>
                  <div
                    className="rounded-lg px-4 py-3 text-center text-sm"
                    style={{
                      color: normalizeHex(announcement.textColor) ?? undefined,
                      backgroundColor: normalizeHex(announcement.backgroundColor) ?? undefined,
                    }}
                  >
                    {announcement.text || "Announcement preview"} ↗
                  </div>
                </>
              ) : (
                <>
                  <fieldset>
                    <legend className="mb-3 text-sm font-medium">Layout</legend>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                      {(["top", "left", "right", "none"] as const).map((layout) => (
                        <label
                          key={layout}
                          className={`cursor-pointer rounded-xl border p-3 ${popup.layout === layout ? "border-deep-brown bg-deep-brown/5 ring-1 ring-deep-brown" : "border-deep-brown/15"}`}
                        >
                          <input
                            type="radio"
                            name="layout"
                            value={layout}
                            checked={popup.layout === layout}
                            onChange={() => setPopup({ ...popup, layout })}
                            className="peer sr-only"
                          />
                          <span
                            className={`mb-2 flex h-16 gap-1 overflow-hidden rounded bg-wine p-2 peer-focus-visible:outline-2 ${layout === "top" ? "flex-col" : layout === "right" ? "flex-row-reverse" : ""}`}
                            aria-hidden="true"
                          >
                            {layout !== "none" && (
                              <span
                                className={`${layout === "top" ? "h-6 w-full" : "w-2/5"} bg-cream/50`}
                              />
                            )}
                            <span className="flex flex-1 flex-col justify-center gap-1">
                              <span className="h-1.5 w-4/5 bg-cream" />
                              <span className="h-1 w-full bg-cream/40" />
                              <span className="h-1 w-3/5 bg-cream/40" />
                            </span>
                          </span>
                          <span className="text-xs font-medium">
                            {layout === "none"
                              ? "No image"
                              : `Image ${layout === "top" ? "on top" : `on the ${layout}`}`}
                          </span>
                        </label>
                      ))}
                    </div>
                  </fieldset>
                  {popup.layout !== "none" && (
                    <div className="grid gap-4">
                      <Field label="Image upload">
                        <input
                          type="file"
                          accept="image/*"
                          disabled={uploading || busy}
                          onChange={async (e) => {
                            const file = e.target.files?.[0]
                            e.target.value = ""
                            if (!file) return
                            setUploading(true)
                            await task(async () => {
                              const result = await upload(file)
                              setPopup((current) => ({
                                ...current,
                                imageId: result.storageId as Id<"_storage">,
                              }))
                              setImageUrl(result.url)
                            })
                            setUploading(false)
                          }}
                          className={adminInput}
                        />
                      </Field>
                      {uploading && <output>Uploading…</output>}
                    </div>
                  )}
                  <Field label="Title">
                    <input
                      required
                      maxLength={200}
                      className={adminInput}
                      value={popup.title}
                      onChange={(e) => setPopup({ ...popup, title: e.target.value })}
                    />
                  </Field>
                  <Field label="Body text">
                    <textarea
                      required
                      maxLength={5000}
                      rows={5}
                      className={adminInput}
                      value={popup.body}
                      onChange={(e) => setPopup({ ...popup, body: e.target.value })}
                    />
                  </Field>
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      role="switch"
                      aria-checked={buttonEnabled}
                      checked={buttonEnabled}
                      onChange={(e) => setButtonEnabled(e.target.checked)}
                    />
                    Enable button
                  </label>
                  {buttonEnabled && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Button text">
                        <input
                          required
                          className={adminInput}
                          value={popup.buttonText}
                          onChange={(e) => setPopup({ ...popup, buttonText: e.target.value })}
                        />
                      </Field>
                      <Field label="Button link">
                        <input
                          required
                          className={adminInput}
                          value={popup.buttonLink}
                          onChange={(e) => setPopup({ ...popup, buttonLink: e.target.value })}
                        />
                      </Field>
                    </div>
                  )}
                  <label className="flex items-center gap-3 text-sm">
                    <input
                      type="checkbox"
                      checked={popup.captureEmail}
                      onChange={(e) => setPopup({ ...popup, captureEmail: e.target.checked })}
                    />
                    Enable visitor email capture
                  </label>
                  <div className="pointer-events-none" inert>
                    <p className="mb-3 text-xs font-semibold tracking-wide uppercase">
                      Live preview
                    </p>
                    <MarketingPopupCard
                      popup={{
                        ...popup,
                        imageUrl,
                        buttonText: buttonEnabled ? popup.buttonText : "",
                        buttonLink: buttonEnabled ? popup.buttonLink : "",
                      }}
                      onClose={() => {}}
                    >
                      {popup.captureEmail && (
                        <div className="flex flex-wrap gap-2">
                          <input
                            className="min-w-0 flex-1 rounded border border-cream/40 p-3 text-sm"
                            placeholder="Your email"
                          />
                          <span className="rounded-full border border-cream px-5 py-3 text-sm">
                            Submit
                          </span>
                        </div>
                      )}
                    </MarketingPopupCard>
                  </div>
                </>
              )}
              <label className="flex items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={isBar ? announcement.active : popup.active}
                  onChange={(e) =>
                    isBar
                      ? setAnnouncement({ ...announcement, active: e.target.checked })
                      : setPopup({ ...popup, active: e.target.checked })
                  }
                />
                Active (switches off the current {isBar ? "bar" : "pop-up"})
              </label>
              {error && (
                <p role="alert" className="text-sm text-red-800">
                  {error}
                </p>
              )}
              <div className="flex gap-3">
                <AdminButton type="submit" disabled={busy || uploading}>
                  {busy ? "Saving…" : "Save"}
                </AdminButton>
                <AdminButton
                  type="button"
                  kind="secondary"
                  disabled={busy || uploading}
                  onClick={() => setEditing(false)}
                >
                  Cancel
                </AdminButton>
              </div>
            </fieldset>
          </form>
        </AdminModal>
      )}
    </>
  )
}
function AcquiredEmails() {
  const { results, status, loadMore } = usePaginatedQuery(
    api.marketing.emails,
    {},
    { initialNumItems: 50 },
  )
  const convex = useConvex(),
    [exporting, setExporting] = useState(false),
    [error, setError] = useState("")
  async function exportCsv() {
    setExporting(true)
    setError("")
    try {
      const lines = ["Email,Source pop-up,Signup date"]
      let cursor: string | null = null
      while (true) {
        const batch: import("convex/server").FunctionReturnType<typeof api.marketing.emails> =
          await convex.query(api.marketing.emails, { paginationOpts: { cursor, numItems: 200 } })
        lines.push(...batch.page.map(marketingEmailCsvRow))
        if (batch.isDone) break
        cursor = batch.continueCursor
      }
      const url = URL.createObjectURL(
        new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" }),
      )
      const link = document.createElement("a")
      link.href = url
      link.download = "lily-acquired-emails.csv"
      link.click()
      setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch {
      setError("Could not export emails. Please try again.")
    } finally {
      setExporting(false)
    }
  }
  return (
    <section>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Emails acquired</h2>
        <AdminButton disabled={exporting} onClick={() => void exportCsv()}>
          {exporting ? "Exporting…" : "Export CSV"}
        </AdminButton>
      </div>
      {error && <p role="alert">{error}</p>}
      <div className="overflow-x-auto rounded-xl border border-deep-brown/10 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="bg-stone-50">
            <tr>
              <th className="p-4">Email</th>
              <th className="p-4">Source pop-up</th>
              <th className="p-4">Signup date</th>
            </tr>
          </thead>
          <tbody>
            {results.map((row) => (
              <tr key={row._id} className="border-t border-deep-brown/10">
                <td className="p-4">{row.email}</td>
                <td className="p-4">{row.popupTitle}</td>
                <td className="p-4">{new Date(row._creationTime).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {status === "LoadingFirstPage" ? (
        <p className="mt-4">Loading…</p>
      ) : !results.length ? (
        <p className="mt-4">No emails acquired yet.</p>
      ) : null}
      {(status === "CanLoadMore" || status === "LoadingMore") && (
        <div className="mt-4">
          <AdminButton
            kind="secondary"
            disabled={status === "LoadingMore"}
            onClick={() => loadMore(50)}
          >
            Load more
          </AdminButton>
        </div>
      )}
    </section>
  )
}

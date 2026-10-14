"use client"

import { useMutation, useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { AdminButton, AdminHeader, ImageField, adminInput } from "@/components/admin-ui"
import {
  adminMenuPagesRef,
  saveMenuPageRef,
  setMenuArchivedRef,
  type MenuPageRecord,
  type MenuSectionRecord,
} from "@/lib/admin-api"

const palette: MenuSectionRecord["backgroundColor"][] = [
  "cream",
  "mauve",
  "espresso",
  "dark-maroon",
]
const blankSection = (): MenuSectionRecord => ({
  backgroundColor: "cream",
  image: "",
  imageAlt: "",
  imageSide: "left",
  key: crypto.randomUUID(),
  items: [{ description: "", key: crypto.randomUUID(), price: "", title: "" }],
  title: "New section",
})
const blankPage = (): Omit<MenuPageRecord, "_id" | "updatedAt"> => ({
  archived: false,
  description: "",
  heroImage: "",
  heroImageAlt: "",
  order: 0,
  sections: [blankSection()],
  slug: "",
  title: "",
})

function move<T>(values: T[], from: number, to: number) {
  const next = [...values]
  const [item] = next.splice(from, 1)
  next.splice(to, 0, item)
  return next
}

export function AdminMenuEditor({ id }: { id?: string }) {
  const router = useRouter()
  const pages = useQuery(adminMenuPagesRef, { archived: false })
  const existing = useMemo(() => pages?.find((page) => page._id === id), [id, pages])
  const [page, setPage] = useState(blankPage)
  const [saving, setSaving] = useState(false)
  const [notice, setNotice] = useState("")
  const save = useMutation(saveMenuPageRef)
  const archive = useMutation(setMenuArchivedRef)

  useEffect(() => {
    // Populate the local form once the requested server record arrives.
    // oxlint-disable-next-line react/set-state-in-effect
    if (existing) setPage(existing)
  }, [existing])
  const patchSection = (index: number, patch: Partial<MenuSectionRecord>) =>
    setPage((current) => ({
      ...current,
      sections: current.sections.map((section, position) =>
        position === index ? { ...section, ...patch } : section,
      ),
    }))

  async function submit() {
    setSaving(true)
    setNotice("")
    try {
      const savedId = await save({ ...page, id, order: existing?.order ?? pages?.length ?? 0 })
      setNotice("Saved — these changes are now live.")
      if (!id) router.replace(`/admin/menu/${savedId}`)
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Unable to save this menu page.")
    } finally {
      setSaving(false)
    }
  }

  if (id && pages && !existing) return <p>That menu page could not be found.</p>

  return (
    <div>
      <AdminHeader
        eyebrow="Menu editor"
        title={id ? `Edit ${page.title || "menu"}` : "Create a menu page"}
        actions={
          <div className="flex flex-wrap gap-2">
            <AdminButton disabled={saving} onClick={submit}>
              {saving ? "Saving…" : "Save changes"}
            </AdminButton>
            {id ? (
              <AdminButton
                kind="danger"
                onClick={async () => {
                  await archive({ archived: true, id })
                  router.push("/admin")
                }}
              >
                Move to archive
              </AdminButton>
            ) : null}
          </div>
        }
      />
      {notice ? (
        <p aria-live="polite" className="mb-6 border-l-2 border-wine bg-white/30 px-4 py-3 text-sm">
          {notice}
        </p>
      ) : null}
      <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(340px,0.8fr)]">
        <div className="grid gap-8">
          <section className="grid gap-5 border border-deep-brown/15 bg-white/20 p-5 md:p-7">
            <h2 className="font-display text-3xl">Hero</h2>
            <label className="grid gap-2">
              <span className="text-xs font-bold text-wine uppercase">Page title</span>
              <input
                className={adminInput}
                onChange={(e) => setPage({ ...page, title: e.currentTarget.value })}
                value={page.title}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold text-wine uppercase">URL slug</span>
              <input
                className={adminInput}
                onChange={(e) =>
                  setPage({
                    ...page,
                    slug: e.currentTarget.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"),
                  })
                }
                placeholder="dinner"
                value={page.slug}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-xs font-bold text-wine uppercase">Description</span>
              <textarea
                className={`${adminInput} min-h-28`}
                onChange={(e) => setPage({ ...page, description: e.currentTarget.value })}
                value={page.description}
              />
            </label>
            <ImageField
              label="Hero image"
              onChange={(heroImage) => setPage((current) => ({ ...current, heroImage }))}
              value={page.heroImage}
            />
            <label className="grid gap-2">
              <span className="text-xs font-bold text-wine uppercase">Hero image description</span>
              <input
                className={adminInput}
                onChange={(e) => setPage({ ...page, heroImageAlt: e.currentTarget.value })}
                value={page.heroImageAlt}
              />
            </label>
          </section>

          {page.sections.map((section, sectionIndex) => (
            <section
              className="grid gap-5 border border-deep-brown/15 bg-white/20 p-5 md:p-7"
              key={section.key}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-display text-3xl">Section {sectionIndex + 1}</h2>
                <div className="flex gap-2">
                  <AdminButton
                    disabled={sectionIndex === 0}
                    kind="secondary"
                    onClick={() =>
                      setPage({
                        ...page,
                        sections: move(page.sections, sectionIndex, sectionIndex - 1),
                      })
                    }
                  >
                    ↑
                  </AdminButton>
                  <AdminButton
                    disabled={sectionIndex === page.sections.length - 1}
                    kind="secondary"
                    onClick={() =>
                      setPage({
                        ...page,
                        sections: move(page.sections, sectionIndex, sectionIndex + 1),
                      })
                    }
                  >
                    ↓
                  </AdminButton>
                  <AdminButton
                    disabled={page.sections.length === 1}
                    kind="danger"
                    onClick={() =>
                      setPage({
                        ...page,
                        sections: page.sections.filter((_, index) => index !== sectionIndex),
                      })
                    }
                  >
                    Delete
                  </AdminButton>
                </div>
              </div>
              <label className="grid gap-2">
                <span className="text-xs font-bold text-wine uppercase">Section title</span>
                <input
                  className={adminInput}
                  onChange={(e) => patchSection(sectionIndex, { title: e.currentTarget.value })}
                  value={section.title}
                />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-wine uppercase">Image position</span>
                  <select
                    className={adminInput}
                    onChange={(e) =>
                      patchSection(sectionIndex, {
                        imageSide: e.currentTarget.value as "left" | "right",
                      })
                    }
                    value={section.imageSide}
                  >
                    <option value="left">Left</option>
                    <option value="right">Right</option>
                  </select>
                </label>
                <label className="grid gap-2">
                  <span className="text-xs font-bold text-wine uppercase">Background</span>
                  <select
                    className={adminInput}
                    onChange={(e) =>
                      patchSection(sectionIndex, {
                        backgroundColor: e.currentTarget
                          .value as MenuSectionRecord["backgroundColor"],
                      })
                    }
                    value={section.backgroundColor}
                  >
                    {palette.map((color) => (
                      <option key={color} value={color}>
                        {color.replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <ImageField
                label="Section image"
                onChange={(image) => patchSection(sectionIndex, { image })}
                value={section.image}
              />
              <label className="grid gap-2">
                <span className="text-xs font-bold text-wine uppercase">Image description</span>
                <input
                  className={adminInput}
                  onChange={(e) => patchSection(sectionIndex, { imageAlt: e.currentTarget.value })}
                  value={section.imageAlt}
                />
              </label>
              <div className="grid gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl">Menu items</h3>
                  <AdminButton
                    kind="secondary"
                    onClick={() =>
                      patchSection(sectionIndex, {
                        items: [
                          ...section.items,
                          { description: "", key: crypto.randomUUID(), price: "", title: "" },
                        ],
                      })
                    }
                  >
                    Add item
                  </AdminButton>
                </div>
                {section.items.map((item, itemIndex) => (
                  <div className="grid gap-3 border-t border-deep-brown/15 pt-4" key={item.key}>
                    <div className="grid gap-3 sm:grid-cols-[1fr_130px]">
                      <input
                        aria-label="Item title"
                        className={adminInput}
                        onChange={(e) =>
                          patchSection(sectionIndex, {
                            items: section.items.map((row, index) =>
                              index === itemIndex ? { ...row, title: e.currentTarget.value } : row,
                            ),
                          })
                        }
                        placeholder="Item title"
                        value={item.title}
                      />
                      <input
                        aria-label="Price"
                        className={adminInput}
                        onChange={(e) =>
                          patchSection(sectionIndex, {
                            items: section.items.map((row, index) =>
                              index === itemIndex ? { ...row, price: e.currentTarget.value } : row,
                            ),
                          })
                        }
                        placeholder="$18"
                        value={item.price}
                      />
                    </div>
                    <textarea
                      aria-label="Item description"
                      className={`${adminInput} min-h-20`}
                      onChange={(e) =>
                        patchSection(sectionIndex, {
                          items: section.items.map((row, index) =>
                            index === itemIndex
                              ? { ...row, description: e.currentTarget.value }
                              : row,
                          ),
                        })
                      }
                      placeholder="Description"
                      value={item.description}
                    />
                    <div className="flex gap-2">
                      <AdminButton
                        disabled={itemIndex === 0}
                        kind="secondary"
                        onClick={() =>
                          patchSection(sectionIndex, {
                            items: move(section.items, itemIndex, itemIndex - 1),
                          })
                        }
                      >
                        Move up
                      </AdminButton>
                      <AdminButton
                        disabled={itemIndex === section.items.length - 1}
                        kind="secondary"
                        onClick={() =>
                          patchSection(sectionIndex, {
                            items: move(section.items, itemIndex, itemIndex + 1),
                          })
                        }
                      >
                        Move down
                      </AdminButton>
                      <AdminButton
                        kind="danger"
                        onClick={() =>
                          patchSection(sectionIndex, {
                            items: section.items.filter((_, index) => index !== itemIndex),
                          })
                        }
                      >
                        Delete
                      </AdminButton>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
          <AdminButton
            kind="secondary"
            onClick={() => setPage({ ...page, sections: [...page.sections, blankSection()] })}
          >
            Add menu section
          </AdminButton>
        </div>

        <aside className="self-start xl:sticky xl:top-8">
          <p className="mb-3 eyebrow text-wine">Live preview</p>
          <div className="overflow-hidden border border-deep-brown/15 bg-white/30 shadow-sm">
            <div
              className="grid min-h-60 place-items-end bg-dark-maroon bg-cover bg-center p-6 text-cream"
              style={{
                backgroundImage: page.heroImage
                  ? `linear-gradient(#32151a66,#32151a99),url(${page.heroImage})`
                  : undefined,
              }}
            >
              <div>
                <h2 className="font-display text-5xl">{page.title || "Menu title"}</h2>
                <p className="mt-2 text-sm">
                  {page.description || "Your menu description appears here."}
                </p>
              </div>
            </div>
            {page.sections.map((section) => (
              <div
                className={`grid min-h-52 sm:grid-cols-2 ${section.backgroundColor === "cream" ? "bg-cream" : section.backgroundColor === "mauve" ? "bg-mauve" : "bg-deep-brown text-cream"}`}
                key={section.key}
              >
                <div
                  className={`min-h-44 bg-cover bg-center ${section.imageSide === "right" ? "sm:order-2" : ""}`}
                  style={{
                    backgroundImage: section.image
                      ? `url(${section.image})`
                      : "linear-gradient(135deg,#cab8a8,#8f7064)",
                  }}
                />
                <div className="p-5">
                  <h3 className="font-display text-3xl">{section.title}</h3>
                  <div className="mt-4 grid gap-3">
                    {section.items.map((item) => (
                      <div key={item.key}>
                        <div className="flex justify-between gap-4 text-sm font-bold">
                          <span>{item.title || "Menu item"}</span>
                          <span>{item.price || "$—"}</span>
                        </div>
                        {item.description ? (
                          <p className="mt-1 text-xs opacity-75">{item.description}</p>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}

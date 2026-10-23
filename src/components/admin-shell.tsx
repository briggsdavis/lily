"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { CaretDownIcon, ListIcon, PlusIcon, XIcon } from "@phosphor-icons/react"
import { useMutation, useQuery } from "convex/react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { DragEvent, ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { AdminButton, AdminModal, ImageField, adminInput } from "@/components/admin-ui"
import { events as initialEvents } from "@/data/events"
import { menuCategories } from "@/data/menu"
import {
  adminEventsRef,
  adminMenuPagesRef,
  initializeContentRef,
  reorderMenuPagesRef,
  saveMenuPageRef,
  type MenuPageRecord,
} from "@/lib/admin-api"
import { randomId } from "@/lib/random-id"

import { AdminPageToggle } from "@/components/admin-page-toggle"

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/catering", label: "Catering" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/archive", label: "Archive" },
] as const

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")

function NavLink({
  href,
  label,
  onNavigate,
  publicPath,
}: {
  publicPath?: string
  href: string
  label: string
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
  return (
    <div className="flex items-center"><div className="min-w-0 flex-1"><Link
      aria-current={active ? "page" : undefined}
      className="mx-2 flex min-h-10 items-center rounded-lg px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white aria-[current=page]:bg-white/14 aria-[current=page]:text-white"
      href={href}
      onClick={onNavigate}
    >
      {label}
    </Link></div>{publicPath && <AdminPageToggle path={publicPath} label={label} />}</div>
  )
}

function Chevron({ open }: { open: boolean }) {
  return (
    <CaretDownIcon
      aria-hidden="true"
      className={`size-4 text-white/45 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
    />
  )
}

type NewPage = {
  description: string
  firstColor: "espresso" | "dark-maroon" | "deep-brown"
  firstImage: string
  firstSide: "left" | "right"
  firstTitle: string
  heroImage: string
  title: string
}
const blankPage = (): NewPage => ({
  description: "",
  firstColor: "espresso",
  firstImage: "",
  firstSide: "left",
  firstTitle: "",
  heroImage: "",
  title: "",
})

export function AdminShell({ children }: { children: ReactNode }) {
  const pages = useQuery(adminMenuPagesRef, { archived: false })
  const events = useQuery(adminEventsRef, { archived: false })
  const initializeContent = useMutation(initializeContentRef)
  const reorderPages = useMutation(reorderMenuPagesRef)
  const savePage = useMutation(saveMenuPageRef)
  const router = useRouter()
  const { signOut } = useAuthActions()
  const [open, setOpen] = useState(false)
  const [pageEditorOpen, setPageEditorOpen] = useState(false)
  const [menuEditorOpen, setMenuEditorOpen] = useState(true)
  const [orderedPages, setOrderedPages] = useState<MenuPageRecord[]>([])
  const [draggedId, setDraggedId] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)
  const [newPage, setNewPage] = useState(blankPage)
  const [createError, setCreateError] = useState("")
  const [saving, setSaving] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])
  const logout = useCallback(() => void signOut(), [signOut])

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect
    if (pages) setOrderedPages(pages)
  }, [pages])

  useEffect(() => {
    if (!pages || !events || (pages.length && events.length)) return
    const seededPages = menuCategories.map((page, order) => ({
      archived: false,
      description: page.description,
      heroImage: page.image,
      heroImageAlt: page.imageAlt,
      order,
      sections: page.sections.map((section, index) => ({
        backgroundColor: "espresso" as const,
        image: section.image,
        imageAlt: section.imageAlt,
        imageSide: index % 2 ? ("right" as const) : ("left" as const),
        items: section.items.map((item) => ({
          description: item.description,
          key: randomId(),
          price: item.price,
          title: item.name,
        })),
        key: randomId(),
        title: section.title,
      })),
      slug: page.slug,
      title: page.name,
    }))
    const seededEvents = initialEvents.map((event) => ({
      active: true,
      archived: false,
      buttonLabel: event.action?.label,
      buttonLink: event.action?.href,
      date: `${event.year}-${String(event.month + 1).padStart(2, "0")}-${String(event.day).padStart(2, "0")}`,
      description: event.description,
      leftImage: event.leftImage,
      leftImageAlt: event.title,
      recurrence: "none" as const,
      rightImage: event.rightImage,
      rightImageAlt: event.title,
      time: event.time,
      title: event.title,
    }))
    void initializeContent({ events: seededEvents, pages: seededPages })
  }, [events, initializeContent, pages])

  async function dropPage(event: DragEvent, targetId: string) {
    event.preventDefault()
    if (!draggedId || draggedId === targetId) return
    const next = [...orderedPages]
    const [moved] = next.splice(
      next.findIndex((page) => page._id === draggedId),
      1,
    )
    next.splice(
      next.findIndex((page) => page._id === targetId),
      0,
      moved,
    )
    setOrderedPages(next)
    setDraggedId(null)
    await reorderPages({ ids: next.map((page) => page._id) })
  }

  async function createPage() {
    if (
      !newPage.title ||
      !newPage.description ||
      !newPage.heroImage ||
      !newPage.firstTitle ||
      !newPage.firstImage
    ) {
      setCreateError("Complete the page details and first section before creating the page.")
      return
    }
    setSaving(true)
    setCreateError("")
    try {
      const baseSlug = slugify(newPage.title) || "menu"
      const taken = new Set(orderedPages.map((page) => page.slug))
      let slug = baseSlug
      let suffix = 2
      while (taken.has(slug)) slug = `${baseSlug}-${suffix++}`
      const id = await savePage({
        archived: false,
        description: newPage.description,
        heroImage: newPage.heroImage,
        heroImageAlt: newPage.title,
        order: orderedPages.length,
        sections: [
          {
            backgroundColor: newPage.firstColor,
            image: newPage.firstImage,
            imageAlt: newPage.firstTitle,
            imageSide: newPage.firstSide,
            items: [],
            key: randomId(),
            title: newPage.firstTitle,
          },
        ],
        slug,
        title: newPage.title,
      })
      setCreating(false)
      setNewPage(blankPage())
      close()
      router.push(`/admin/menu/${id}`)
    } catch (error) {
      setCreateError(error instanceof Error ? error.message : "Unable to create the menu page.")
    } finally {
      setSaving(false)
    }
  }

  const sidebar = (
    <div className="flex h-full flex-col bg-deep-brown text-white">
      <div className="border-b border-white/10 px-5 py-6">
        <p className="text-lg font-semibold tracking-tight">Lily Admin</p>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto py-4">
        <NavLink href="/admin" label="Dashboard" onNavigate={close} />
        <div>
          <button
            aria-expanded={pageEditorOpen}
            className="mx-2 flex min-h-10 w-[calc(100%_-_1rem)] cursor-pointer items-center justify-between rounded-lg px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => setPageEditorOpen((value) => !value)}
            type="button"
          >
            Page editor <Chevron open={pageEditorOpen} />
          </button>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${pageEditorOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div
              className={`overflow-hidden pl-3 transition-transform duration-300 ease-out ${pageEditorOpen ? "translate-y-0" : "-translate-y-2"}`}
            >
              <NavLink href="/admin/pages/home" label="Home" publicPath="/" onNavigate={close} />
              <NavLink href="/admin/pages/about" label="About" publicPath="/about" onNavigate={close} />
            </div>
          </div>
        </div>
        <div>
          <button
            aria-expanded={menuEditorOpen}
            className="mx-2 flex min-h-10 w-[calc(100%_-_1rem)] cursor-pointer items-center justify-between rounded-lg px-3 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white"
            onClick={() => setMenuEditorOpen((value) => !value)}
            type="button"
          >
            Menu editor <Chevron open={menuEditorOpen} />
          </button>
          <div
            className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out ${menuEditorOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
          >
            <div
              className={`overflow-hidden pl-3 transition-transform duration-300 ease-out ${menuEditorOpen ? "translate-y-0" : "-translate-y-2"}`}
            >
              {orderedPages.map((page) => (
                <div
                  className="group/page flex items-center gap-1 pr-3"
                  draggable
                  key={page._id}
                  onDragEnd={() => setDraggedId(null)}
                  onDragOver={(event) => event.preventDefault()}
                  onDragStart={() => setDraggedId(page._id)}
                  onDrop={(event) => void dropPage(event, page._id)}
                >
                  <span className="cursor-grab text-white/25 select-none group-hover/page:text-white/55">
                    ⋮⋮
                  </span>
                  <div className="min-w-0 flex-1" draggable={false} onDragStart={(event) => event.stopPropagation()}>
                    <NavLink
                      href={`/admin/menu/${page._id}`}
                      label={page.title}
                      publicPath={`/menu/${page.slug}`}
                      onNavigate={close}
                    />
                  </div>
                </div>
              ))}
              <button
                aria-label="Add menu page"
                className="mx-3 my-2 grid size-8 cursor-pointer place-items-center rounded-lg border border-dashed border-white/25 text-white/65 transition-[transform,color,background-color,border-color] hover:scale-105 hover:border-white/50 hover:bg-white/8 hover:text-white"
                onClick={() => setCreating(true)}
                type="button"
              >
                <PlusIcon aria-hidden="true" className="size-4" />
              </button>
            </div>
          </div>
        </div>
        {links.slice(1).map((link) => (
          <NavLink {...link} publicPath={link.href === "/admin/archive" ? undefined : link.href.replace("/admin", "")} key={link.href} onNavigate={close} />
        ))}
      </nav>
      <button
        className="m-4 min-h-10 rounded-lg border border-white/15 px-3 text-left text-sm font-medium text-white/70 transition-colors hover:bg-white/8 hover:text-white"
        onClick={logout}
        type="button"
      >
        Log out
      </button>
    </div>
  )

  return (
    <div className="min-h-dvh bg-[#f6f5f2] font-body text-deep-brown lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh lg:block">{sidebar}</aside>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-deep-brown/10 bg-[#f6f5f2]/95 px-5 py-4 backdrop-blur lg:hidden">
        <span className="text-lg font-semibold tracking-tight">Lily Admin</span>
        <button
          aria-expanded={open}
          aria-label={open ? "Close navigation" : "Open navigation"}
          className="grid size-10 place-items-center rounded-xl border border-deep-brown/15 bg-white shadow-sm"
          onClick={toggle}
          type="button"
        >
          {open ? (
            <XIcon aria-hidden="true" className="size-5" />
          ) : (
            <ListIcon aria-hidden="true" className="size-5" />
          )}
        </button>
      </header>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-deep-brown/45 backdrop-blur-sm"
            onClick={close}
            type="button"
          />
          <aside className="relative h-full w-[min(88vw,19rem)]">{sidebar}</aside>
        </div>
      ) : null}
      <main className="min-w-0 px-2.5 py-4 md:px-5 md:py-5 xl:px-7">{children}</main>
      {creating ? (
        <AdminModal onClose={() => setCreating(false)} title="Create a menu page">
          <div className="grid gap-6">
            <label className="grid gap-2">
              <span className="text-sm font-medium">Page title</span>
              <input
                className={adminInput}
                onChange={(event) => setNewPage({ ...newPage, title: event.currentTarget.value })}
                placeholder="Dinner"
                value={newPage.title}
              />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-medium">Hero description</span>
              <textarea
                className={`${adminInput} min-h-24 resize-y`}
                onChange={(event) =>
                  setNewPage({ ...newPage, description: event.currentTarget.value })
                }
                placeholder="A short introduction to this menu"
                value={newPage.description}
              />
            </label>
            <ImageField
              label="Hero image"
              onChange={(heroImage) => setNewPage({ ...newPage, heroImage })}
              value={newPage.heroImage}
            />
            <div className="border-t border-deep-brown/10 pt-6">
              <h3 className="text-base font-semibold">First section</h3>
              <p className="mt-1 text-sm text-deep-brown/60">
                Every menu page starts with one section.
              </p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 sm:col-span-2">
                  <span className="text-sm font-medium">Section title</span>
                  <input
                    className={adminInput}
                    onChange={(event) =>
                      setNewPage({ ...newPage, firstTitle: event.currentTarget.value })
                    }
                    placeholder="From the garden"
                    value={newPage.firstTitle}
                  />
                </label>
                <div className="sm:col-span-2">
                  <ImageField
                    label="Section image"
                    onChange={(firstImage) => setNewPage({ ...newPage, firstImage })}
                    value={newPage.firstImage}
                  />
                </div>
                {(["left", "right"] as const).map((side) => (
                  <button
                    className={`cursor-pointer rounded-2xl border p-4 text-left transition-colors ${newPage.firstSide === side ? "border-deep-brown bg-deep-brown/5" : "border-deep-brown/15 bg-white hover:border-deep-brown/35"}`}
                    key={side}
                    onClick={() => setNewPage({ ...newPage, firstSide: side })}
                    type="button"
                  >
                    <span className="mb-3 grid grid-cols-2 overflow-hidden rounded-lg border border-deep-brown/15">
                      {side === "left" ? (
                        <>
                          <span className="h-12 bg-deep-brown/25" />
                          <span className="h-12 bg-white" />
                        </>
                      ) : (
                        <>
                          <span className="h-12 bg-white" />
                          <span className="h-12 bg-deep-brown/25" />
                        </>
                      )}
                    </span>
                    <span className="text-sm font-semibold">Image {side}</span>
                  </button>
                ))}
                <div className="sm:col-span-2">
                  <p className="mb-2 text-sm font-medium">Background color</p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {(
                      [
                        ["espresso", "Dark brown", "bg-espresso"],
                        ["dark-maroon", "Wine", "bg-dark-maroon"],
                        ["deep-brown", "Maroon", "bg-deep-brown"],
                      ] as const
                    ).map(([color, label, className]) => (
                      <button
                        aria-pressed={newPage.firstColor === color}
                        className="cursor-pointer rounded-xl border border-deep-brown/15 bg-white p-2 text-left shadow-sm hover:border-deep-brown/35 aria-pressed:border-deep-brown aria-pressed:ring-2 aria-pressed:ring-deep-brown/15"
                        key={color}
                        onClick={() => setNewPage({ ...newPage, firstColor: color })}
                        type="button"
                      >
                        <span className={`mb-2 block h-10 rounded-lg ${className}`} />
                        <span className="text-xs font-semibold">{label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            {createError ? <p className="text-sm text-red-700">{createError}</p> : null}
            <div className="flex justify-end gap-2">
              <AdminButton kind="secondary" onClick={() => setCreating(false)}>
                Cancel
              </AdminButton>
              <AdminButton disabled={saving} onClick={createPage}>
                {saving ? "Creating…" : "Create page"}
              </AdminButton>
            </div>
          </div>
        </AdminModal>
      ) : null}
    </div>
  )
}

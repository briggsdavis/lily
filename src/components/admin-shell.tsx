"use client"

import { useAuthActions } from "@convex-dev/auth/react"
import { useMutation, useQuery } from "convex/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import { useCallback, useEffect, useState } from "react"
import { events as initialEvents } from "@/data/events"
import { menuCategories } from "@/data/menu"
import { adminEventsRef, adminMenuPagesRef, initializeContentRef } from "@/lib/admin-api"

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/events", label: "Events" },
  { href: "/admin/catering", label: "Catering" },
  { href: "/admin/contact", label: "Contact" },
  { href: "/admin/archive", label: "Archive" },
] as const

function NavLink({
  href,
  label,
  onNavigate,
}: {
  href: string
  label: string
  onNavigate: () => void
}) {
  const pathname = usePathname()
  const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
  return (
    <Link
      aria-current={active ? "page" : undefined}
      className="flex min-h-11 items-center border-l-2 border-transparent px-4 text-sm font-semibold hover:border-wine hover:bg-wine/5 aria-[current=page]:border-wine aria-[current=page]:bg-wine aria-[current=page]:text-cream"
      href={href}
      onClick={onNavigate}
    >
      {label}
    </Link>
  )
}

export function AdminShell({ children }: { children: ReactNode }) {
  const pages = useQuery(adminMenuPagesRef, { archived: false })
  const events = useQuery(adminEventsRef, { archived: false })
  const initializeContent = useMutation(initializeContentRef)
  const { signOut } = useAuthActions()
  const [open, setOpen] = useState(false)
  const close = useCallback(() => setOpen(false), [])
  const toggle = useCallback(() => setOpen((value) => !value), [])
  const logout = useCallback(() => void signOut(), [signOut])

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
          key: crypto.randomUUID(),
          price: item.price,
          title: item.name,
        })),
        key: crypto.randomUUID(),
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

  const sidebar = (
    <div className="flex h-full flex-col bg-deep-brown text-cream">
      <div className="border-b border-cream/20 px-6 py-7">
        <p className="font-display text-3xl">Lily</p>
        <p className="mt-1 text-[0.65rem] font-bold tracking-[0.16em] text-cream/55 uppercase">
          Administration
        </p>
      </div>
      <nav aria-label="Admin" className="flex-1 overflow-y-auto py-5">
        <NavLink href="/admin" label="Dashboard" onNavigate={close} />
        <details className="group">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold hover:bg-cream/8">
            Page editor <span className="text-cream/45 group-open:rotate-45">+</span>
          </summary>
          <div className="ml-4 border-l border-cream/20">
            <NavLink href="/admin/pages/home" label="Home" onNavigate={close} />
            <NavLink href="/admin/pages/about" label="About" onNavigate={close} />
          </div>
        </details>
        <details className="group" open>
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between px-4 text-sm font-semibold hover:bg-cream/8">
            Menu editor <span className="text-cream/45 group-open:rotate-45">+</span>
          </summary>
          <div className="ml-4 border-l border-cream/20">
            <NavLink href="/admin/menu" label="Manage pages" onNavigate={close} />
            <NavLink href="/admin/menu/new" label="Add menu page" onNavigate={close} />
            {(pages ?? []).map((page) => (
              <NavLink
                href={`/admin/menu/${page._id}`}
                label={page.title}
                key={page._id}
                onNavigate={close}
              />
            ))}
          </div>
        </details>
        {links.slice(1).map((link) => (
          <NavLink {...link} key={link.href} onNavigate={close} />
        ))}
      </nav>
      <button
        className="m-4 min-h-11 border border-cream/35 px-4 text-left text-sm font-semibold hover:bg-cream hover:text-deep-brown"
        onClick={logout}
        type="button"
      >
        Log out
      </button>
    </div>
  )

  return (
    <div className="min-h-dvh bg-cream text-deep-brown lg:grid lg:grid-cols-[17rem_1fr]">
      <aside className="sticky top-0 hidden h-dvh lg:block">{sidebar}</aside>
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-deep-brown/15 bg-cream px-5 py-4 lg:hidden">
        <span className="font-display text-2xl">Lily Admin</span>
        <button
          aria-expanded={open}
          className="size-10 border border-deep-brown/30"
          onClick={toggle}
          type="button"
        >
          {open ? "×" : "☰"}
        </button>
      </header>
      {open ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close navigation"
            className="absolute inset-0 bg-dark-maroon/45"
            onClick={close}
            type="button"
          />
          <aside className="relative h-full w-[min(88vw,19rem)]">{sidebar}</aside>
        </div>
      ) : null}
      <main className="min-w-0 px-5 py-8 md:px-10 md:py-12 xl:px-16 xl:py-14">{children}</main>
    </div>
  )
}

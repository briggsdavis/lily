"use client"

import { useQuery } from "convex/react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from "react"
import { TransitionLink } from "@/components/transition-link"
import { menuCategories } from "@/data/menu"
import { siteRoutes, topLevelPath } from "@/data/site-navigation"
import { publicMenuPagesRef } from "@/lib/admin-api"

type NavCategory = {
  description: string
  image: string
  imageAlt: string
  name: string
  slug: string
}

export function Navbar({ categories = menuCategories }: { categories?: readonly NavCategory[] }) {
  const pathname = usePathname()
  const current = topLevelPath(pathname)
  const routeMenuCategory = Math.max(
    0,
    categories.findIndex((category) => category.slug === pathname.split("/")[2]),
  )
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPanelOpen, setMenuPanelOpen] = useState(false)
  const [activeMenuCategory, setActiveMenuCategory] = useState(routeMenuCategory)
  const toggleMenu = useCallback(() => setMenuOpen((open) => !open), [])
  const closeMenu = useCallback(() => setMenuOpen(false), [])
  const openMenuPanel = useCallback(() => {
    setActiveMenuCategory(routeMenuCategory)
    setMenuPanelOpen(true)
  }, [routeMenuCategory])
  const closeMenuPanel = useCallback(() => setMenuPanelOpen(false), [])
  const closeNavigation = useCallback(() => {
    setMenuOpen(false)
    setMenuPanelOpen(false)
  }, [])
  const selectMenuCategory = useCallback(
    (event: SyntheticEvent<HTMLElement>) => {
      const index = Number(event.currentTarget.dataset.menuIndex)
      if (Number.isInteger(index) && categories[index]) setActiveMenuCategory(index)
    },
    [categories],
  )
  const closePanelAfterBlur = useCallback((event: FocusEvent<HTMLDivElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) setMenuPanelOpen(false)
  }, [])
  const enterMenuPanel = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
      if (event.key !== "ArrowDown") return
      event.preventDefault()
      openMenuPanel()
      window.requestAnimationFrame(() => {
        document.querySelector<HTMLElement>("[data-menu-panel-link]")?.focus()
      })
    },
    [openMenuPanel],
  )
  const leaveMenuPanel = useCallback(
    (event: ReactKeyboardEvent<HTMLAnchorElement>) => {
      if (event.key !== "Escape") return
      event.preventDefault()
      event.stopPropagation()
      closeNavigation()
      document.getElementById("menu-navigation-trigger")?.focus()
    },
    [closeNavigation],
  )

  useEffect(() => {
    if (!menuOpen && !menuPanelOpen) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return
      closeNavigation()
      if (menuPanelOpen) document.getElementById("menu-navigation-trigger")?.focus()
    }

    window.addEventListener("keydown", closeOnEscape)
    return () => window.removeEventListener("keydown", closeOnEscape)
  }, [closeNavigation, menuOpen, menuPanelOpen])

  return (
    <header className="hero-intro-header pointer-events-none fixed inset-x-0 top-0 z-60 flex justify-center px-3 py-5 md:px-4">
      <div
        className="pointer-events-auto relative flex w-full max-w-sm flex-col items-center md:w-auto md:max-w-none"
        onBlur={closePanelAfterBlur}
        onMouseLeave={closeMenuPanel}
      >
        <nav
          aria-label="Main"
          className={`border-hand relative isolate [--hand-color:var(--color-tan)] overflow-hidden rounded-[3px] bg-transparent px-3 py-3 text-cream md:w-auto md:max-w-full md:[scrollbar-width:none] md:overflow-x-auto md:px-7 md:py-4 md:[&::-webkit-scrollbar]:hidden ${menuOpen ? "w-full max-w-sm" : "w-auto"}`}
          data-site-chrome
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 rounded-[3px] backdrop-blur-md"
          />
          <div className="flex items-center md:hidden">
            <div className="ml-auto flex items-center gap-2">
              <TransitionLink
                className="rounded-full border border-cream/70 px-3 py-2 text-[0.65rem] font-bold uppercase"
                href="/contact?reason=reservation"
                onNavigate={closeMenu}
              >
                Reserve
              </TransitionLink>
              <button
                aria-controls="mobile-navigation"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="grid size-9 cursor-pointer place-items-center rounded-full border border-cream/70"
                onClick={toggleMenu}
                type="button"
              >
                <span className="relative block h-3.5 w-4" aria-hidden="true">
                  <span
                    className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "top-1.5 rotate-45" : "top-0.5"}`}
                  />
                  <span
                    className={`absolute top-1.5 left-0 h-px w-4 bg-current transition-opacity duration-300 ${menuOpen ? "opacity-0" : "opacity-100"}`}
                  />
                  <span
                    className={`absolute left-0 h-px w-4 bg-current transition-transform duration-300 ${menuOpen ? "top-1.5 -rotate-45" : "top-2.5"}`}
                  />
                </span>
              </button>
            </div>
          </div>

          {menuOpen ? (
            <ul
              className="mt-3 grid gap-1 border-t border-cream/30 pt-3 md:hidden"
              id="mobile-navigation"
            >
              {siteRoutes.map((route) => (
                <li key={route.href}>
                  <TransitionLink
                    aria-current={route.href === current ? "page" : undefined}
                    className="flex min-h-10 items-center justify-between py-1 font-display text-lg aria-[current=page]:text-pink"
                    href={route.href}
                    onNavigate={closeMenu}
                  >
                    {route.label}
                    <span aria-hidden="true">↗</span>
                  </TransitionLink>
                </li>
              ))}
            </ul>
          ) : null}

          <ul className="hidden w-max items-center gap-8 md:flex">
            {siteRoutes.map((route) => (
              <li className="shrink-0" key={route.href}>
                <TransitionLink
                  aria-current={route.href === current ? "page" : undefined}
                  aria-controls={route.href === "/menu" ? "menu-navigation-panel" : undefined}
                  aria-expanded={route.href === "/menu" ? menuPanelOpen : undefined}
                  aria-haspopup={route.href === "/menu" ? "true" : undefined}
                  className="animated-underline font-display text-[0.6rem] font-bold uppercase md:text-base"
                  href={route.href}
                  id={route.href === "/menu" ? "menu-navigation-trigger" : undefined}
                  onFocus={closeMenuPanel}
                  onKeyDown={route.href === "/menu" ? enterMenuPanel : undefined}
                  onMouseEnter={route.href === "/menu" ? openMenuPanel : closeMenuPanel}
                  onNavigate={closeNavigation}
                >
                  {route.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>

        <nav
          aria-label="Menu categories"
          aria-hidden={!menuPanelOpen}
          className={`absolute top-[calc(100%+0.75rem)] left-1/2 hidden w-[min(92vw,68rem)] -translate-x-1/2 grid-cols-[minmax(16rem,0.8fr)_minmax(24rem,1.2fr)] gap-8 bg-deep-brown p-8 text-cream transition-[opacity,transform,filter,box-shadow] duration-500 ease-lily before:absolute before:inset-x-0 before:bottom-full before:h-3 before:content-[''] md:grid lg:gap-12 lg:p-10 ${menuPanelOpen ? "pointer-events-auto translate-y-0 opacity-100 shadow-[0_32px_72px_rgba(8,7,5,0.48)] blur-none" : "pointer-events-none -translate-y-2 opacity-0 shadow-none blur-sm"}`}
          id="menu-navigation-panel"
          inert={!menuPanelOpen}
        >
          <div className="relative z-10 grid content-center divide-y divide-cream/25">
            {categories.map((category, index) => (
              <TransitionLink
                className={`group block py-5 transition-opacity duration-300 outline-none first:pt-0 last:pb-0 ${index === activeMenuCategory ? "opacity-100" : "opacity-55 hover:opacity-100 focus-visible:opacity-100"}`}
                data-menu-index={index}
                data-menu-panel-link
                href={`/menu/${category.slug}`}
                key={category.slug}
                onFocus={selectMenuCategory}
                onKeyDown={leaveMenuPanel}
                onMouseEnter={selectMenuCategory}
                onNavigate={closeNavigation}
              >
                <span className="animated-underline block w-max font-display text-3xl font-medium tracking-[0.03em] uppercase group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100 lg:text-4xl">
                  {category.name}
                </span>
                <span className="mt-1.5 line-clamp-2 max-w-[32ch] text-xs leading-5 text-cream/65">
                  {category.description}
                </span>
              </TransitionLink>
            ))}
          </div>

          <div className="relative z-10 aspect-4/3 overflow-hidden bg-mauve">
            {categories.map((category, index) => (
              <Image
                alt={index === activeMenuCategory ? category.imageAlt : ""}
                aria-hidden={index !== activeMenuCategory}
                className={`object-cover transition-[opacity,filter,transform] duration-700 ease-lily ${index === activeMenuCategory ? "scale-100 opacity-100 blur-none" : "scale-[1.03] opacity-0 blur-md"}`}
                fill
                key={category.slug}
                sizes="(max-width: 1024px) 48vw, 36rem"
                src={category.image}
              />
            ))}
            <div className="absolute inset-0 bg-linear-to-t from-black/25 to-transparent" />
          </div>
        </nav>
      </div>
    </header>
  )
}

export function ConnectedNavbar() {
  const pages = useQuery(publicMenuPagesRef, {})
  const categories = useMemo(() => {
    if (!pages?.length) return menuCategories
    return pages.map((page) => ({
      description: page.description,
      image: page.heroImage,
      imageAlt: page.heroImageAlt,
      name: page.title,
      slug: page.slug,
    }))
  }, [pages])
  return <Navbar categories={categories} />
}

"use client"

import { ArrowUpRightIcon, ListIcon, XIcon } from "@phosphor-icons/react"
import { useQuery } from "convex/react"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useMemo, useState } from "react"
import type { FocusEvent, KeyboardEvent as ReactKeyboardEvent, SyntheticEvent } from "react"
import { useDisabledPages } from "@/components/page-visibility"
import { TransitionLink } from "@/components/transition-link"
import { menuCategories } from "@/data/menu"
import { siteRoutes, topLevelPath } from "@/data/site-navigation"
import { publicMenuPagesRef } from "@/lib/admin-api"
import { isPageEnabled } from "@/lib/page-visibility"

type NavCategory = {
  description: string
  image: string
  imageAlt: string
  name: string
  slug: string
}

export function Navbar({
  categories: allCategories = menuCategories,
}: {
  categories?: readonly NavCategory[]
}) {
  const disabled = useDisabledPages()
  const categories = useMemo(
    () => allCategories.filter((category) => isPageEnabled(`/menu/${category.slug}`, disabled)),
    [allCategories, disabled],
  )
  const routes = siteRoutes.filter((route) => isPageEnabled(route.href, disabled))
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

  useEffect(() => {
    if (!menuOpen) return
    const overflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    const desktop = window.matchMedia("(min-width: 48rem)")
    const closeOnDesktop = () => desktop.matches && setMenuOpen(false)
    desktop.addEventListener("change", closeOnDesktop)
    return () => {
      document.body.style.overflow = overflow
      desktop.removeEventListener("change", closeOnDesktop)
    }
  }, [menuOpen])

  return (
    <header className="hero-intro-header pointer-events-none fixed inset-x-0 top-0 z-60 flex justify-center px-2 py-3 md:px-4 md:py-5">
      <div
        className={`pointer-events-auto fixed inset-0 flex flex-col bg-dark-maroon px-5 pt-24 pb-[max(1.5rem,env(safe-area-inset-bottom))] text-cream transition-[opacity,visibility] duration-500 ease-lily md:hidden ${menuOpen ? "visible opacity-100" : "invisible opacity-0"}`}
        id="mobile-navigation"
        inert={!menuOpen}
      >
        <ul className="flex flex-1 flex-col justify-center divide-y divide-cream/15">
          {routes.map((route, index) => (
            <li
              className={`transition-[opacity,transform] duration-700 ease-lily ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
              key={route.href}
              style={{ transitionDelay: menuOpen ? `${120 + index * 60}ms` : "0ms" }}
            >
              <TransitionLink
                aria-current={route.href === current ? "page" : undefined}
                className="group flex items-center justify-between py-4 font-body text-4xl uppercase aria-[current=page]:text-pink"
                href={route.href}
                onNavigate={closeMenu}
              >
                <span>{route.label}</span>
                <ArrowUpRightIcon
                  aria-hidden="true"
                  className="size-6 shrink-0 transition-transform duration-300 group-active:translate-x-0.5 group-active:-translate-y-0.5"
                />
              </TransitionLink>
            </li>
          ))}
        </ul>
        <TransitionLink
          className={`flex min-h-12 items-center justify-center rounded-full bg-pink px-7 text-sm font-semibold text-dark-green uppercase transition-[opacity,transform] duration-700 ease-lily active:scale-[0.98] ${menuOpen ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"}`}
          href="/contact?reason=reservation"
          onNavigate={closeMenu}
          style={{ transitionDelay: menuOpen ? `${120 + routes.length * 60}ms` : "0ms" }}
        >
          Reserve a table
        </TransitionLink>
      </div>

      <div
        className="pointer-events-auto relative flex w-full flex-col items-center md:w-auto"
        onBlur={closePanelAfterBlur}
        onMouseLeave={closeMenuPanel}
      >
        <nav
          aria-label="Main"
          className="relative isolate w-full overflow-hidden rounded-[3px] bg-transparent py-1 pr-1 pl-3 text-cream md:w-auto md:max-w-full md:[scrollbar-width:none] md:overflow-x-auto md:px-10 md:py-6 md:[&::-webkit-scrollbar]:hidden"
          data-site-chrome
        >
          <div
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 -z-10 rounded-[3px] backdrop-blur-md transition-opacity duration-500 ${menuOpen ? "opacity-0 md:opacity-100" : ""}`}
          />
          <div className="flex items-center justify-between md:hidden">
            <TransitionLink
              aria-label="Lily home"
              className="block"
              href="/"
              onNavigate={closeMenu}
            >
              <Image
                alt=""
                className="h-7 w-auto"
                height={767}
                priority
                src="/images/primary-horizontal-cream.png"
                width={2329}
              />
            </TransitionLink>
            <div className="flex items-center gap-2">
              <TransitionLink
                className={`rounded-full bg-cream px-4 py-2.5 text-[0.65rem] font-bold text-burgundy uppercase transition-opacity duration-300 ${menuOpen ? "pointer-events-none opacity-0" : "opacity-100"}`}
                tabIndex={menuOpen ? -1 : undefined}
                href="/contact?reason=reservation"
                onNavigate={closeMenu}
              >
                Reserve
              </TransitionLink>
              <button
                aria-controls="mobile-navigation"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Close menu" : "Open menu"}
                className="grid size-10 cursor-pointer place-items-center rounded-full active:bg-cream/10"
                onClick={toggleMenu}
                type="button"
              >
                {menuOpen ? (
                  <XIcon aria-hidden="true" className="size-6" />
                ) : (
                  <ListIcon aria-hidden="true" className="size-6" />
                )}
              </button>
            </div>
          </div>

          <ul className="hidden w-max items-center gap-8 md:flex">
            {routes.map((route) => (
              <li className="shrink-0" key={route.href}>
                <TransitionLink
                  aria-current={route.href === current ? "page" : undefined}
                  aria-controls={route.href === "/menu" ? "menu-navigation-panel" : undefined}
                  aria-expanded={route.href === "/menu" ? menuPanelOpen : undefined}
                  aria-haspopup={route.href === "/menu" ? "true" : undefined}
                  className="animated-underline font-body text-[0.6rem] font-semibold tracking-[0.14em] uppercase md:text-base"
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
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 hidden size-full select-none md:block"
            src="/nav.svg"
          />
        </nav>

        <nav
          aria-label="Menu categories"
          aria-hidden={!menuPanelOpen}
          className={`absolute top-[calc(100%+0.75rem)] left-1/2 hidden w-[min(92vw,68rem)] -translate-x-1/2 grid-cols-[minmax(16rem,0.8fr)_minmax(24rem,1.2fr)] gap-8 bg-dark-maroon p-8 text-cream transition-[opacity,transform,filter,box-shadow] duration-500 ease-lily before:absolute before:inset-x-0 before:bottom-full before:h-3 before:content-[''] md:grid lg:gap-12 lg:p-10 ${menuPanelOpen ? "pointer-events-auto translate-y-0 opacity-100 shadow-[0_32px_72px_rgba(8,7,5,0.48)] blur-none" : "pointer-events-none -translate-y-2 opacity-0 shadow-none blur-sm"}`}
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
                <span className="animated-underline block w-max font-header text-3xl font-bold tracking-[0.03em] uppercase group-hover:after:origin-left group-hover:after:scale-x-100 group-focus-visible:after:origin-left group-focus-visible:after:scale-x-100 lg:text-4xl">
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

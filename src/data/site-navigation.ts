export const siteRoutes = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/events", label: "Events" },
  { href: "/catering", label: "Catering" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
] as const

const reserveCtaSections = new Set(["", "about", "catering", "events", "menu"])

export function topLevelSection(pathname: string) {
  return pathname.split("/")[1] ?? ""
}

export function topLevelPath(pathname: string) {
  const section = topLevelSection(pathname)
  return section ? `/${section}` : "/"
}

export function hasReserveCta(pathname: string) {
  return reserveCtaSections.has(topLevelSection(pathname))
}

export type EditablePage = "home" | "about"
export type PageFields = Record<string, string>
export type DraftMedia = { key: string; storageId: string; url: string; kind: "image" | "video" }
export type FieldKind = "text" | "button" | "color" | "toggle"
export const pageFieldKinds: Record<EditablePage, Record<string, FieldKind>> = {
  home: {
    "home.hero.heading": "text",
    "home.about.heading": "text",
    "home.cooking.heading": "text",
    "home.catering.heading": "text",
    "home.hero.description": "text",
    "home.hero.tagline": "text",
    "home.about.kitchen": "text",
    "home.about.bar": "text",
    "home.cooking.description": "text",
    "home.catering.description": "text",
    "home.catering.service1": "text",
    "home.catering.service2": "text",
    "home.catering.service3": "text",
    "home.hero.reservation": "button",
    "home.about.button": "button",
    "home.cooking.reservation": "button",
    "home.cooking.menu": "button",
    "home.catering.button": "button",
    "home.intro.color": "color",
    "home.menu.color": "color",
    "home.about.color": "color",
    "home.catering.color": "color",
    "home.intro.text": "text",
    "home.evening.text1": "text",
    "home.evening.text2": "text",
    "home.evening.button": "button",
    "home.menu.heading": "text",
    "home.menu.button": "button",
    "home.events.item0.copy": "text",
    "home.events.item0.label": "text",
    "home.events.item1.copy": "text",
    "home.events.item1.label": "text",
    "home.events.item2.copy": "text",
    "home.events.item2.label": "text",
    "home.events.item3.copy": "text",
    "home.events.item3.label": "text",
    "home.events.color": "color",
    "home.events.heading": "text",
    "home.events.intro": "text",
    "home.events.button": "button",
    "home.events.prompt": "text",
    "home.private.lines": "text",
    "home.private1.label": "button",
    "home.private1.button": "button",
    "home.private2.label": "button",
    "home.private2.button": "button",
    "home.private3.label": "button",
    "home.private3.button": "button",
  },
  about: {
    "about.timeline.visible": "toggle",
    "about.people.color": "color",
    "about.hero.text1": "text",
    "about.hero.text2": "text",
    "about.timeline1.label": "text",
    "about.timeline1.title": "text",
    "about.timeline1.text": "text",
    "about.timeline2.label": "text",
    "about.timeline2.title": "text",
    "about.timeline2.text": "text",
    "about.timeline3.label": "text",
    "about.timeline3.title": "text",
    "about.timeline3.text": "text",
    "about.timeline.color": "color",
    "about.person1.name": "text",
    "about.person1.role": "text",
    "about.person1.since": "text",
    "about.person1.text": "text",
    "about.person1.color": "color",
    "about.person2.name": "text",
    "about.person2.role": "text",
    "about.person2.since": "text",
    "about.person2.text": "text",
    "about.person2.color": "color",
    "about.person3.name": "text",
    "about.person3.role": "text",
    "about.person3.since": "text",
    "about.person3.text": "text",
    "about.person3.color": "color",
    "about.marquee.color": "color",
    "about.marquee.row0": "text",
    "about.marquee.row1": "text",
    "about.evening.lines": "text",
    "about.evening1.label": "text",
    "about.evening1.button": "button",
    "about.evening2.label": "text",
    "about.evening2.button": "button",
    "about.evening3.label": "text",
    "about.evening3.button": "button",
    "about.evening.secondary": "button",
  },
}
export const siteColorTokens = [
  "burgundy",
  "pink",
  "dark-green",
  "events-gray",
  "cream",
  "orange-brown",
  "taupe",
  "mauve",
  "olive-charcoal",
  "blush",
  "warm-white",
  "bronze",
  "brand-brown",
  "deep-brown",
  "dark-maroon",
  "espresso",
  "wine",
  "tan",
  "grey",
]
export function normalizeHex(value: string) {
  const hex = value.trim().toLowerCase()
  if (/^#[0-9a-f]{6}$/.test(hex)) return hex
  if (/^#[0-9a-f]{3}$/.test(hex))
    return (
      "#" +
      hex
        .slice(1)
        .split("")
        .map((char) => char + char)
        .join("")
    )
  return null
}
export function validPageLink(value: string) {
  if (value.length > 2048) return false
  if (/[\s\\]/.test(value) || Array.from(value).some((char) => char.charCodeAt(0) < 32))
    return false
  if (/^\/(?!\/)/.test(value) || /^#[a-zA-Z][\w-]*$/.test(value)) return true
  try {
    const url = new URL(value)
    return (
      ["https:", "mailto:", "tel:"].includes(url.protocol) &&
      (url.protocol === "https:" ? Boolean(url.hostname) : Boolean(url.pathname))
    )
  } catch {
    return false
  }
}

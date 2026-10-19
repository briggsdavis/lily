export type LilyEvent = {
  action?: {
    href: string
    label: string
  }
  dateLabel: string
  day: number
  description: string
  leftImage: string
  month: number
  rightImage: string
  time: string
  title: string
  year: number
}

export const events: readonly LilyEvent[] = [
  {
    action: { href: "/contact?reason=events", label: "Sign up" },
    dateLabel: "Friday, October 23",
    day: 23,
    description:
      "A generous four-course menu built around the last bright produce of the season, served family-style with an optional wine pairing.",
    leftImage: "/images/lily-event-table-16x10.webp",
    month: 9,
    rightImage: "/images/lily-seasonal-main-dish-4x5.webp",
    time: "6:30 PM",
    title: "Late Harvest Supper",
    year: 2026,
  },
  {
    action: { href: "/contact?reason=events", label: "Sign up" },
    dateLabel: "Friday, November 6",
    day: 6,
    description:
      "An intimate dinner pairing cellar selections with a progression of seasonal plates from the Lily kitchen.",
    leftImage: "/images/lily-romantic-interior-9x16.webp",
    month: 10,
    rightImage: "/images/menu-main-plated-unsplash.jpg",
    time: "7:00 PM",
    title: "Wine & Autumn Table",
    year: 2026,
  },
  {
    action: { href: "/contact?reason=events", label: "Sign up" },
    dateLabel: "Saturday, November 14",
    day: 14,
    description:
      "A late-evening cocktail gathering with garden herbs, preserved fruit, small plates, and a few drinks poured only for the night.",
    leftImage: "/images/contact-cocktail-unsplash.jpg",
    month: 10,
    rightImage: "/images/lily-botanical-cocktail-4x5.webp",
    time: "8:00 PM",
    title: "Garden After Dark",
    year: 2026,
  },
  {
    action: { href: "/contact?reason=events", label: "Sign up" },
    dateLabel: "Sunday, November 22",
    day: 22,
    description:
      "An early Sunday table of shared dishes, warm bread, autumn desserts, and unhurried hospitality for friends and family.",
    leftImage: "/images/contact-reservation-unsplash.jpg",
    month: 10,
    rightImage: "/images/lily-floral-dessert-4x5.webp",
    time: "5:00 PM",
    title: "Sunday at Lily",
    year: 2026,
  },
] as const

export const weekdays = [
  ["Sunday", "Su"],
  ["Monday", "Mo"],
  ["Tuesday", "Tu"],
  ["Wednesday", "We"],
  ["Thursday", "Th"],
  ["Friday", "Fr"],
  ["Saturday", "Sa"],
] as const

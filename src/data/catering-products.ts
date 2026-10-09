export const cateringCategories = [
  { id: "passed-bites", label: "Passed bites" },
  { id: "boards-platters", label: "Boards & platters" },
  { id: "entrees", label: "Entrées" },
  { id: "sides-salads", label: "Sides & salads" },
  { id: "desserts", label: "Desserts" },
] as const

export type CateringCategory = (typeof cateringCategories)[number]["id"]

export type CateringPortion = {
  label: string
  priceCents: number
  serves: string
}

export type CateringProduct = {
  addedAt: string
  category: CateringCategory
  description: string
  image: string
  imageAlt: string
  name: string
  photo: {
    photographer: string
    profileUrl: string
    sourceUrl: string
  }
  portions: readonly [CateringPortion, ...CateringPortion[]]
  slug: string
}

const standardPortions = (small: number, medium: number, large: number) =>
  [
    { label: "Small", priceCents: small, serves: "Serves 8–10" },
    { label: "Medium", priceCents: medium, serves: "Serves 14–16" },
    { label: "Large", priceCents: large, serves: "Serves 20–24" },
  ] as const

export const cateringProducts: readonly CateringProduct[] = [
  {
    addedAt: "2026-10-08",
    category: "passed-bites",
    description:
      "Tender salmon with fresh herbs, citrus, and a delicate rye crisp. Designed to move easily through a room and disappear in a bite or two.",
    image: "/catering/salmon-bites.webp",
    imageAlt: "Salmon bites arranged on small plates with greens",
    name: "Salmon Rye Bites",
    photo: {
      photographer: "Katarzyna Pracuch",
      profileUrl: "https://unsplash.com/@catherinethebrave",
      sourceUrl: "https://unsplash.com/photos/V98W_4pCrVA",
    },
    portions: standardPortions(5400, 8200, 11600),
    slug: "salmon-rye-bites",
  },
  {
    addedAt: "2026-10-03",
    category: "boards-platters",
    description:
      "A generous selection of cheeses, seasonal fruit, preserves, toasted nuts, and house crackers, composed for an effortless cocktail hour.",
    image: "/catering/cheese-board.webp",
    imageAlt: "Cheese board with crackers, fruit, and accompaniments",
    name: "Cellar Cheese Board",
    photo: {
      photographer: "Natalia Rüdisüli",
      profileUrl: "https://unsplash.com/@nruedisueli",
      sourceUrl: "https://unsplash.com/photos/Ijp5eB0bv5E",
    },
    portions: standardPortions(7200, 10800, 15200),
    slug: "cellar-cheese-board",
  },
  {
    addedAt: "2026-09-28",
    category: "entrees",
    description:
      "Handmade pasta folded with roasted mushrooms, greens, herbs, and a restrained pan sauce. Rich enough for a main course, balanced enough for the whole table.",
    image: "/catering/mushroom-pasta.webp",
    imageAlt: "Pasta with roasted mushrooms and herbs on a white plate",
    name: "Roasted Mushroom Cavatelli",
    photo: {
      photographer: "Eaters Collective",
      profileUrl: "https://unsplash.com/@eaterscollective",
      sourceUrl: "https://unsplash.com/photos/ddZYOtZUnBk",
    },
    portions: standardPortions(8800, 13200, 17600),
    slug: "roasted-mushroom-cavatelli",
  },
  {
    addedAt: "2026-09-21",
    category: "passed-bites",
    description:
      "Creamy burrata with ripe tomatoes, tender greens, basil oil, and crisp bread. A bright opening plate for showers, lunches, and evening gatherings.",
    image: "/catering/burrata.webp",
    imageAlt: "Burrata with tomatoes and greens",
    name: "Burrata & Market Tomatoes",
    photo: {
      photographer: "Janesca",
      profileUrl: "https://unsplash.com/@janesca",
      sourceUrl: "https://unsplash.com/photos/Nu3IcDmYBV8",
    },
    portions: standardPortions(4600, 7000, 9800),
    slug: "burrata-market-tomatoes",
  },
  {
    addedAt: "2026-09-12",
    category: "entrees",
    description:
      "Slow-roasted beef with pan jus, charred onions, and seasonal accompaniments. Carved before delivery and ready to anchor a generous table.",
    image: "/catering/roasted-meat-platter.webp",
    imageAlt: "Roasted meats arranged on a serving platter",
    name: "Herb-Roasted Beef",
    photo: {
      photographer: "aboodi vesakaran",
      profileUrl: "https://unsplash.com/@aboodi_vm",
      sourceUrl: "https://unsplash.com/photos/Sp-PhArYTlk",
    },
    portions: standardPortions(14500, 21400, 28600),
    slug: "herb-roasted-beef",
  },
  {
    addedAt: "2026-09-02",
    category: "sides-salads",
    description:
      "A colorful market salad finished with pomegranate, tomatoes, tender leaves, and a bright house vinaigrette. Delivered dressed just before service.",
    image: "/catering/pomegranate-salad.webp",
    imageAlt: "Fresh garden salad with tomatoes and pomegranate",
    name: "Pomegranate Garden Salad",
    photo: {
      photographer: "Lefteris Kallergis",
      profileUrl: "https://unsplash.com/@lefterisk",
      sourceUrl: "https://unsplash.com/photos/NQZiQxuIyFk",
    },
    portions: standardPortions(5200, 7600, 10400),
    slug: "pomegranate-garden-salad",
  },
  {
    addedAt: "2026-08-24",
    category: "entrees",
    description:
      "Silky pasta with brown butter, aged cheese, black pepper, and herbs. Familiar, polished, and built for passing around the table.",
    image: "/catering/carbonara.webp",
    imageAlt: "Carbonara pasta with cheese and herbs",
    name: "Brown Butter Carbonara",
    photo: {
      photographer: "Bruna Branco",
      profileUrl: "https://unsplash.com/@brunabranco",
      sourceUrl: "https://unsplash.com/photos/t8hTmte4O_g",
    },
    portions: standardPortions(9600, 14200, 18800),
    slug: "brown-butter-carbonara",
  },
  {
    addedAt: "2026-08-11",
    category: "boards-platters",
    description:
      "A vibrant table of seasonal fruit, crisp vegetables, herbs, and house dips. Built for all-day meetings, showers, and grazing before dinner.",
    image: "/catering/garden-platter.webp",
    imageAlt: "Colorful fruit and vegetable platter with dips",
    name: "Garden Crudités Board",
    photo: {
      photographer: "Jose Marroquin",
      profileUrl: "https://unsplash.com/@josemarroquin",
      sourceUrl: "https://unsplash.com/photos/hoHAgMdVxI8",
    },
    portions: standardPortions(4800, 7400, 10200),
    slug: "garden-crudites-board",
  },
  {
    addedAt: "2026-07-30",
    category: "sides-salads",
    description:
      "Roasted market vegetables with citrus, toasted seeds, and tender herbs. Equally at home beside a main course or at the center of a vegetarian table.",
    image: "/catering/roasted-vegetables.webp",
    imageAlt: "Roasted vegetables with citrus and herbs",
    name: "Charred Market Vegetables",
    photo: {
      photographer: "Adam Jaime",
      profileUrl: "https://unsplash.com/@arobj",
      sourceUrl: "https://unsplash.com/photos/oFljzK61O1s",
    },
    portions: standardPortions(5800, 8600, 11800),
    slug: "charred-market-vegetables",
  },
  {
    addedAt: "2026-07-14",
    category: "desserts",
    description:
      "A gently sweet cheesecake with caramel, cream, and a touch of sea salt. Delivered whole and ready to finish the table without fuss.",
    image: "/catering/cheesecake.webp",
    imageAlt: "Slice of caramel cheesecake served on a ceramic plate",
    name: "Salted Caramel Cheesecake",
    photo: {
      photographer: "Mohammadreza Alidoost",
      profileUrl: "https://unsplash.com/@mohammadrezaalidoost",
      sourceUrl: "https://unsplash.com/photos/xacOkVZnGfo",
    },
    portions: standardPortions(6400, 9200, 12600),
    slug: "salted-caramel-cheesecake",
  },
] as const

export const cateringPriceBounds = cateringProducts.reduce(
  (bounds, product) => ({
    max: Math.max(bounds.max, product.portions[0].priceCents),
    min: Math.min(bounds.min, product.portions[0].priceCents),
  }),
  { max: 0, min: Number.POSITIVE_INFINITY },
)

const cateringPriceFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
})

export const formatCateringPrice = (priceCents: number) =>
  cateringPriceFormatter.format(priceCents / 100)

export const getCateringProduct = (slug: string) =>
  cateringProducts.find((product) => product.slug === slug)

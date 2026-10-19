export const menuCategorySlugs = ["mains", "salads", "desserts", "drinks"] as const

export type MenuCategorySlug = (typeof menuCategorySlugs)[number]

export type MenuItem = {
  name: string
  description: string
  price: string
}

export type MenuSection = {
  title: string
  description: string
  image: string
  imageAlt: string
  items: readonly MenuItem[]
}

export type MenuCategory = {
  slug: MenuCategorySlug
  name: string
  description: string
  image: string
  imageAlt: string
  sections: readonly MenuSection[]
}

export const menuCategories: readonly MenuCategory[] = [
  {
    slug: "mains",
    name: "Mains",
    description:
      "Market-led plates built around pristine fish, handmade pasta, and vegetables at their seasonal peak.",
    image: "/images/lily-seasonal-main-dish-4x5.webp",
    imageAlt: "A seasonal main dish plated at Lily",
    sections: [
      {
        title: "From the garden",
        description:
          "Vegetable-led plates that move with the farms, finished with bright herbs and patient sauces.",
        image: "/images/menu-main-plated-unsplash.jpg",
        imageAlt: "A composed plate of seasonal vegetables",
        items: [
          {
            name: "Roasted Honeynut Squash",
            description: "Brown butter, toasted hazelnut, sage, and cider glaze.",
            price: "$24",
          },
          {
            name: "Charred Cauliflower",
            description: "Sunflower tahini, golden raisin, caper, and preserved lemon.",
            price: "$23",
          },
          {
            name: "Wild Mushroom Mafaldine",
            description: "Hand-cut pasta, roasted mushroom, thyme, and aged parmesan.",
            price: "$29",
          },
          {
            name: "Ricotta Gnudi",
            description: "Delicata squash, brown butter, pepita, and crispy rosemary.",
            price: "$28",
          },
          {
            name: "Crispy Eggplant",
            description: "Smoked tomato, whipped feta, basil, and chile honey.",
            price: "$25",
          },
          {
            name: "Farro Verde",
            description: "Broccoli leaf pesto, grilled leek, pecorino, and lemon crumb.",
            price: "$26",
          },
        ],
      },
      {
        title: "From the hearth",
        description:
          "Generous center-of-the-table cooking, shaped by smoke, the season, and our local producers.",
        image: "/images/menu-main-pasta-unsplash.jpg",
        imageAlt: "Fresh pasta served with a seasonal sauce",
        items: [
          {
            name: "Seared Market Fish",
            description: "Celery root, braised fennel, mussel broth, and dill oil.",
            price: "$36",
          },
          {
            name: "Heritage Chicken",
            description: "Roasted breast, confit leg, cipollini, and natural jus.",
            price: "$34",
          },
          {
            name: "Short Rib Agnolotti",
            description: "Braised beef, black garlic, charred onion, and parmesan brodo.",
            price: "$32",
          },
          {
            name: "Cider-Glazed Pork",
            description: "Creamed cabbage, mustard seed, apple, and rosemary jus.",
            price: "$35",
          },
          {
            name: "Dry-Aged Striploin",
            description: "Potato pavé, roasted shallot, watercress, and bordelaise.",
            price: "$46",
          },
          {
            name: "Whole Roasted Branzino",
            description: "Fennel, green olive, preserved lemon, and saffron broth.",
            price: "$42",
          },
        ],
      },
    ],
  },
  {
    slug: "salads",
    name: "Salads",
    description:
      "Crisp leaves, market vegetables, fresh herbs, and bright dressings composed with a light touch.",
    image: "/images/menu-main-plated-unsplash.jpg",
    imageAlt: "A bright plate of seasonal greens and vegetables",
    sections: [
      {
        title: "Market leaves",
        description:
          "Tender greens and raw vegetables, dressed to order and built for a lively first course.",
        image: "/images/catering/pomegranate-salad.webp",
        imageAlt: "Seasonal salad with pomegranate and fresh greens",
        items: [
          {
            name: "Little Gem Caesar",
            description: "Parmesan, sourdough crumb, white anchovy, and lemon.",
            price: "$16",
          },
          {
            name: "Lily House Greens",
            description: "Tender herbs, shaved radish, fines herbes, and champagne vinaigrette.",
            price: "$15",
          },
          {
            name: "Winter Chicories",
            description: "Pear, walnut, blue cheese, and maple-sherry vinaigrette.",
            price: "$17",
          },
          {
            name: "Arugula & Fennel",
            description: "Citrus, pecorino, toasted almond, and cracked pepper.",
            price: "$16",
          },
          {
            name: "Butter Lettuce",
            description: "Green goddess, avocado, cucumber, and sunflower seed.",
            price: "$17",
          },
          {
            name: "Shaved Kale",
            description: "Apple, aged cheddar, rye crumb, and mustard vinaigrette.",
            price: "$16",
          },
        ],
      },
      {
        title: "Composed salads",
        description:
          "More substantial plates layered with roasted produce, grains, cheese, and garden herbs.",
        image: "/images/catering/garden-platter.webp",
        imageAlt: "A generous platter of garden vegetables and herbs",
        items: [
          {
            name: "Roasted Beet & Citrus",
            description: "Cara cara orange, chèvre, pistachio, and tarragon.",
            price: "$19",
          },
          {
            name: "Burrata & Persimmon",
            description: "Bitter greens, pumpkin seed, balsamic, and grilled bread.",
            price: "$21",
          },
          {
            name: "Warm Farro",
            description: "Roasted squash, kale, date, feta, and cumin vinaigrette.",
            price: "$20",
          },
          {
            name: "Endive & Smoked Trout",
            description: "Potato, soft egg, dill, and horseradish crème fraîche.",
            price: "$22",
          },
          {
            name: "Charred Broccolini",
            description: "White bean, pecorino, pickled chile, and lemon.",
            price: "$19",
          },
          {
            name: "Grilled Radicchio",
            description: "Concord grape, taleggio, hazelnut, and rosemary honey.",
            price: "$20",
          },
        ],
      },
    ],
  },
  {
    slug: "desserts",
    name: "Desserts",
    description:
      "Floral, fruit-forward finishes and quietly indulgent classics made for one more shared course.",
    image: "/images/lily-floral-dessert-4x5.webp",
    imageAlt: "A floral seasonal dessert finished for the table",
    sections: [
      {
        title: "From the pastry kitchen",
        description:
          "Seasonal fruit, deep chocolate, and delicate creams made in house each afternoon.",
        image: "/images/menu-dessert-plated-unsplash.jpg",
        imageAlt: "An elegant plated dessert with seasonal fruit",
        items: [
          {
            name: "Brown Butter Pear Cake",
            description: "Poached pear, crème fraîche, oat streusel, and bay leaf.",
            price: "$14",
          },
          {
            name: "Dark Chocolate Crémeux",
            description: "Cocoa nib, olive oil, sea salt, and malted milk sorbet.",
            price: "$15",
          },
          {
            name: "Meyer Lemon Tart",
            description: "Toasted meringue, pistachio, and citrus blossom.",
            price: "$14",
          },
          {
            name: "Apple Tarte Tatin",
            description: "Caramelized apple, buckwheat, and vanilla bean ice cream.",
            price: "$15",
          },
          {
            name: "Buttermilk Panna Cotta",
            description: "Persimmon, ginger, almond, and orange marigold.",
            price: "$13",
          },
          {
            name: "Espresso Semifreddo",
            description: "Amaro caramel, hazelnut praline, and dark chocolate.",
            price: "$14",
          },
        ],
      },
      {
        title: "A little more",
        description:
          "Small, thoughtful endings for lingering over coffee or sharing around the table.",
        image: "/images/menu-dessert-cake-unsplash.jpg",
        imageAlt: "A layered cake prepared for dessert service",
        items: [
          {
            name: "Lily Cake",
            description: "Vanilla chiffon, raspberry, rose cream, and white chocolate.",
            price: "$16",
          },
          {
            name: "Warm Madeleines",
            description: "Brown butter, lemon sugar, and seasonal preserve.",
            price: "$11",
          },
          {
            name: "Affogato",
            description: "Vanilla bean gelato, espresso, and cocoa nib brittle.",
            price: "$10",
          },
          {
            name: "Seasonal Sorbets",
            description: "A daily trio made with market fruit and fresh herbs.",
            price: "$12",
          },
          {
            name: "Cheese Selection",
            description: "Three artisan cheeses, fruit mostarda, and seeded crackers.",
            price: "$18",
          },
          {
            name: "Chocolate Truffles",
            description: "Sea salt caramel, black tea, and toasted hazelnut.",
            price: "$9",
          },
        ],
      },
    ],
  },
  {
    slug: "drinks",
    name: "Drinks",
    description:
      "Garden herbs, ripe fruit, thoughtful spirits, and cocktails designed to sit beautifully beside dinner.",
    image: "/images/lily-botanical-cocktail-4x5.webp",
    imageAlt: "A botanical cocktail mixed at Lily",
    sections: [
      {
        title: "Garden cocktails",
        description:
          "Bright, balanced drinks drawn from the greenhouse, orchard, and a carefully stocked back bar.",
        image: "/images/menu-drink-golden-unsplash.jpg",
        imageAlt: "A golden cocktail garnished for evening service",
        items: [
          {
            name: "Lily Spritz",
            description: "Elderflower, dry vermouth, sparkling wine, and lemon thyme.",
            price: "$16",
          },
          {
            name: "Velvet Season",
            description: "Gin, concord grape, fino sherry, and rosemary.",
            price: "$17",
          },
          {
            name: "Orchard Old Fashioned",
            description: "Bourbon, apple brandy, maple, and aromatic bitters.",
            price: "$18",
          },
          {
            name: "Garden Gimlet",
            description: "Vodka, basil, cucumber, lime, and green peppercorn.",
            price: "$16",
          },
          {
            name: "Golden Hour",
            description: "Aged rum, apricot, amontillado, and toasted spice.",
            price: "$18",
          },
          {
            name: "After the Rain",
            description: "Mezcal, pear, gentian, lemon, and smoked salt.",
            price: "$17",
          },
        ],
      },
      {
        title: "Wine & zero-proof",
        description:
          "A short list of food-friendly pours alongside spirit-free drinks with equal depth and care.",
        image: "/images/menu-drink-red-unsplash.jpg",
        imageAlt: "A red cocktail served in a stemmed glass",
        items: [
          {
            name: "Sparkling — Brut Rosé",
            description: "Fine bubbles, wild strawberry, citrus peel, and chalk.",
            price: "$17",
          },
          {
            name: "White — Grüner Veltliner",
            description: "Green pear, white pepper, alpine herbs, and mineral finish.",
            price: "$15",
          },
          {
            name: "Orange — Ribolla Gialla",
            description: "Apricot skin, chamomile, citrus oil, and gentle tannin.",
            price: "$16",
          },
          {
            name: "Red — Pinot Noir",
            description: "Tart cherry, forest floor, baking spice, and silky texture.",
            price: "$17",
          },
          {
            name: "Pear & Chamomile",
            description: "Pear shrub, chamomile, verjus, and sparkling water.",
            price: "$11",
          },
          {
            name: "Rosemary & Grapefruit",
            description: "Ruby grapefruit, rosemary, tonic, and sea salt.",
            price: "$11",
          },
        ],
      },
    ],
  },
]

export function isMenuCategorySlug(value: string): value is MenuCategorySlug {
  return menuCategorySlugs.some((slug) => slug === value)
}

export function getMenuCategory(slug: MenuCategorySlug) {
  return menuCategories.find((category) => category.slug === slug)!
}

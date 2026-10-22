export const menuCategorySlugs = ["starters", "salads", "mains", "desserts"] as const

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
    slug: "starters",
    name: "Starters",
    description: "Raw bar, small plates, and snacks to open the table, built for sharing.",
    image: "/images/catering/burrata.webp",
    imageAlt: "A starter plated at Lily",
    sections: [
      {
        title: "Raw & chilled",
        description: "Oysters, crudo, and tartare, kept cold and dressed simply.",
        image: "/images/catering/salmon-bites.webp",
        imageAlt: "Chilled raw bar bites",
        items: [
          {
            name: "Oysters*",
            description: "Seasonal mignonette, horseradish.",
            price: "MP",
          },
          {
            name: "Dry Aged Steak Tartare*",
            description: "Dry aged steak, egg yolk jam, potato chips, fried oyster.",
            price: "23",
          },
          {
            name: "Scallop Crudo*",
            description: "Apple, celery, hazelnut chili crisp, tarragon.",
            price: "22",
          },
          {
            name: "Shrimp Cocktail",
            description: "Bloody mary cocktail sauce, lemon.",
            price: "21",
          },
          {
            name: "Marinated Olives",
            description: "Castelvetrano olive, nduja, almond, grana padano.",
            price: "11",
          },
        ],
      },
      {
        title: "From the kitchen",
        description: "Hot small plates for the middle of the table.",
        image: "/images/catering/cheese-board.webp",
        imageAlt: "Small plates for sharing",
        items: [
          {
            name: "Clam Chowder",
            description: "Crispy clams, potato, pork belly, house made oyster cracker.",
            price: "14",
          },
          {
            name: "Crispy Brussels Sprouts",
            description: "Dijon vinaigrette, chives, gruyere.",
            price: "16",
          },
          {
            name: "Fritto Misto",
            description: "Calamari, shrimp, oyster, calabrian chili aioli, lemon.",
            price: "22",
          },
          {
            name: "Pork Belly",
            description: "Lettuce cups, miso caramel, pickled radish.",
            price: "19",
          },
          {
            name: "Pimento Arancini",
            description: "Pimento cheese, Benton's country ham, alabama white sauce.",
            price: "19",
          },
          {
            name: "Bone Marrow",
            description: "Herb salad with brown butter vinaigrette.",
            price: "23",
          },
          {
            name: "Octopus Tostada",
            description: "Aji amarillo, salsa fresca, avocado.",
            price: "19",
          },
          {
            name: "Sweet Potato",
            description: "Onion soubise, hazelnut praline, chili crunch.",
            price: "17",
          },
        ],
      },
    ],
  },
  {
    slug: "salads",
    name: "Salads",
    description:
      "Crisp leaves, market vegetables, and bright dressings composed with a light touch.",
    image: "/images/menu-main-plated-unsplash.jpg",
    imageAlt: "A bright plate of seasonal greens",
    sections: [
      {
        title: "Salads",
        description: "Classic and seasonal salads, dressed to order.",
        image: "/images/catering/pomegranate-salad.webp",
        imageAlt: "A seasonal salad",
        items: [
          {
            name: "Caesar",
            description: "Romaine hearts, garlic bread crumb, crispy caper.",
            price: "14",
          },
          {
            name: "Wedge",
            description: "Pork belly, blue cheese, confit tomato, chive, green goddess.",
            price: "16",
          },
          {
            name: "Lyonnaise*",
            description: "Frisée, lardon, poached egg, dijon vinaigrette.",
            price: "16",
          },
          {
            name: "Squash Salad",
            description: "Stracciatella, endive, black pepper and apple vinaigrette.",
            price: "15",
          },
        ],
      },
    ],
  },
  {
    slug: "mains",
    name: "Mains",
    description: "Dry aged steaks, seafood, and generous plates built around local producers.",
    image: "/images/lily-seasonal-main-dish-4x5.webp",
    imageAlt: "A main dish plated at Lily",
    sections: [
      {
        title: "From the land",
        description: "Steaks, chops, and slow-cooked plates from the hearth.",
        image: "/images/menu-main-pasta-unsplash.jpg",
        imageAlt: "A plated main course",
        items: [
          {
            name: "Dry Aged Strip Steak*",
            description: "Aligot potato, local mushroom, peppercorn sauce.",
            price: "65",
          },
          {
            name: "Surf & Turf*",
            description: "Filet, butter poached lobster tail, pave potato.",
            price: "69",
          },
          {
            name: "Chicken Ballotine",
            description: "Fondant potato, french beans, roasted chicken jus.",
            price: "37",
          },
          {
            name: "Pork Chop*",
            description: "Apple butter, brussels sprouts, fried potato, pickled apples.",
            price: "43",
          },
          {
            name: "Veal Chop Milanese",
            description: "Arugula, parmesan, charred lemon.",
            price: "71",
          },
          {
            name: "Duck*",
            description: "Pumpkin mole, masa spaetzle, fresh herb salad.",
            price: "39",
          },
          {
            name: "House Burger*",
            description: "House ground beef, cooper sharp, house pickles.",
            price: "29",
          },
          {
            name: "Short Rib",
            description:
              "Bone in short rib, potato parsnip puree, baby carrots, cranberry chipotle demi.",
            price: "46",
          },
          {
            name: "Sweet Potato Gnocchi",
            description: "Duck ragu, brussels sprouts, gruyere.",
            price: "33",
          },
        ],
      },
      {
        title: "From the sea",
        description: "Fish and shellfish, cooked simply and finished bright.",
        image: "/images/menu-main-plated-unsplash.jpg",
        imageAlt: "A seafood main course",
        items: [
          {
            name: "Pan Roasted Scallop*",
            description: "Cauliflower, brown butter, olive, raisin.",
            price: "50",
          },
          {
            name: "Maryland Crab Cake",
            description: "Fall vegetable succotash, tartar sauce.",
            price: "44",
          },
          {
            name: "Branzino",
            description: "Broiled, salsa verde, herb salad, charred lemon.",
            price: "42",
          },
        ],
      },
    ],
  },
  {
    slug: "desserts",
    name: "Desserts",
    description: "Warm, comforting finishes made for one more shared course.",
    image: "/images/lily-floral-dessert-4x5.webp",
    imageAlt: "A dessert finished for the table",
    sections: [
      {
        title: "Desserts",
        description: "Made in house each afternoon.",
        image: "/images/menu-dessert-plated-unsplash.jpg",
        imageAlt: "A plated dessert",
        items: [
          {
            name: "Olive Oil Cake",
            description: "Bourbon caramel, apple italian meringue, compressed apples.",
            price: "13",
          },
          {
            name: "S'mores Crème Brulee",
            description: "Chocolate brulee, toasted marshmallow, graham cracker.",
            price: "13",
          },
          {
            name: "Bread Pudding",
            description: "Pumpkin espresso, vanilla cinnamon crème anglaise, toasted pecans.",
            price: "13",
          },
          {
            name: "Apple Beignets",
            description: "Brown butter bourbon ice cream, pickled apples, cider sugar.",
            price: "13",
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

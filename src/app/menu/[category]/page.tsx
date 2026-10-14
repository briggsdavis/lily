import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { CmsMenuPage } from "@/components/cms-menu"
import { MenuSections } from "@/components/menu-sections"
import {
  getMenuCategory,
  isMenuCategorySlug,
  menuCategorySlugs,
  type MenuCategorySlug,
} from "@/data/menu"

type MenuCategoryPageProps = {
  params: Promise<{ category: string }>
}

function resolveCategory(value: string) {
  if (!isMenuCategorySlug(value)) notFound()
  return getMenuCategory(value)
}

export const dynamicParams = true

export function generateStaticParams(): Array<{ category: MenuCategorySlug }> {
  return menuCategorySlugs.map((category) => ({ category }))
}

export async function generateMetadata({ params }: MenuCategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  if (!isMenuCategorySlug(slug))
    return { title: "Menu", description: "Explore Lily's current menu." }
  const category = getMenuCategory(slug)

  return {
    title: `${category.name} Menu`,
    description: category.description,
  }
}

export default async function MenuCategoryPage({ params }: MenuCategoryPageProps) {
  const { category: slug } = await params
  if (process.env.NEXT_PUBLIC_CONVEX_URL) return <CmsMenuPage slug={slug} />
  const category = resolveCategory(slug)

  return <MenuSections category={category} />
}

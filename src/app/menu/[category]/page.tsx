import type { Metadata } from "next"
import { notFound } from "next/navigation"
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

export const dynamicParams = false

export function generateStaticParams(): Array<{ category: MenuCategorySlug }> {
  return menuCategorySlugs.map((category) => ({ category }))
}

export async function generateMetadata({ params }: MenuCategoryPageProps): Promise<Metadata> {
  const { category: slug } = await params
  const category = resolveCategory(slug)

  return {
    title: `${category.name} Menu`,
    description: category.description,
  }
}

export default async function MenuCategoryPage({ params }: MenuCategoryPageProps) {
  const { category: slug } = await params
  const category = resolveCategory(slug)

  return <MenuSections category={category} />
}

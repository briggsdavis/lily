import type { MenuPageRecord } from "@/lib/admin-api"

// Database documents include system fields at runtime. Send only mutation inputs.
export function menuSavePayload(page: MenuPageRecord) {
  return {
    id: page._id,
    archived: page.archived,
    description: page.description,
    heroImage: page.heroImage,
    heroImageAlt: page.title,
    order: page.order,
    sections: page.sections.map((section) => ({ ...section, imageAlt: section.title })),
    slug: page.slug,
    title: page.title,
  }
}

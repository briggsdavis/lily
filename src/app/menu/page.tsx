import { MenuLanding } from "@/components/menu-landing"
import { requirePageEnabled } from "@/lib/page-gate"

export const revalidate = 60

export default async function MenuPage() {
  await requirePageEnabled("/menu")
  return <MenuLanding />
}

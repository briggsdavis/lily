import { HomeContent } from "@/components/home-content"
import { PublishedPage } from "@/components/page-content"
import { requirePageEnabled } from "@/lib/page-gate"
export const revalidate = 60

export default async function HomePage() {
  await requirePageEnabled("/")
  return (
    <PublishedPage page="home">
      <HomeContent />
    </PublishedPage>
  )
}

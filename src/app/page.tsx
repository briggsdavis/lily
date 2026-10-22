import { HomeContent } from "@/components/home-content"
import { PublishedPage } from "@/components/page-content"
export default function HomePage() {
  return (
    <PublishedPage page="home">
      <HomeContent />
    </PublishedPage>
  )
}

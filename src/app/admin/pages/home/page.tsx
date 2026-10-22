import { AdminPageMedia } from "@/components/admin-page-media"
import { AdminHeader } from "@/components/admin-ui"
export default function Page() {
  return (
    <div>
      <AdminHeader eyebrow="Page editor" title="Home" />
      <AdminPageMedia page="home" />
    </div>
  )
}

import { AdminInquiries } from "@/components/admin-inquiries"
import { AdminPageMedia } from "@/components/admin-page-media"

export default function CateringAdminPage() {
  return (
    <>
      <AdminPageMedia page="catering" />
      <AdminInquiries kind="catering" />
    </>
  )
}

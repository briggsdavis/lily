import { AdminInquiries } from "@/components/admin-inquiries"
import { AdminPageMedia } from "@/components/admin-page-media"

export default function ContactAdminPage() {
  return (
    <>
      <AdminPageMedia page="contact" />
      <AdminInquiries kind="contact" />
    </>
  )
}

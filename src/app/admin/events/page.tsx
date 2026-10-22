import { AdminEvents } from "@/components/admin-events"
import { AdminPageMedia } from "@/components/admin-page-media"

export default function EventsAdminPage() {
  return (
    <>
      <AdminPageMedia page="events" />
      <AdminEvents />
    </>
  )
}

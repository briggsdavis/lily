import { AdminMenuEditor } from "@/components/admin-menu-editor"

export default async function EditMenuPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <AdminMenuEditor id={id} />
}

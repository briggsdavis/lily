import { AdminHeader } from "@/components/admin-ui"

export default function HomeEditorPlaceholder() {
  return (
    <div>
      <AdminHeader eyebrow="Page editor" title="Home" />
      <div className="border border-dashed border-deep-brown/25 p-10">
        <p className="font-display text-3xl">Editor intentionally not built yet</p>
        <p className="mt-2 max-w-xl text-sm opacity-70">
          Home appears in the navigation structure, ready for a future editor.
        </p>
      </div>
    </div>
  )
}

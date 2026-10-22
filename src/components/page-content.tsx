"use client"

import { useQuery } from "convex/react"
import { createContext, useContext, type ReactNode, type Ref, type HTMLAttributes } from "react"
import type { EditablePage, PageFields, DraftMedia, FieldKind } from "@/lib/visual-page"
import { api } from "../../convex/_generated/api"

export type EditSelection = { key: string; kind: FieldKind | "media"; value: string; href?: string }
type ContentContext = {
  page: EditablePage
  fields: PageFields
  editing: boolean
  media: DraftMedia[]
  select?: (selection: EditSelection) => void
}
export const PageContentContext = createContext<ContentContext | null>(null)
export const usePageContent = () => useContext(PageContentContext)
export const useEditorMode = () => usePageContent()?.editing ?? false
export function PublishedPage({ page, children }: { page: EditablePage; children: ReactNode }) {
  return process.env.NEXT_PUBLIC_CONVEX_URL ? (
    <ConnectedPage page={page}>{children}</ConnectedPage>
  ) : (
    <>{children}</>
  )
}
function ConnectedPage({ page, children }: { page: EditablePage; children: ReactNode }) {
  const data = useQuery(api.visualPages.published, { page })
  return (
    <PageContentContext.Provider
      value={{ page, fields: data?.fields ?? {}, editing: false, media: [] }}
    >
      {children}
    </PageContentContext.Provider>
  )
}
export function EditableText({ field, children }: { field: string; children: ReactNode }) {
  const content = usePageContent()
  const value = content?.fields[field]
  if (!content?.editing) return <span className="whitespace-pre-line">{value ?? children}</span>
  return (
    <button
      type="button"
      data-edit-field={field}
      className="inline cursor-text rounded-sm [text-align:inherit] whitespace-pre-line outline-offset-4 [font:inherit] hover:outline hover:outline-1 hover:outline-current focus-visible:outline"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        content.select?.({
          key: field,
          kind: "text",
          value: value ?? event.currentTarget.innerText,
        })
      }}
    >
      {value ?? children}
    </button>
  )
}

export function ColorSection({
  field,
  as: Tag = "section",
  children,
  style,
  ref,
  ...props
}: HTMLAttributes<HTMLElement> & {
  field: string
  as?: "section" | "div"
  ref?: Ref<HTMLElement>
}) {
  const content = usePageContent()
  return (
    <Tag
      {...props}
      ref={(node) => {
        if (typeof ref === "function") ref(node)
        else if (ref) ref.current = node
      }}
      className={`${props.className ?? ""} ${content?.editing ? "relative" : ""}`}
      style={{
        ...style,
        ...(content?.fields[field] ? { backgroundColor: content.fields[field] } : {}),
      }}
      data-section-color={field}
    >
      {content?.editing && field && (
        <button
          type="button"
          data-editor-control="color"
          className="absolute top-3 left-3 z-40 cursor-pointer rounded-full border border-black/15 bg-white px-3 py-2 font-body text-xs font-semibold text-deep-brown shadow-sm"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            const element = event.currentTarget.parentElement!
            const color =
              element.ownerDocument.defaultView!.getComputedStyle(element).backgroundColor
            const canvas = element.ownerDocument.createElement("canvas")
            canvas.width = canvas.height = 1
            const ctx = canvas.getContext("2d")!
            ctx.fillStyle = color
            ctx.fillRect(0, 0, 1, 1)
            const rgb = ctx.getImageData(0, 0, 1, 1).data
            const hex =
              "#" +
              Array.from(rgb)
                .slice(0, 3)
                .map((value) => value.toString(16).padStart(2, "0"))
                .join("")
            content.select?.({ key: field, kind: "color", value: content.fields[field] ?? hex })
          }}
        >
          Section color
        </button>
      )}
      {children}
    </Tag>
  )
}

export function MediaEditControl({ mediaKey }: { mediaKey: string }) {
  const content = usePageContent()
  if (!content?.editing) return null
  return (
    <button
      type="button"
      data-editor-control="media"
      aria-label={`Change ${mediaKey} media`}
      className="absolute top-3 right-3 z-40 cursor-pointer rounded-full border border-black/15 bg-white px-3 py-2 font-body text-xs font-semibold text-deep-brown shadow-sm"
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        content.select?.({ key: mediaKey, kind: "media", value: "" })
      }}
    >
      Change media
    </button>
  )
}

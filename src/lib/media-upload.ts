import { imageLimitMb, mediaFileKind, videoLimitMb } from "@/lib/page-media"

export async function uploadMediaFile(
  file: File,
  allowVideo: boolean,
  services: {
    generateUrl: () => Promise<string>
    resolveUrl: (storageId: string) => Promise<string | null>
    request?: typeof fetch
  },
) {
  const kind = mediaFileKind(file.type, file.size, allowVideo)
  if (!kind)
    throw new Error(
      allowVideo
        ? `Choose an image up to ${imageLimitMb} MB or an MP4/WebM video up to ${videoLimitMb} MB.`
        : `Choose an image up to ${imageLimitMb} MB.`,
    )
  const response = await (services.request ?? fetch)(await services.generateUrl(), {
    method: "POST",
    body: file,
    headers: { "Content-Type": file.type },
  })
  if (!response.ok) throw new Error("Upload failed. Please try again.")
  const payload: unknown = await response.json()
  if (
    !payload ||
    typeof payload !== "object" ||
    !("storageId" in payload) ||
    typeof payload.storageId !== "string"
  )
    throw new Error("Upload failed. Please try again.")
  const url = await services.resolveUrl(payload.storageId)
  if (!url) throw new Error("The uploaded file could not be loaded. Please try again.")
  return { storageId: payload.storageId, url, kind }
}

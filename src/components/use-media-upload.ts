"use client"
import { useMutation } from "convex/react"
import { useCallback } from "react"
import { uploadMediaFile } from "@/lib/media-upload"
import { api } from "../../convex/_generated/api"
import type { Id } from "../../convex/_generated/dataModel"

export function useMediaUpload() {
  const generate = useMutation(api.files.generateUploadUrl)
  const resolve = useMutation(api.files.resolveUpload)
  return useCallback(
    (file: File, allowVideo = false) =>
      uploadMediaFile(file, allowVideo, {
        generateUrl: () => generate({}),
        resolveUrl: (storageId) => resolve({ storageId: storageId as Id<"_storage"> }),
      }),
    [generate, resolve],
  )
}

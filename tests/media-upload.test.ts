import assert from "node:assert/strict"
import { test } from "node:test"
import { uploadMediaFile } from "../src/lib/media-upload"
const file = () => new File(["image"], "photo.png", { type: "image/png" })

test("invalid uploads stop before requesting storage", async () => {
  let generated = false
  await assert.rejects(
    () =>
      uploadMediaFile(new File(["bad"], "bad.txt", { type: "text/plain" }), false, {
        generateUrl: async () => {
          generated = true
          return "unused"
        },
        resolveUrl: async () => null,
      }),
    /Choose an image/,
  )
  assert.equal(generated, false)
})
test("failed upload responses never resolve or publish media", async () => {
  let resolved = false
  await assert.rejects(
    () =>
      uploadMediaFile(file(), false, {
        generateUrl: async () => "https://example.com/upload",
        request: async () => new Response("failed", { status: 500 }),
        resolveUrl: async () => {
          resolved = true
          return null
        },
      }),
    /Upload failed/,
  )
  assert.equal(resolved, false)
})
test("malformed upload responses and unresolved files return useful errors", async () => {
  for (const payload of [{}, null, { storageId: 123 }])
    await assert.rejects(
      () =>
        uploadMediaFile(file(), false, {
          generateUrl: async () => "url",
          request: async () => Response.json(payload),
          resolveUrl: async () => "url",
        }),
      /Upload failed/,
    )
  await assert.rejects(
    () =>
      uploadMediaFile(file(), false, {
        generateUrl: async () => "url",
        request: async () => Response.json({ storageId: "file-id" }),
        resolveUrl: async () => null,
      }),
    /could not be loaded/,
  )
})
test("successful uploads return a draft asset without publishing", async () => {
  const result = await uploadMediaFile(file(), false, {
    generateUrl: async () => "url",
    request: async () => Response.json({ storageId: "file-id" }),
    resolveUrl: async (id) => `https://example.com/${id}`,
  })
  assert.deepEqual(result, {
    storageId: "file-id",
    url: "https://example.com/file-id",
    kind: "image",
  })
})

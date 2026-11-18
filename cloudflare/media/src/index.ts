// Serves Convex storage files from R2 at media.ntedvs.com.
// A request for /api/storage/<id> is answered from R2. On a miss, the file is
// copied once from the Convex deployment, so Convex only pays egress per file.

interface Env {
  MEDIA: R2Bucket
  CONVEX_ORIGIN: string
}

const storagePath = /^\/api\/storage\/[0-9a-f-]{36}$/

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method !== "GET" && request.method !== "HEAD")
      return new Response("Method not allowed", { status: 405 })
    const url = new URL(request.url)
    if (!storagePath.test(url.pathname)) return new Response("Not found", { status: 404 })
    const key = url.pathname.slice("/api/storage/".length)

    if (!(await env.MEDIA.head(key))) {
      const origin = await fetch(env.CONVEX_ORIGIN + url.pathname)
      if (!origin.ok || !origin.body) return new Response("Not found", { status: 404 })
      await env.MEDIA.put(key, origin.body, {
        httpMetadata: { contentType: origin.headers.get("content-type") ?? undefined },
      })
    }

    const object = await env.MEDIA.get(key, {
      range: request.headers,
      onlyIf: request.headers,
    })
    if (!object) return new Response("Not found", { status: 404 })

    const headers = new Headers()
    object.writeHttpMetadata(headers)
    headers.set("etag", object.httpEtag)
    headers.set("accept-ranges", "bytes")
    headers.set("cache-control", "public, max-age=31536000, immutable")
    headers.set("access-control-allow-origin", "*")

    if (!("body" in object)) return new Response(null, { status: 304, headers })
    const range = object.range as { offset?: number; length?: number } | undefined
    if (range && request.headers.has("range")) {
      const start = range.offset ?? 0
      const end = start + (range.length ?? object.size - start) - 1
      headers.set("content-range", `bytes ${start}-${end}/${object.size}`)
      headers.set("content-length", String(end - start + 1))
      return new Response(request.method === "HEAD" ? null : object.body, { status: 206, headers })
    }
    headers.set("content-length", String(object.size))
    return new Response(request.method === "HEAD" ? null : object.body, { headers })
  },
}

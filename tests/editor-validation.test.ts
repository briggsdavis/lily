import assert from "node:assert/strict"
import { test } from "node:test"
import { menuSavePayload } from "../src/lib/menu-save"
import { mediaFileKind, imageLimitMb, videoLimitMb } from "../src/lib/page-media"
import { normalizeHex, validPageLink } from "../src/lib/visual-page"

test("hex colors normalize without accepting malformed CSS", () => {
  assert.equal(normalizeHex(" #AbC "), "#aabbcc")
  assert.equal(normalizeHex("#ABCDEF"), "#abcdef")
  for (const value of ["red", "#12345", "#12345678", "url(x)", "#ggg"])
    assert.equal(normalizeHex(value), null)
})
test("button links allow supported targets and reject unsafe or incomplete URLs", () => {
  for (const value of [
    "/",
    "/contact?reason=events",
    "#home-events",
    "https://example.com/path",
    "mailto:a@example.com",
    "tel:+15551234567",
  ])
    assert.equal(validPageLink(value), true, value)
  for (const value of [
    "javascript:alert(1)",
    "data:text/html,x",
    "//evil.com",
    "/\\evil.com",
    "mailto:",
    "tel:",
    "https://",
    "",
    " /contact",
    "/x\n",
    "https://example.com/" + "x".repeat(2048),
  ])
    assert.equal(validPageLink(value), false, value)
})
test("media limits match at their boundaries and reject unsupported or empty files", () => {
  assert.equal(mediaFileKind("image/png", imageLimitMb * 1024 * 1024, false), "image")
  assert.equal(mediaFileKind("image/png", imageLimitMb * 1024 * 1024 + 1, false), null)
  assert.equal(mediaFileKind("video/mp4", videoLimitMb * 1024 * 1024, true), "video")
  assert.equal(mediaFileKind("video/webm", videoLimitMb * 1024 * 1024 + 1, true), null)
  assert.equal(mediaFileKind("video/mp4", 100, false), null)
  assert.equal(mediaFileKind("video/quicktime", 100, true), null)
  assert.equal(mediaFileKind("text/html", 100, true), null)
  assert.equal(mediaFileKind("image/jpeg", 0, false), null)
})
test("menu saves exclude database metadata", () => {
  const doc = {
    _id: "menu",
    _creationTime: 1,
    updatedAt: 2,
    archived: false,
    description: "",
    heroImage: "/new.webp",
    heroImageAlt: "old",
    order: 0,
    sections: [],
    slug: "starters",
    title: "Starters",
  }
  const payload = menuSavePayload(doc)
  assert.equal(payload.heroImage, "/new.webp")
  assert.equal(payload.heroImageAlt, "Starters")
  for (const key of ["_id", "_creationTime", "updatedAt"]) assert.equal(key in payload, false)
})

import assert from "node:assert/strict"
import { test } from "node:test"
import { convexTest } from "convex-test"
import { api } from "../convex/_generated/api"
import schema from "../convex/schema"
const modules = {
  "../convex/marketing.ts": () => import("../convex/marketing"),
  "../convex/_generated/server.js": () => import("../convex/_generated/server.js"),
}
async function setup() {
  process.env.ADMIN_ALLOWED_EMAILS = "admin@example.com"
  const t = convexTest(schema, modules)
  const userId = await t.run((ctx) => ctx.db.insert("users", { email: "admin@example.com" }))
  return { t, admin: t.withIdentity({ subject: `${userId}|session` }) }
}
const bar = {
  text: "An announcement",
  link: "/events",
  textColor: "#fff",
  backgroundColor: "#5a2631",
  active: true,
}
const popup = {
  title: "Welcome",
  body: "Our latest news",
  layout: "none" as const,
  imageAlt: "",
  buttonText: "",
  buttonLink: "",
  captureEmail: true,
  active: true,
}
test("marketing administration and acquired emails require admin access", async () => {
  const { t } = await setup()
  await assert.rejects(() => t.query(api.marketing.list, {}), /ADMIN_ACCESS_DENIED/)
  await assert.rejects(() => t.mutation(api.marketing.saveAnnouncement, bar), /ADMIN_ACCESS_DENIED/)
  await assert.rejects(
    () => t.query(api.marketing.emails, { paginationOpts: { cursor: null, numItems: 10 } }),
    /ADMIN_ACCESS_DENIED/,
  )
})
test("activating announcements switches off the previous one and allows none active", async () => {
  const { t, admin } = await setup()
  const a = await admin.mutation(api.marketing.saveAnnouncement, bar)
  const b = await admin.mutation(api.marketing.saveAnnouncement, { ...bar, text: "Second" })
  let rows = await admin.query(api.marketing.list, {})
  assert.equal(rows.announcements.find((row) => row._id === a)?.active, false)
  assert.equal((await t.query(api.marketing.published, {})).announcement?._id, b)
  await admin.mutation(api.marketing.setActive, { kind: "announcements", id: a, active: true })
  rows = await admin.query(api.marketing.list, {})
  assert.equal(rows.announcements.filter((row) => row.active).length, 1)
  await admin.mutation(api.marketing.setActive, { kind: "announcements", id: a, active: false })
  assert.equal((await t.query(api.marketing.published, {})).announcement, null)
})
test("pop-ups switch independently, emails deduplicate, and deleting preserves attribution", async () => {
  const { t, admin } = await setup()
  const a = await admin.mutation(api.marketing.savePopup, popup)
  await t.mutation(api.marketing.capture, { popupId: a, email: " Person@Example.com " })
  await t.mutation(api.marketing.capture, { popupId: a, email: "person@example.com" })
  const b = await admin.mutation(api.marketing.savePopup, { ...popup, title: "Another" })
  assert.equal((await t.query(api.marketing.published, {})).popup?._id, b)
  await assert.rejects(
    () => t.mutation(api.marketing.capture, { popupId: a, email: "other@example.com" }),
    /no longer available/,
  )
  await admin.mutation(api.marketing.remove, { id: a })
  const emails = await admin.query(api.marketing.emails, {
    paginationOpts: { numItems: 50, cursor: null },
  })
  assert.equal(emails.page.length, 1)
  assert.equal(emails.page[0].email, "person@example.com")
  assert.equal(emails.page[0].popupTitle, "Welcome")
})
test("server rejects unsafe links, invalid colors, missing content and missing images", async () => {
  const { t, admin } = await setup()
  await assert.rejects(() =>
    admin.mutation(api.marketing.saveAnnouncement, { ...bar, link: "javascript:alert(1)" }),
  )
  await assert.rejects(() =>
    admin.mutation(api.marketing.saveAnnouncement, { ...bar, backgroundColor: "red" }),
  )
  await assert.rejects(() => admin.mutation(api.marketing.savePopup, { ...popup, title: " " }))
  await assert.rejects(() => admin.mutation(api.marketing.savePopup, { ...popup, layout: "left" }))
  await assert.rejects(() =>
    admin.mutation(api.marketing.savePopup, { ...popup, buttonText: "Go" }),
  )
  const id = await admin.mutation(api.marketing.savePopup, popup)
  await assert.rejects(() => t.mutation(api.marketing.capture, { popupId: id, email: "bad" }))
})

test("editing an active pop-up preserves its identity and supports all image layouts", async () => {
  const { t, admin } = await setup()
  const imageId = await t.run((ctx) =>
    ctx.storage.store(new Blob(["image bytes"], { type: "image/webp" })),
  )
  const id = await admin.mutation(api.marketing.savePopup, {
    ...popup,
    layout: "top",
    imageId,
    imageAlt: "A table",
    buttonText: "  View menu  ",
    buttonLink: "/menu",
  })
  for (const layout of ["left", "right", "top"] as const) {
    await admin.mutation(api.marketing.savePopup, {
      ...popup,
      id,
      layout,
      imageId,
      imageAlt: "A table",
    })
    const published = (await t.query(api.marketing.published, {})).popup
    assert.equal(published?._id, id)
    assert.equal(published?.layout, layout)
    assert.ok(published?.imageUrl)
  }
  await admin.mutation(api.marketing.savePopup, { ...popup, id, layout: "none", imageId })
  assert.equal((await t.query(api.marketing.published, {})).popup?.imageId, undefined)
})

test("activation rejects a mismatched collection and disabled email capture rejects submissions", async () => {
  const { t, admin } = await setup()
  const id = await admin.mutation(api.marketing.savePopup, { ...popup, captureEmail: false })
  await assert.rejects(
    () => admin.mutation(api.marketing.setActive, { kind: "announcements", id, active: true }),
    /no longer exists/,
  )
  await assert.rejects(
    () => t.mutation(api.marketing.capture, { popupId: id, email: "person@example.com" }),
    /no longer available/,
  )
  await admin.mutation(api.marketing.setActive, { kind: "popups", id, active: false })
  assert.equal((await t.query(api.marketing.published, {})).popup, null)
})

test("email pagination retains every record for CSV exports", async () => {
  const { admin, t } = await setup()
  const id = await admin.mutation(api.marketing.savePopup, popup)
  await t.run(async (ctx) => {
    for (let i = 0; i < 55; i++)
      await ctx.db.insert("marketingEmails", {
        popupId: id,
        popupTitle: popup.title,
        email: `person${i}@example.com`,
      })
  })
  const first = await admin.query(api.marketing.emails, {
    paginationOpts: { numItems: 50, cursor: null },
  })
  const second = await admin.query(api.marketing.emails, {
    paginationOpts: { numItems: 50, cursor: first.continueCursor },
  })
  assert.equal(first.isDone, false)
  assert.equal(second.isDone, true)
  assert.equal(new Set([...first.page, ...second.page].map((row) => row._id)).size, 55)
})

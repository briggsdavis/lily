import assert from "node:assert/strict"
import { test } from "node:test"
import { marketingEmailCsvRow } from "../src/lib/marketing-csv"
test("marketing CSV preserves quoted text and paragraph breaks", () => {
  assert.equal(
    marketingEmailCsvRow({
      email: "person@example.com",
      popupTitle: 'Dinner, "drinks"\nand more',
      _creationTime: 0,
    }),
    '"person@example.com","Dinner, ""drinks""\nand more","1970-01-01T00:00:00.000Z"',
  )
})
test("marketing CSV prevents submitted content from becoming spreadsheet formulas", () => {
  assert.match(
    marketingEmailCsvRow({ email: "+person@example.com", popupTitle: "  =1+1", _creationTime: 0 }),
    /^"'\+person@example.com","'  =1\+1"/,
  )
})

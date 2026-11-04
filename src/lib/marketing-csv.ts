// Quote every field and neutralize spreadsheet formulas in exported user content.
function csvCell(value: string) {
  const safe = /^[=+@-]/.test(value.trimStart()) || /^[\t\r]/.test(value) ? `'${value}` : value
  return `"${safe.replace(/"/g, '""')}"`
}
export function marketingEmailCsvRow(row: {
  email: string
  popupTitle: string
  _creationTime: number
}) {
  return [row.email, row.popupTitle, new Date(row._creationTime).toISOString()]
    .map(csvCell)
    .join(",")
}

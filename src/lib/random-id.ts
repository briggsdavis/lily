// crypto.randomUUID only exists in secure contexts (HTTPS or localhost), so it is missing
// when testing over a LAN IP. getRandomValues works everywhere.
export function randomId() {
  if (typeof crypto.randomUUID === "function") return crypto.randomUUID()
  return Array.from(crypto.getRandomValues(new Uint8Array(16)), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("")
}

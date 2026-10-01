import { env } from "./_generated/server"

export const ADMIN_ACCESS_DENIED = "ADMIN_ACCESS_DENIED"

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase()
}

export function isAllowedAdminEmail(email: string) {
  const allowedEmails = (env.ADMIN_ALLOWED_EMAILS ?? "")
    .split(/[;,\n]/)
    .map(normalizeEmail)
    .filter(Boolean)

  return allowedEmails.includes(normalizeEmail(email))
}

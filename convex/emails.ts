import { Resend } from "@convex-dev/resend"
import { components } from "./_generated/api"
import { env, type MutationCtx } from "./_generated/server"

function formatLines(fields: [string, string | number | undefined][]) {
  return fields
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([label, value]) => `${label}: ${value}`)
    .join("\n")
}

export async function notifyInbox(
  ctx: MutationCtx,
  args: {
    fields: [string, string | number | undefined][]
    idempotencyKey: string
    replyTo: string
    subject: string
  },
) {
  const { EMAIL_FROM: from, INQUIRY_EMAIL: to, RESEND_API_KEY: apiKey } = env
  if (!apiKey || !from || !to) {
    console.warn("Skipping inquiry email: missing RESEND_API_KEY, EMAIL_FROM, or INQUIRY_EMAIL")
    return
  }

  const resend = new Resend(components.resend, { apiKey, testMode: false })
  await resend.sendEmail(ctx, {
    from,
    idempotencyKey: args.idempotencyKey,
    replyTo: [args.replyTo],
    subject: args.subject,
    text: formatLines(args.fields),
    to,
  })
}

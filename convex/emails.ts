import { Resend } from "@convex-dev/resend"
import { components } from "./_generated/api"
import { env, type MutationCtx } from "./_generated/server"

const INQUIRY_RECIPIENTS = ["lily@neverskiphg.com", "events@neverskiphg.com"]

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
  const { EMAIL_FROM: from, RESEND_API_KEY: apiKey } = env
  if (!apiKey || !from) {
    console.warn("Skipping inquiry email: missing RESEND_API_KEY or EMAIL_FROM")
    return
  }

  const resend = new Resend(components.resend, { apiKey, testMode: false })
  await resend.sendEmail(ctx, {
    from,
    idempotencyKey: args.idempotencyKey,
    replyTo: [args.replyTo],
    subject: args.subject,
    text: formatLines(args.fields),
    to: INQUIRY_RECIPIENTS,
  })
}

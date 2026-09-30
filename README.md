# Lily

Next.js website with a Convex backend, Convex Auth, and Vercel deployment support.

## Setup

1. Install dependencies with `pnpm install`.
2. Run `pnpm convex dev` to create or connect the Convex project.
3. Run `pnpm dlx @convex-dev/auth` to configure Convex Auth keys.
4. Run `pnpm dev` for Next.js and `pnpm dev:backend` for Convex.

Static images belong in `public/images`, organized into `brand`, `icons`, `illustrations`, and `photos`.

For Vercel, add `CONVEX_DEPLOY_KEY` and `NEXT_PUBLIC_CONVEX_URL` to the project environment variables.

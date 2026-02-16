# CEEA Bocconi Website

Next.js (App Router) + Bun + Convex backend + Clerk auth (admin-only).

## Local Dev

1. Install deps

```bash
bun install
```

2. Start Convex (creates/uses your dev deployment)

```bash
bun run convex:dev
```

3. Start Next.js

```bash
bun run dev
```

## Clerk Setup (Admin Auth)

Create a Clerk application and set:

- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`

Admin access requires a valid Clerk session.

## Convex + Clerk (JWT) Setup

This repo includes `convex/auth.config.ts` configured for Clerk JWT auth.

You need to set in Convex environment variables:

- `CLERK_JWT_ISSUER_DOMAIN` (the `iss` domain for your Clerk JWT template)

Convex URL(s) are written automatically into `.env.local` when you run Convex.

## Deployment (Vercel)

1. Import the repo in Vercel.
2. Deploy Convex (creates a production deployment):

```bash
bun run convex:deploy
```

3. In Vercel, set `NEXT_PUBLIC_CONVEX_URL` (copy it from your local `.env.local` after deploying Convex, or from the Convex dashboard for the deployment you want to use).
4. Add the same env vars as above (Clerk keys). If using Clerk JWT auth with Convex, also set the Convex-side env vars in the Convex dashboard.
5. Redeploy the Vercel project after adding/updating env vars (Vercel only inlines `NEXT_PUBLIC_*` at build time).

This project sets `"packageManager": "bun@1.3.4"` in `package.json` so Vercel can use Bun.

## Routes

- Public site: `/`
- Events: `/events`
- Newsletter: `/newsletter` and `/newsletter/[slug]`
- Admin dashboard: `/admin` (Clerk auth)
- Sign in: `/sign-in`

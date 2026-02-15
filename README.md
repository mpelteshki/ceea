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

Admin access is controlled by:

- `ADMIN_EMAILS` (comma-separated emails, e.g. `a@b.com,b@c.com`)

This is checked in:

- Next.js: `src/lib/admin.ts`
- Convex: `convex/lib/admin.ts`

## Convex + Clerk (JWT) Setup

This repo includes `convex/auth.config.ts` configured for Clerk JWT auth.

You need to set in Convex environment variables:

- `CLERK_JWT_ISSUER_DOMAIN` (the `iss` domain for your Clerk JWT template)
- `ADMIN_EMAILS`

And in Next.js environment variables:

- `ADMIN_EMAILS`

Convex URL(s) are written automatically into `.env.local` when you run Convex.

## Deployment (Vercel)

1. Import the repo in Vercel.
2. Add the same env vars as above (Clerk keys, `ADMIN_EMAILS`).
3. Add Convex env vars in the Convex dashboard.

This project sets `"packageManager": "bun@1.3.4"` in `package.json` so Vercel can use Bun.

## Routes

- Public site: `/`
- Events: `/events`
- Newsletter: `/newsletter` and `/newsletter/[slug]`
- Admin dashboard: `/admin` (Clerk auth + `ADMIN_EMAILS` allowlist)
- Sign in: `/sign-in`

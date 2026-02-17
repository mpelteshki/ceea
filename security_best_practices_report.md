# Security Best Practices Report

Date: February 17, 2026
Scope: Next.js 16 + React 19 frontend, Convex backend functions, Clerk auth integration

## Executive Summary
Under the updated threat model (only pre-authorized users can authenticate), the highest remaining risk is a publicly exposed migration mutation that lacks authorization checks. A second major issue is that backend "admin" checks validate authentication but not explicit role/allowlist authorization, which is now a defense-in-depth and future-drift risk rather than an immediate open-access break. There is also a high-severity data confidentiality issue where unpublished newsletter drafts are exposed through public Convex queries.

Dependency scan result (`bun audit`): no known package CVEs were reported at scan time.

## Critical Findings

### S-002: Public migration mutation allows broad data rewrites without auth
- Severity: Critical
- Impact: Unauthenticated or unauthorized callers can execute bulk data rewrites across multiple tables.
- Evidence:
  - `convex/migrations.ts:19` exports `flattenLegacyLocalization` as `mutation` with no `requireAdmin` or equivalent authorization.
  - `convex/_generated/api.d.ts:15` includes `migrations` in generated API modules (public surface context).
  - `convex/_generated/api.d.ts:47` exposes `api` as public function references.
- Why this is exploitable:
  - Public Convex mutations are callable by clients unless authorization is explicitly enforced in handler code.
- Recommended fix:
  - Convert this to `internalMutation` (preferred for one-off migrations) or add strict admin auth.
  - Remove/disable migration endpoints after use.

## High Findings

### S-001: Admin authorization is not explicitly enforced server-side (authentication-only checks)
- Severity: High
- Impact: If authentication policy is ever broadened, misconfigured, or bypassed in identity-provider settings, non-admin authenticated users would immediately gain full admin write access.
- Evidence:
  - `convex/lib/admin.ts:3` defines `requireAdmin`, but it only checks `getUserIdentity()` and does not validate admin role/allowlist.
  - `src/lib/admin.ts:14` defines `getAdminState`, but it only checks that `currentUser()` exists (signed-in), then returns `{ ok: true }`.
  - `src/proxy.ts:25` protects non-public routes with `auth.protect()` (signed-in), not admin authorization.
  - `src/app/admin/layout.tsx:19` gates admin UI with `getAdminState()` only.
- Why this is exploitable:
  - Server-side mutation guards in files like `convex/events.ts`, `convex/posts.ts`, `convex/projects.ts`, etc. rely on `requireAdmin`, which currently accepts any authenticated identity.
- Recommended fix:
  - Enforce a true admin check in both frontend route gating and Convex backend authorization.
  - Use a server-side allowlist (e.g., Clerk user IDs or verified emails in env/DB) and reject non-admin identities.
  - Keep UI checks, but treat Convex mutation checks as the real security boundary.

### S-003: Unpublished newsletter drafts are exposed via public query endpoints
- Severity: High
- Impact: Confidential draft content can be enumerated and read before publication.
- Evidence:
  - `convex/posts.ts:29` `listAll` returns all posts without auth filtering.
  - `convex/posts.ts:36` `getBySlug` returns a post by slug without requiring publication status.
  - `src/components/admin/admin-dashboard.tsx:68` uses `api.posts.listAll` for admin UX, indicating draft workflow depends on this endpoint.
  - `src/app/(site)/newsletter/[slug]/page.tsx:16` and `src/app/sitemap.ts:46` also consume `listAll` server-side, then filter in app logic.
- Why this is exploitable:
  - Filtering drafts in page code does not secure the backend function itself; direct API calls can still retrieve draft records.
- Recommended fix:
  - Split endpoints into:
    - public: published-only (`listPublished`, `getPublishedBySlug`)
    - admin: `listAll` / draft access with admin authorization.
  - Update sitemap/static params to use published-only query.

## Medium Findings

### S-004: CSP is incomplete and does not restrict script/style sources
- Severity: Medium
- Impact: Reduced defense-in-depth against XSS and third-party script abuse.
- Evidence:
  - `next.config.ts:42` sets CSP to only `base-uri`, `frame-ancestors`, `form-action`, `object-src`.
  - No `default-src`, `script-src`, `style-src`, `img-src`, or `connect-src` directives are defined.
- Recommended fix:
  - Define a stricter CSP policy appropriate for Next.js/Clerk/Convex runtime requirements.
  - Start with report-only if needed, then enforce.

## Notes and Verification Gaps
- This report is code-level/static analysis. Runtime infra controls (WAF, edge auth rules, Clerk dashboard restrictions like invite-only mode) were not directly validated from this repository.
- Given your stated deployment posture (authentication only for authorized users), S-001 is primarily a hardening/defense-in-depth finding unless auth policy changes.

## Priority Remediation Plan
1. Fix S-002 immediately by making migration function internal-only or removing it.
2. Fix S-003 by separating published vs admin post queries with server-side authorization.
3. Harden S-001 by implementing explicit admin authorization in Convex and Next admin gating.
4. Tighten CSP per S-004 as defense-in-depth.

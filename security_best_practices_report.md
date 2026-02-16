# Security and Design Audit Report

## Executive Summary
This audit found critical server-side authorization gaps in Convex mutations that allow unauthenticated or non-admin clients to create, update, and delete core content in multiple tables. This is the highest-risk issue because it can enable data tampering and content abuse without passing admin UI checks. The review also found design/accessibility violations in admin and public UI components (icon-only controls without labels, form metadata omissions, and image usage issues), plus missing baseline security response headers/CSP hardening.

## Scope
- Next.js frontend (`src/**`)
- Convex backend (`convex/**`)
- Middleware and app config (`src/middleware.ts`, `next.config.ts`)
- UI checked against Vercel Web Interface Guidelines (fetched from upstream)

## Critical Findings

### S-001: Missing server-side admin authorization on `projects` mutations
- Severity: Critical
- Impact: Any client that can call Convex mutations can modify/delete projects without server-side admin checks.
- Evidence:
  - `convex/projects.ts:24`
  - `convex/projects.ts:50`
  - `convex/projects.ts:58`
- Why this matters: Frontend admin gating is not a security boundary; authorization must be enforced in each mutation.

### S-002: Missing server-side admin authorization on `team` mutations
- Severity: Critical
- Impact: Team roster can be modified/deleted without admin enforcement in backend code.
- Evidence:
  - `convex/team.ts:33`
  - `convex/team.ts:56`
  - `convex/team.ts:64`

### S-003: Missing server-side admin authorization on `gallery` mutations
- Severity: Critical
- Impact: Gallery content can be modified/deleted without admin enforcement in backend code.
- Evidence:
  - `convex/gallery.ts:20`
  - `convex/gallery.ts:40`
  - `convex/gallery.ts:48`

## High Findings

### S-004: URL fields are not validated before storage and rendering
- Severity: High
- Impact: Malicious URLs (including unsafe schemes) can become clickable links or media sources, enabling phishing or script-scheme abuse in some sinks.
- Evidence (input acceptance):
  - `convex/events.ts:43`
  - `convex/team.ts:30`
  - `convex/projects.ts:21`
  - `convex/gallery.ts:13`
  - `convex/partners.ts:24`
- Evidence (render sinks):
  - `src/components/site/events-list.tsx:106`
  - `src/app/[locale]/(site)/team/page.tsx:106`
  - `src/app/[locale]/(site)/projects/page.tsx:76`
  - `src/app/[locale]/admin/partners/page.tsx:149`

## Medium Findings

### S-005: Missing baseline security headers/CSP hardening in app config
- Severity: Medium
- Impact: Reduced browser-side protection against XSS/clickjacking/content injection classes.
- Evidence:
  - `next.config.ts:6`
- Notes: No `headers()` policy found for CSP, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, etc.

### S-006: Route coverage mismatch for public contact path
- Severity: Medium
- Impact: Public route behavior is inconsistent; `/contacts` is linked in nav but middleware public matcher includes `/contact`.
- Evidence:
  - `src/middleware.ts:29`
  - `src/components/site/site-nav.tsx:61`

## Design Guideline Findings (Web Interface Guidelines)

### D-001: Icon-only interactive controls missing accessible names
- Severity: High
- Evidence:
  - `src/components/site/events-list.tsx:108` (icon-only link button lacks `aria-label`)
  - `src/app/[locale]/admin/gallery/page.tsx:135` (icon-only delete button lacks `aria-label`)

### D-002: Admin form controls missing `name`/`autocomplete` consistency
- Severity: Medium
- Evidence:
  - `src/app/[locale]/admin/projects/page.tsx:62`
  - `src/app/[locale]/admin/team/page.tsx:73`
  - `src/app/[locale]/admin/partners/page.tsx:65`
- Notes: Several controls have visual labels but omit stable `name` and autocomplete behavior.

### D-003: Raw `<img>` without intrinsic sizing/optimization in app UI
- Severity: Medium
- Evidence:
  - `src/app/[locale]/admin/gallery/page.tsx:127`
- Notes: This can increase layout shift/bandwidth and misses Next image optimizations.

### D-004: `transition-all` used in multiple components
- Severity: Low
- Evidence:
  - `src/app/[locale]/admin/projects/page.tsx:144`
  - `src/app/[locale]/admin/team/page.tsx:159`
  - `src/app/[locale]/admin/partners/page.tsx:162`
  - `src/components/admin/admin-dashboard.tsx:152`
- Notes: Guideline recommends explicit transition properties instead of `all`.

## Validation Performed
- Ran Convex codegen/deploy sync successfully after migration.
- Ran migration to remove Bulgarian fields (`migrations:removeBulgarianFields`).
- Ran dependency audit (`bun audit`): no known vulnerabilities reported.
- Attempted full build/lint; existing non-audit code errors remain in workspace and block clean CI status.

## Immediate Remediation Order
1. Add `requireAdmin(ctx)` to all `projects`, `team`, and `gallery` mutations before any DB write/delete.
2. Enforce URL allowlisting/normalization in Convex mutations (only `https://` and allowed hosts where applicable).
3. Add security headers/CSP (edge or Next config) and verify no breakage.
4. Fix accessibility regressions for icon-only controls and admin form metadata.


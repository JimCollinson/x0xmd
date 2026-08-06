# ADR-0005: Expose Only Canonical Explicitly Public Routes

- **Status:** Proposed
- **Date:** 2026-03-31
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [PR #1 implementation](https://github.com/JimCollinson/x0xmd/commit/a2f310802f3c64d39709968dd9fc2908f1748aaf); [PR #2](https://github.com/JimCollinson/x0xmd/pull/2); [ADR-0008](ADR-0008-serve-tracked-static-files-through-workers-assets.md)

## Context

This is a retrospective record prepared on 2026-08-06 for the public-route discipline established by PR #1 on 2026-03-31 and protected during PR #2 review. The Worker fronts a much larger upstream repository containing public user documentation, development material, internal process documents, release artefacts, and paths that can change independently. It also serves a bounded set of repository-owned static files through Cloudflare Workers Assets.

An arbitrary path proxy would make upstream repository layout an accidental x0x.md API, expose development-internal material, and permit unknown inputs to select upstream fetches. At the same time, the negotiated root, exact machine and resource routes, mixed-case requests, intentional aliases, curated upstream documents, and static asset namespaces need explicit but appropriately different forms of governance. Requiring every file in a bounded static namespace to appear in an individual route map would not improve the upstream-proxy boundary and would confuse route exposure with the separate static-packaging decision in ADR-0008.

## Decision Drivers

- Make every public x0x.md exposure an explicit, reviewable choice at either individual-route or bounded-namespace level.
- Prevent arbitrary upstream file access and accidental publication of development-internal documentation.
- Provide one canonical URL for each exposed resource.
- Keep unknown paths predictable and non-proxying.
- Let repository-owned static assets retain ordinary file-serving and caching semantics without turning the deployable tree into an unbounded public surface.

## Considered Options

1. Proxy any request path to the corresponding path in the upstream repository.
2. Maintain an allowlist but serve every accepted spelling directly without canonical redirects.
3. Govern the negotiated root, exact routes, curated upstream documents, and bounded repository-owned static namespaces explicitly; apply canonicalization where each class defines it and reject everything else.

## Decision

We will expose content only through one of four explicitly governed exposure classes:

1. The special `/` route, which deliberately negotiates browser HTML and command-line installer representations.
2. Exact machine or resource routes and intentional aliases defined through explicit canonical route definitions.
3. Upstream documents selected through the curated public-document allowlist.
4. The bounded repository-owned static namespaces `/fonts/*` and `/assets/*`, delegated to the Cloudflare Workers Assets binding as described by ADR-0008.

Exposure must be explicit at either the individual-route level or the bounded-namespace level. Accepted case variants and intentional aliases for exact resources and allowlisted documents resolve according to their explicit canonical definitions; non-canonical accepted paths redirect permanently with HTTP 308 so method semantics are preserved. Static asset paths may remain case-sensitive unless an explicit alias or canonical rule is added. Public upstream documents must be added deliberately. Development-internal and repository-process documents remain excluded unless a later review explicitly classifies them as public.

Unknown routes outside these four classes return 404 and must not trigger an arbitrary upstream fetch. Unknown files inside `/fonts/*` or `/assets/*` follow the bounded Assets binding's not-found semantics and never become arbitrary repository, filesystem, or upstream fetches.

This ADR governs the exposure model, not a frozen inventory. Individual public routes, allowlisted documents, or bounded namespaces may be added or removed through review while preserving explicit selection, canonicalization where defined, internal-document exclusion, and unknown-path failure. The exact static file inventory is governed by reviewed deployable source and ADR-0008, not enumerated here.

## Consequences

### Positive

- x0x.md has a bounded, auditable public surface rather than mirroring upstream layout accidentally.
- Canonical redirects reduce duplicate URLs while preserving request methods.
- Unknown and internal paths fail locally instead of becoming upstream file selectors.
- Static files can use a narrowly delegated asset-serving path without individual route entries.

### Negative / Trade-offs

- New upstream documents are unavailable until x0xmd explicitly exposes them.
- The allowlist can become stale when upstream paths change.
- Maintainers must review route or namespace additions for audience, authority, cache, CORS, and failure behaviour.

### Neutral / Operational

- PR #2's narrowly reviewed public conceptual-guide addition is the model: add a route explicitly while preserving the protected backend contract.
- Exact route and static-file inventory belongs in code, reviewed deployable paths, and public-surface documentation, not in this durable decision.
- Static asset packaging, deployment coupling, and binding authority are governed separately by ADR-0008.

## Validation

- Test the negotiated root, representative canonical routes, intentional aliases, and mixed-case variants; require non-canonical accepted paths to return 308 to the canonical path where an explicit canonical definition applies.
- Test representative static asset requests, case variants, missing files, and traversal-like inputs; require delegation to remain within `/fonts/*` and `/assets/*`, with missing files following Assets not-found semantics and no arbitrary upstream fetch.
- Test unknown, traversal-like, and development-internal paths outside the governed classes; require 404 without an upstream content fetch.
- During route or namespace review, verify that every addition has an explicit public audience, canonical policy, source authority, response type, cache policy, and failure behaviour.
- Revisit this ADR if the Worker is proposed to expose an upstream namespace dynamically rather than through governed maps.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

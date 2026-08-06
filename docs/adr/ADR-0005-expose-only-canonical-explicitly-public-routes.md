# ADR-0005: Expose Only Canonical Explicitly Public Routes

- **Status:** Proposed
- **Date:** 2026-03-31
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [PR #1 implementation](https://github.com/JimCollinson/x0xmd/commit/a2f310802f3c64d39709968dd9fc2908f1748aaf); [PR #2](https://github.com/JimCollinson/x0xmd/pull/2)

## Context

This is a retrospective record prepared on 2026-08-06 for the public-route discipline established by PR #1 on 2026-03-31 and protected during PR #2 review. The Worker fronts a much larger upstream repository containing public user documentation, development material, internal process documents, release artefacts, and paths that can change independently.

An arbitrary path proxy would make upstream repository layout an accidental x0x.md API, expose development-internal material, and permit unknown inputs to select upstream fetches. At the same time, mixed-case requests and a small number of intentional aliases need stable canonical destinations.

## Decision Drivers

- Make every public x0x.md route an explicit, reviewable choice.
- Prevent arbitrary upstream file access and accidental publication of development-internal documentation.
- Provide one canonical URL for each exposed resource.
- Keep unknown paths predictable and non-proxying.

## Considered Options

1. Proxy any request path to the corresponding path in the upstream repository.
2. Maintain an allowlist but serve every accepted spelling directly without canonical redirects.
3. Maintain explicit governed public-document and canonical-route maps, normalize accepted case variants to canonical URLs, and reject everything else.

## Decision

We will expose only routes present in an explicit governed allowlist or canonical route map.

Accepted case variants and intentional aliases resolve to the canonical path; non-canonical casing redirects permanently with HTTP 308 so method semantics are preserved. Public upstream documents must be added deliberately. Development-internal and repository-process documents remain excluded unless a later review explicitly classifies them as public. Unknown routes return 404 and must not trigger an arbitrary upstream fetch.

This ADR governs the exposure model, not a frozen inventory. Individual public routes may be added or removed through review while preserving explicit selection, canonicalization, internal-document exclusion, and unknown-path failure.

## Consequences

### Positive

- x0x.md has a bounded, auditable public surface rather than mirroring upstream layout accidentally.
- Canonical redirects reduce duplicate URLs while preserving request methods.
- Unknown and internal paths fail locally instead of becoming upstream file selectors.

### Negative / Trade-offs

- New upstream documents are unavailable until x0xmd explicitly exposes them.
- The allowlist can become stale when upstream paths change.
- Maintainers must review route additions for audience, authority, cache, CORS, and failure behaviour.

### Neutral / Operational

- PR #2's narrowly reviewed public conceptual-guide addition is the model: add a route explicitly while preserving the protected backend contract.
- Exact route inventory belongs in code and public-surface documentation, not in this durable decision.

## Validation

- Test representative canonical routes, intentional aliases, and mixed-case variants; require non-canonical accepted paths to return 308 to the canonical path.
- Test unknown, traversal-like, and development-internal paths; require 404 without an upstream content fetch.
- During route review, verify that every addition has an explicit public audience, canonical spelling, source authority, response type, cache policy, and failure behaviour.
- Revisit this ADR if the Worker is proposed to expose an upstream namespace dynamically rather than through governed maps.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

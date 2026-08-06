# ADR-0008: Serve Tracked Static Files through Workers Assets

- **Status:** Proposed
- **Date:** 2026-05-19
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [static-assets implementation commit](https://github.com/JimCollinson/x0xmd/commit/87252fba68ce1f9809ccf057b131fe29a040d0ed); [PR #2](https://github.com/JimCollinson/x0xmd/pull/2); [ADR-0002](ADR-0002-keep-x0xmd-as-separate-serving-repository.md); [ADR-0005](ADR-0005-expose-only-canonical-explicitly-public-routes.md)

## Context

This is a retrospective record prepared on 2026-08-06 for the static-asset architecture introduced on 2026-05-19 by commit `87252fb` in PR #2. x0xmd owns its presentation source and supporting static assets. Binary files such as fonts need direct browser requests, appropriate content types, and caching independent from the generated HTML response.

The durable question is how repository-owned binary and static assets intended for direct public serving are packaged and served. That is distinct from ADR-0005's route-exposure decision: this record governs the deployable asset source and serving mechanism, while ADR-0005 governs which bounded namespaces requests may enter.

## Decision Drivers

- Keep binary and static files reviewable as ordinary tracked repository content.
- Avoid base64 growth and opaque binary payloads in HTML or Worker source.
- Allow assets to use independent requests, content types, and cache behaviour.
- Keep the deployable asset authority local to x0xmd and coupled visibly to its Cloudflare deployment.
- Prevent the asset mechanism from exposing arbitrary repository, filesystem, or upstream content.

## Considered Options

1. Inline or base64-encode static assets in HTML or Worker source.
2. Host repository-owned static assets through a third-party asset service.
3. Return each static asset directly from Worker code responses.
4. Track deployable files under `public/` and serve them through the Cloudflare Workers Assets binding at bounded namespaces.

## Decision

We will keep repository-owned static files intended for direct public serving in reviewed deployable paths under `public/` and serve them through the `ASSETS` binding at bounded namespaces.

The Worker delegates only the explicitly governed static namespaces to that binding. This permits independent requests, caching, and content types while avoiding base64 payloads and binary bloat in HTML or Worker source. Files remain part of the reviewed deployment input rather than becoming an independent third-party authority.

This decision does not claim that every frontend dependency is self-hosted, and it does not freeze individual asset filenames. Changes to the Assets binding, deployable asset authority, or bounded namespace model require architectural and operational review.

## Consequences

### Positive

- Browsers can request and cache static assets independently from HTML and Worker responses.
- The asset service can apply file-appropriate content types and delivery behaviour.
- Binary files remain tracked, reviewable, and deployable without obscuring maintained source with base64 data.

### Negative / Trade-offs

- Asset availability is coupled to the reviewed `public/` contents, Wrangler Assets configuration, and Cloudflare deployment.
- Missing or misnamed files fail as independent asset requests and can degrade presentation.
- Review must account for which tracked files are included in deployable asset paths.

### Neutral / Operational

- Individual filenames may change without changing this decision when they remain within reviewed deployable paths and governed namespaces.
- Static delivery has cache and content-type behaviour distinct from Worker-generated responses.
- Third-party runtime dependencies, where separately chosen, are outside the claim made by this decision.

## Validation

- Request representative binary and static files independently and verify successful delivery, appropriate content types, and cache behaviour.
- Verify missing files follow Workers Assets not-found semantics and do not fall through to arbitrary filesystem, repository, or upstream fetches.
- Inspect deployment changes to confirm directly served static files are tracked under reviewed deployable paths in `public/` and only bounded namespaces are delegated to `ASSETS`.
- Confirm HTML and Worker source do not acquire avoidable inline/base64 copies of files governed by this mechanism.
- Require review when the binding, asset authority, deployable path, or namespace model changes.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

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

The durable question is how repository-owned binary and static assets intended for direct public serving are packaged and delivered after routing policy approves them. That is distinct from ADR-0005's route-exposure decision: this record governs the deployable asset source and subordinate delivery mechanism, while ADR-0005 governs which requests may enter bounded static namespaces. The packaging tree must not become a second, asset-first route authority.

## Decision Drivers

- Keep binary and static files reviewable as ordinary tracked repository content.
- Avoid base64 growth and opaque binary payloads in HTML or Worker source.
- Allow assets to use independent requests, content types, and cache behaviour.
- Keep the deployable asset authority local to x0xmd and coupled visibly to its Cloudflare deployment.
- Keep Worker classification authoritative for whether an asset request is publicly reachable.
- Prevent the asset mechanism from exposing or shadowing Worker routes with arbitrary repository, filesystem, or upstream content.

## Considered Options

1. Inline or base64-encode static assets in HTML or Worker source.
2. Host repository-owned static assets through a third-party asset service.
3. Return each static asset directly from Worker code responses.
4. Treat every matching path in the packaged `public/` tree as public and let the asset mechanism serve it before Worker routing.
5. Track deployable files under `public/` and use the Cloudflare Workers Assets binding only as subordinate delivery after the Worker approves a bounded namespace.

## Decision

We will keep repository-owned static files intended for direct public serving in reviewed deployable paths under `public/` and deliver them through the `ASSETS` binding only after Worker routing classifies their request into an approved bounded namespace.

`ASSETS` is subordinate to the Worker's public-routing decision. The Worker delegates only explicitly governed static namespaces to that binding. Files outside those namespaces remain unreachable through the asset mechanism and cannot shadow the negotiated root, exact routes, aliases or redirects, curated documents, or unknown-path responses. The `public/` tree is packaging input, not an exposure allowlist; adding a file does not itself create a public route.

This permits independent requests, caching, and content types while avoiding base64 payloads and binary bloat in HTML or Worker source. Files remain part of reviewed deployment input rather than becoming an independent route or third-party authority. An asset-first public-tree exposure model is rejected because it would let packaging changes bypass ADR-0005's explicit routing policy.

This decision does not claim that every frontend dependency is self-hosted, and it does not freeze individual asset filenames or a particular platform-control spelling. Changes to the Assets binding, deployable asset authority, Worker-first ordering, or bounded namespace model require architectural and operational review.

## Consequences

### Positive

- Browsers can request and cache static assets independently from HTML and Worker responses.
- The asset service can apply file-appropriate content types and delivery behaviour.
- Binary files remain tracked, reviewable, and deployable without obscuring maintained source with base64 data.
- Worker policy remains the single authority for whether packaged files are publicly reachable.

### Negative / Trade-offs

- Asset availability is coupled to the reviewed `public/` contents, Wrangler Assets configuration, and Cloudflare deployment.
- Missing or misnamed files fail as independent asset requests and can degrade presentation.
- Review must account for which tracked files are included in deployable asset paths and which namespaces the Worker delegates.
- Worker-first classification adds routing work and potential overhead to asset requests compared with asset-first delivery.

### Neutral / Operational

- Individual filenames may change without changing this decision when they remain within reviewed deployable paths and governed namespaces.
- Static delivery has cache and content-type behaviour distinct from Worker-generated responses.
- Third-party runtime dependencies, where separately chosen, are outside the claim made by this decision.
- Platform routing controls and integration coverage must continue to demonstrate that `ASSETS` cannot pre-empt Worker policy.

## Validation

- Request representative binary and static files independently and verify successful delivery, appropriate content types, cache behaviour, and prior Worker classification into an approved namespace.
- Verify missing files in approved namespaces follow Workers Assets not-found semantics and do not fall through to arbitrary filesystem, repository, or upstream fetches.
- Through the Cloudflare routing integration, use matchable control fixtures to prove that packaged files outside approved namespaces remain unreachable and cannot shadow root negotiation, exact routes, aliases or redirects, curated documents, or unknown-path responses. Direct `worker.fetch` coverage alone is insufficient for this ordering property.
- Inspect deployment changes to confirm directly served static files are tracked under reviewed deployable paths in `public/`, only bounded namespaces are delegated to `ASSETS`, and file presence never grants route exposure.
- Confirm HTML and Worker source do not acquire avoidable inline/base64 copies of files governed by this mechanism.
- Require review when the binding, asset authority, Worker-first ordering, deployable path, or namespace model changes.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

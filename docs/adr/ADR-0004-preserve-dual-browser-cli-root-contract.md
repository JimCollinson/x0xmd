# ADR-0004: Preserve the Dual Browser and CLI Root Contract

- **Status:** Proposed
- **Date:** 2026-02-26
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [initial Worker commit](https://github.com/JimCollinson/x0xmd/commit/91c1119d873c9131ebf341d65fa6c44e0b6418f6); [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [PR #2](https://github.com/JimCollinson/x0xmd/pull/2); [ADR-0009](ADR-0009-establish-x0xmd-as-stable-canonical-public-entrypoint.md); [contract conformance follow-up](../../planning/phases/02-contract-conformance/02-01-PLAN.md)

## Context

This is a retrospective record prepared on 2026-08-06 for the root contract established on 2026-02-26 and preserved by subsequent pull requests. `x0x.md` is both a human-facing website and a command-line installation origin. Browsers need the maintained HTML presentation, while commands such as `curl -sfL https://x0x.md | sh` depend on the root returning shell script bytes rather than HTML.

A March 2026 x0x Agent Onboarding proposal later described replacing this split with the same HTML for every client and moving all installer access to `/install.sh`. That proposal was stale and unmerged. The current decision explicitly supersedes that proposal as design guidance; because it never became an ADR, the metadata field remains `Supersedes: none`.

## Decision Drivers

- Preserve the established one-line root installation command.
- Give normal browser navigations the designed HTML experience.
- Offer a deterministic installer endpoint that does not depend on request classification.
- Prevent shared caches from collapsing the negotiated root representations.
- Avoid silently breaking automation while allowing the homepage to evolve.

## Considered Options

1. Serve HTML from `/` to every client and require installers to use `/install.sh`.
2. Serve the installer from `/` to every client and host the website elsewhere.
3. Content-negotiate `/` between browser HTML and CLI-like installer responses, with `/install.sh` as an explicit installer route.

## Decision

We will preserve the dual root contract. Browser-like navigation requests receive HTML. CLI-like root requests receive the upstream installer. `/install.sh` always provides the installer and is the deterministic explicit route for consumers that do not want request classification.

The exact canonical ergonomic command is `curl -sfL https://x0x.md | sh`. ADR-0009 governs `x0x.md` as the stable public origin; this ADR governs its negotiated representations, cache safety, and root and explicit-installer route behaviour.

The classification heuristic may evolve as clients change, but it must preserve these observable contracts and must be reviewed as a public API change. The stale unmerged same-HTML-for-every-client proposal is not the governing design.

The negotiated root must be cache-safe. Any shared caching of root responses must partition cache entries by every request input that selects the representation; otherwise those negotiated variants must not be shared-cacheable. HTML must never be reused for a CLI installer request, and installer bytes must never be reused for a browser HTML request.

## Consequences

### Positive

- Existing `curl ... | sh` usage remains compatible while browsers receive a purpose-built site.
- Agents and tooling can bypass negotiation by requesting `/install.sh` directly.
- Presentation work does not require changing the established install command.

### Negative / Trade-offs

- Heuristic request classification can misclassify unusual clients or synthetic browser requests.
- The same URL has different media types and security implications depending on request headers.
- Every representation-selecting input becomes part of the shared-cache design, or the negotiated variants must avoid shared caching.

### Neutral / Operational

- Browser/CLI behaviour at `/` and deterministic installer behaviour at `/install.sh` form one public contract and should be reviewed together.
- Homepage changes must not remove or shadow the CLI installer response.
- Cache keys, response directives, and monitoring must account for content negotiation rather than assuming one root representation.

## Validation

- Exercise `/` with a browser navigation request and confirm an HTML response.
- Exercise `/` with representative CLI clients, including `curl`, and confirm shell script bytes rather than HTML.
- Exercise `/install.sh` with browser-like and CLI-like headers and confirm the same installer response in both cases.
- Exercise the negotiated root through the shared-cache path in both request orders and confirm one representation is never reused for the other.
- Verify that the selected cache design either partitions on every representation-selecting input or makes the variants ineligible for shared caching. A correct `Vary` contract can be one part of this validation, but it is not the only permitted mechanism.
- Review redirects so they do not collapse the negotiated root representations or change the explicit route.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

# ADR-0004: Preserve the Dual Browser and CLI Root Contract

- **Status:** Proposed
- **Date:** 2026-02-26
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [initial Worker commit](https://github.com/JimCollinson/x0xmd/commit/91c1119d873c9131ebf341d65fa6c44e0b6418f6); [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [PR #2](https://github.com/JimCollinson/x0xmd/pull/2)

## Context

This is a retrospective record prepared on 2026-08-06 for the root contract established on 2026-02-26 and preserved by subsequent pull requests. `x0x.md` is both a human-facing website and a command-line installation origin. Browsers need the maintained HTML presentation, while commands such as `curl -sfL https://x0x.md | sh` depend on the root returning shell script bytes rather than HTML.

A March 2026 x0x Agent Onboarding proposal later described replacing this split with the same HTML for every client and moving all installer access to `/install.sh`. That proposal was stale and unmerged. The current decision explicitly supersedes that proposal as design guidance; because it never became an ADR, the metadata field remains `Supersedes: none`.

## Decision Drivers

- Preserve the established one-line root installation command.
- Give normal browser navigations the designed HTML experience.
- Offer a deterministic installer endpoint that does not depend on request classification.
- Avoid silently breaking automation while allowing the homepage to evolve.

## Considered Options

1. Serve HTML from `/` to every client and require installers to use `/install.sh`.
2. Serve the installer from `/` to every client and host the website elsewhere.
3. Content-negotiate `/` between browser HTML and CLI-like installer responses, with `/install.sh` as an explicit installer route.

## Decision

We will preserve the dual root contract. Browser-like navigation requests receive HTML. CLI-like root requests receive the upstream installer. `/install.sh` always provides the installer and is the deterministic explicit route for consumers that do not want request classification.

The classification heuristic may evolve as clients change, but it must preserve these observable contracts and must be reviewed as a public API change. The stale unmerged same-HTML-for-every-client proposal is not the governing design.

## Consequences

### Positive

- Existing `curl ... | sh` usage remains compatible while browsers receive a purpose-built site.
- Agents and tooling can bypass negotiation by requesting `/install.sh` directly.
- Presentation work does not require changing the established install command.

### Negative / Trade-offs

- Heuristic request classification can misclassify unusual clients or synthetic browser requests.
- The same URL has different media types and security implications depending on request headers.
- Caches and monitoring must account for content negotiation rather than assuming one root representation.

### Neutral / Operational

- Browser/CLI behaviour at `/` and deterministic installer behaviour at `/install.sh` form one public contract and should be reviewed together.
- Homepage changes must not remove or shadow the CLI installer response.

## Validation

- Exercise `/` with a browser navigation request and confirm an HTML response.
- Exercise `/` with representative CLI clients, including `curl`, and confirm shell script bytes rather than HTML.
- Exercise `/install.sh` with browser-like and CLI-like headers and confirm the same installer response in both cases.
- Review cache behaviour and redirects so they do not collapse the negotiated root representations or change the explicit route.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

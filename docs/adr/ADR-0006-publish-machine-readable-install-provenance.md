# ADR-0006: Publish Machine-Readable Install Provenance

- **Status:** Proposed
- **Date:** 2026-02-26
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [initial Worker commit](https://github.com/JimCollinson/x0xmd/commit/91c1119d873c9131ebf341d65fa6c44e0b6418f6); [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); current `src/index.js` `trustResponse`

## Context

This is a retrospective record prepared on 2026-08-06 for the machine-readable trust endpoint introduced with the original Worker. Agents and automation need to distinguish x0x.md entrypoints from raw upstream sources, understand what an install command will fetch, and associate release-backed artefacts with the release and cache resolution used by the Worker.

Human prose and response headers expose pieces of that provenance, but they do not provide one inspectable document for automated trust decisions. The current `/trust.json` implementation is useful evidence but is not yet a clean durable contract: it still emits stale experimental policy fields, including `non_interactive_mode: "warn_and_continue_if_gpg_missing"` and `strict_verification: "planned"`. Those values are not currently evidenced policy and must not be legitimised retrospectively by this ADR.

## Decision Drivers

- Let agents inspect canonical install and trust entrypoints before executing commands.
- Distinguish Worker URLs from the raw upstream sources behind them.
- Expose release and cache identity needed to interpret release-backed artefacts.
- Publish only policy claims that current implementation and upstream evidence support.

## Considered Options

1. Provide no machine-readable trust or provenance document and rely on prose and headers.
2. Publish static metadata that lists URLs but omits live release/cache identity and upstream resolution.
3. Publish `/trust.json` as the machine-readable install provenance contract, with evidenced fields and defined schema/failure semantics.

## Decision

We will publish machine-readable install provenance at `/trust.json`.

The contract exposes canonical entrypoints, current install commands, Worker-facing artefact URLs, the raw upstream sources those URLs resolve from, and release/cache identity. Policy fields may describe only evidenced current behaviour; planned, experimental, or historical policy must not be presented as active truth.

The endpoint is provenance for a trust decision, not a signature or independent authority. Upstream x0x release artefacts and sources remain authoritative for their own bytes and signatures.

## Consequences

### Positive

- Agents can inspect the install path, upstream origin, and release/cache context in one request.
- Worker URLs and raw upstream URLs are explicitly distinguishable.
- Incorrect policy claims become reviewable contract defects rather than being buried in prose.

### Negative / Trade-offs

- The endpoint can mislead automated consumers if fields become stale or underspecified.
- Live release and cache resolution introduces partial-data and outage cases that need defined semantics.
- Schema evolution can break consumers unless versioning and compatibility expectations are explicit.

### Neutral / Operational

- `/trust.json` reports provenance; it does not itself verify signatures or make installation safe.
- Changes to its fields, meaning, status, caching, or failure responses are public API changes requiring review.

## Validation

- **Not ready for acceptance:** remove or re-evidence the stale experimental GPG/strict-verification policy fields in current code. This ADR does not authorise them; the current implementation remains non-conforming until that remediation or evidence exists.
- Define the schema and evolution contract, including versioning, required versus optional fields, and the meaning of unavailable or unknown release/cache data.
- Define failure and partial-resolution semantics for release API failure, missing release assets, fallback URLs, stale cache state, and unavailable upstream sources.
- Verify every published entrypoint, command, Worker URL, raw upstream URL, release identity, cache identity, and policy claim against observable current behaviour before human acceptance.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

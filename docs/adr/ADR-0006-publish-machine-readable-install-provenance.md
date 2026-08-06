# ADR-0006: Publish Machine-Readable Install Provenance

- **Status:** Proposed
- **Date:** 2026-02-26
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [initial Worker commit](https://github.com/JimCollinson/x0xmd/commit/91c1119d873c9131ebf341d65fa6c44e0b6418f6); [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [ADR-0003](ADR-0003-use-canonical-upstream-sources-with-split-authority.md); [contract conformance follow-up](../../planning/phases/02-contract-conformance/02-01-PLAN.md)

## Context

This is a retrospective record prepared on 2026-08-06 for the machine-readable trust endpoint introduced with the original Worker. Agents and automation need to distinguish x0x.md entrypoints from raw upstream sources, understand what an install command will fetch, and associate release-backed artefacts with the release and cache resolution used by the Worker.

Human prose and response headers expose pieces of that provenance, but they do not provide one inspectable document for automated trust decisions. `/trust.json` needs a durable contract that reports only evidenced truth, distinguishes serving-layer entrypoints from upstream authority, and remains honest when provenance cannot be resolved completely.

## Decision Drivers

- Let agents inspect canonical install and trust entrypoints before executing commands.
- Distinguish Worker URLs from the raw upstream sources behind them.
- Expose release and cache identity needed to interpret release-backed artefacts.
- Publish only claims supported by observable serving behaviour and upstream evidence.
- Represent unknown, partial, or degraded resolution without overstating trust or verification state.

## Considered Options

1. Provide no machine-readable trust or provenance document and rely on prose and headers.
2. Publish static metadata that lists URLs but omits live release/cache identity and upstream resolution.
3. Publish `/trust.json` as the machine-readable install provenance contract, with evidenced fields and defined schema/failure semantics.

## Decision

We will publish machine-readable install provenance at `/trust.json`.

The contract exposes canonical entrypoints and install commands, Worker-facing artefact URLs, the raw upstream sources those URLs resolve from, and release/cache identity. It must distinguish x0xmd entrypoints from upstream sources and must publish only claims evidenced by observable serving behaviour and upstream truth. Planned, experimental, unknown, or historical policy must not be presented as active fact.

When release, cache, source, or artefact resolution is unavailable or incomplete, the contract must represent that state honestly as unknown or degraded. It must not infer successful verification, release identity, or source provenance that resolution did not establish.

The endpoint is provenance for a trust decision, not a signature or independent authority. Upstream x0x release artefacts and sources remain authoritative for their own bytes and signatures.

Schema evolution and failure semantics are concrete public-contract work. A linked specification and its validation must define versioning and compatibility, required and optional fields, unknown/degraded representations, caching, status codes, and unavailable or partial-resolution responses.

## Consequences

### Positive

- Agents can inspect the install path, upstream origin, and release/cache context in one request.
- Worker URLs and raw upstream URLs are explicitly distinguishable.
- Unsupported policy or verification claims become reviewable contract defects rather than being buried in prose.

### Negative / Trade-offs

- The endpoint can mislead automated consumers if fields become unsupported or underspecified.
- Live release and cache resolution introduces partial-data and outage cases that need defined semantics.
- Schema evolution can break consumers unless versioning and compatibility expectations are explicit.

### Neutral / Operational

- `/trust.json` reports provenance; it does not itself verify signatures or make installation safe.
- Changes to its fields, meaning, status, caching, or failure responses are public API changes requiring review.

## Validation

- Link and validate a concrete contract specification covering schema versioning, compatibility, required versus optional fields, caching, and the meaning of unknown or degraded release/cache/source data.
- Validate defined failure and partial-resolution semantics for release API failure, missing release assets, fallback sources, stale cache state, and unavailable upstream sources.
- Verify every published entrypoint, command, Worker URL, raw upstream URL, release identity, cache identity, degradation state, and policy claim against observable serving behaviour and upstream evidence.
- Confirm consumers can distinguish x0xmd entrypoints from upstream sources and cannot mistake `/trust.json` for a signature or independent authority.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

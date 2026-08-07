# ADR-0003: Use Canonical Upstream Sources with Split Authority

- **Status:** Proposed
- **Date:** 2026-03-31
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [installer source correction](https://github.com/JimCollinson/x0xmd/commit/4d47fba1121ee0094a1cfdbcea3aabcbf2cb01a1); [documentation source correction](https://github.com/JimCollinson/x0xmd/commit/72fabc0d9058bc31b5101a0a08846c5af3586fae); [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [PR #1 implementation](https://github.com/JimCollinson/x0xmd/commit/a2f310802f3c64d39709968dd9fc2908f1748aaf); [ADR-0009](ADR-0009-establish-x0xmd-as-stable-canonical-public-entrypoint.md); [contract conformance follow-up](../../planning/phases/02-contract-conformance/02-01-PLAN.md)

## Context

This is a retrospective record prepared on 2026-08-06 for the source-authority architecture established by 2026-03-31. Commits `4d47fba` and `72fabc0` moved installer and documentation paths to `saorsa-labs/x0x`; PR #1 removed fork and staging assumptions and distinguished mutable documentation and installer sources from signed published assets.

The serving layer needs fresh upstream-authored documentation and installer bytes while also preserving the release identity and signature relationships of trust artefacts. It additionally owns presentation, route descriptions, indexes, and provenance metadata about the surfaces it serves. Those local materials must remain distinguishable from upstream-authored product truth. Treating every artefact as branch-backed loses stable release identity; treating every document as release-backed makes ordinary public documentation stale between releases.

## Decision Drivers

- Use only the production x0x repository as upstream authority.
- Keep upstream-authored product documentation and installer bytes aligned with the upstream project's current maintained branch.
- Keep signed artefacts associated as a coherent set with one published stable release and its release identity.
- Let x0xmd own serving-layer indexes and metadata without turning them into independent product authority.
- Prevent forks or staging sources from entering production through configuration convenience.

## Considered Options

1. Source every upstream byte from the moving `main` branch.
2. Source every upstream byte from the latest stable release.
3. Use split authority: branch-backed docs and installer, release-backed signed artefacts, all from `saorsa-labs/x0x`.
4. Permit forks or staging repositories as production fallback authorities.

## Decision

We will use only `saorsa-labs/x0x` as the production upstream, with authority split by artefact role.

Canonical authority does not require one network delivery location. Verified replicas, mirrors, caches, or retained stores may deliver canonical bytes while preserving their source and release identity, hashes, signatures, manifests, and provenance; no such delivery location becomes an alternate authority.

Upstream-authored product documentation and installer bytes are backed by upstream `main`. Signed `SKILL.md` bytes and signature, release manifest and signature, verification key, and agent card are backed by one latest published stable release. Production must not source any of these surfaces from a fork or staging repository. Configuration hooks must not be used to change production authority without a reviewed superseding decision.

x0xmd owns locally authored presentation, route descriptions, indexes such as `/llms.txt`, and provenance metadata about its serving layer. Product and protocol claims in those materials must derive from or cite the canonical upstream truth. Generating an index or description locally does not make x0xmd authoritative for the upstream product, documentation, installer, or signed artefacts it describes.

Release-backed trust artefacts must resolve coherently from one stable release identity. A response must not combine artefacts from different releases, associate fallback bytes with a release identity that did not produce them, or claim a release or verification state that resolution did not establish. When coherent resolution cannot be established, the public contract must represent the state honestly as degraded or unknown.

## Consequences

### Positive

- Public documentation and installer changes can become visible without waiting for a release cut.
- Signed trust artefacts retain a stable release tag, signatures, and release-asset identity.
- A single canonical upstream avoids ambiguous fork and staging provenance.
- x0xmd can maintain useful indexes and route metadata while preserving upstream product authority.

### Negative / Trade-offs

- `main` is mutable, so two installer or documentation requests at different times can return different bytes without an x0xmd change.
- Branch-backed and release-backed surfaces can temporarily describe different product states.
- Incomplete releases and upstream/API outages require explicit degraded or unknown states rather than opportunistic cross-release assembly.

### Neutral / Operational

- x0xmd reports upstream, release, cache, and degradation identity where its public contract defines those fields.
- Changes in upstream path layout or release asset naming require coordinated serving-layer review.
- Concrete release fallback, atomicity, and failure schemas belong in the public contract specification and conformance plan rather than this authority decision.

## Validation

- Inspect production defaults and deployment configuration to confirm every upstream repository is `saorsa-labs/x0x`, upstream-authored docs and installer bytes resolve through `main`, and signed artefacts resolve as a coherent set through one latest non-draft, non-prerelease release.
- Verify no fork or staging source is active in production and that release identity, cache metadata, and degraded/unknown state correspond to the resolution path actually used.
- Audit locally generated indexes, route descriptions, provenance metadata, and presentation so product claims derive from or cite canonical upstream truth and remain distinguishable from upstream-authored bytes.
- Test incomplete releases, release changes, cache transitions, and upstream/API failures; require that responses never mix release identities or overstate established release or verification state.
- Validate concrete fallback precedence, cross-artefact atomicity, and user-visible failure semantics against the separately reviewed public contract specification.
- Compare canonical bytes delivered through every approved location and require byte, hash, signature, manifest, provenance, and release-identity equality for the selected source or release.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

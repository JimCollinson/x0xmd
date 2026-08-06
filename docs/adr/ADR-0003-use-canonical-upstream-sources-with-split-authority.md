# ADR-0003: Use Canonical Upstream Sources with Split Authority

- **Status:** Proposed
- **Date:** 2026-03-31
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [installer source correction](https://github.com/JimCollinson/x0xmd/commit/4d47fba1121ee0094a1cfdbcea3aabcbf2cb01a1); [documentation source correction](https://github.com/JimCollinson/x0xmd/commit/72fabc0d9058bc31b5101a0a08846c5af3586fae); [PR #1](https://github.com/JimCollinson/x0xmd/pull/1); [PR #1 implementation](https://github.com/JimCollinson/x0xmd/commit/a2f310802f3c64d39709968dd9fc2908f1748aaf)

## Context

This is a retrospective record prepared on 2026-08-06 for source-authority corrections completed by 2026-03-31. Early Worker configuration pointed installer and documentation traffic at non-canonical sources. Commits `4d47fba` and `72fabc0` moved those paths to `saorsa-labs/x0x`; PR #1 removed remaining fork and staging assumptions and distinguished mutable documentation and installer sources from signed published assets.

The serving layer needs fresh documentation and installer bytes while also preserving the release identity and signature relationships of trust artefacts. Treating every artefact as branch-backed loses stable release identity; treating every document as release-backed makes ordinary public documentation stale between releases.

## Decision Drivers

- Use only the production x0x repository as upstream authority.
- Keep public documentation and the installer aligned with the upstream project's current maintained branch.
- Keep signed artefacts associated with a published stable release and its release identity.
- Prevent forks or staging sources from entering production through configuration convenience.

## Considered Options

1. Source every upstream byte from the moving `main` branch.
2. Source every upstream byte from the latest stable release.
3. Use split authority: branch-backed docs and installer, release-backed signed artefacts, all from `saorsa-labs/x0x`.
4. Permit forks or staging repositories as production fallback authorities.

## Decision

We will use only `saorsa-labs/x0x` as the production upstream, with authority split by artefact role.

Public documentation and the installer are backed by upstream `main`. Signed `SKILL.md` bytes and signature, release manifest and signature, verification key, and agent card are backed by the latest published stable release. Production must not source any of these surfaces from a fork or staging repository. Configuration hooks must not be used to change production authority without a reviewed superseding decision.

The branch/release split identifies where authoritative bytes come from; it does not make x0xmd authoritative for those bytes or claims.

## Consequences

### Positive

- Public documentation and installer changes can become visible without waiting for a release cut.
- Signed trust artefacts retain a stable release tag, signatures, and release-asset identity.
- A single canonical upstream avoids ambiguous fork and staging provenance.

### Negative / Trade-offs

- `main` is mutable, so two installer or documentation requests at different times can return different bytes without an x0xmd change.
- Branch-backed and release-backed surfaces can temporarily describe different product states.
- Incomplete releases or upstream/API outages can interact with fallback URLs and caches in ways that are not yet a fully specified atomic contract.

### Neutral / Operational

- x0xmd reports upstream, release, and cache identity where its public contract defines those fields.
- Changes in upstream path layout or release asset naming require coordinated serving-layer review.

## Validation

- Inspect production defaults and deployment configuration to confirm every upstream repository is `saorsa-labs/x0x`, docs and installer resolve through `main`, and signed artefacts resolve through the latest non-draft, non-prerelease release.
- Verify no fork or staging source is active in production and that release identity/cache metadata corresponds to the resolution path actually used.
- The mutable-`main` installer authority remains an unresolved consequence for human review; this Proposed ADR does not decide whether the installer must instead be commit- or release-pinned.
- Fallback precedence, cross-artefact atomicity when a release is incomplete, and user-visible outage/failure semantics remain unresolved. Acceptance review must either accept those as explicit trade-offs or require a follow-up decision and contract; they must not be presented as solved by the current implementation.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

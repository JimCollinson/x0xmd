# ADR-0002: Keep x0xmd as a Separate Serving Repository

- **Status:** Proposed
- **Date:** 2026-02-26
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** Jim Collinson's 2026-02-26 repository-separation decision; [initial Worker commit](https://github.com/JimCollinson/x0xmd/commit/91c1119d873c9131ebf341d65fa6c44e0b6418f6); [ADR-0009](ADR-0009-establish-x0xmd-as-stable-canonical-public-entrypoint.md)

## Context

This is a retrospective record prepared on 2026-08-06 for a decision Jim Collinson made explicitly on 2026-02-26. x0x needed a memorable web origin that could negotiate browser and command-line responses, expose selected upstream material, apply edge caching and routing policy, present a maintained frontend, and deploy independently through Cloudflare.

Those serving responsibilities are related to the x0x product but have a different release surface and operational owner from the upstream implementation. Combining them without a clear authority boundary would let presentation or edge-serving work accidentally become authoritative for product, protocol, documentation, installer, or signed release artefacts.

## Decision Drivers

- Keep edge routing, presentation, caching, and Cloudflare operations independently maintainable.
- Preserve `saorsa-labs/x0x` as the authority for the product and the artefacts it produces.
- Avoid coupling website iteration to the upstream product repository's implementation and release cadence.
- Make cross-repository ownership explicit enough to prevent copied content from silently becoming a second source of truth.

## Considered Options

1. Keep x0xmd as a separate repository with a narrow serving and presentation mandate.
2. Move the Worker, frontend, and deployment configuration into `saorsa-labs/x0x`.
3. Put the serving layer in a general website or infrastructure repository shared with unrelated products.

## Decision

We will keep x0xmd as a separate serving repository.

x0xmd owns the edge-serving implementation and its operational surface: Worker routing, response and cache behaviour, presentation, directly maintained frontend source and static assets, and Cloudflare deployment configuration. `src/html.js` is authoritative source maintained in this repository; it is not an externally generated artefact.

The production upstream `saorsa-labs/x0x` remains authoritative for the x0x product and protocol, upstream documentation, installer behaviour and bytes, and signed release artefact truth. Serving, transforming, linking to, or presenting those upstream artefacts does not transfer their authority to x0xmd.

If a future host or delivery mechanism is separately approved, it remains part of x0xmd's serving responsibility and does not transfer product, source, installer, or release authority to x0xmd. This decision creates no current requirement to introduce such a host or mechanism.

## Consequences

### Positive

- Website and edge behaviour can evolve without restructuring or releasing the x0x product.
- Product and signed-artifact authority remains with the repository that creates and reviews those artefacts.
- Cloudflare-specific configuration and credentials stay isolated from the product implementation.

### Negative / Trade-offs

- Cross-repository contracts can drift and must be reviewed when upstream paths, release assets, or semantics change.
- Maintainers must distinguish presentation copy owned here from product claims and artefacts owned upstream.
- Some changes require coordinated reviews or commits across two repositories.

### Neutral / Operational

- x0xmd may cache, transform, or render upstream material only within separately reviewed routing, trust, and security decisions.
- Frontend changes are ordinary source changes in this repository and must be reviewed here; no external bake or generator is authoritative.

## Validation

- Review changes to ensure x0xmd owns only edge serving, presentation, static assets, and deployment configuration, while product/protocol/docs/installer/signed-artifact truth remains upstream.
- Check that locally authored frontend content does not represent copied upstream product claims as an independent authority.
- Treat any proposal to move these responsibilities together, introduce another production upstream, or make x0xmd authoritative for signed bytes as requiring a superseding ADR.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

# ADR-0009: Establish x0x.md as the Stable Canonical Public Entrypoint

- **Status:** Proposed
- **Date:** 2026-02-25
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [initial Worker commit](https://github.com/JimCollinson/x0xmd/commit/91c1119d873c9131ebf341d65fa6c44e0b6418f6); [PR #4](https://github.com/JimCollinson/x0xmd/pull/4); [ADR-0002](ADR-0002-keep-x0xmd-as-separate-serving-repository.md); [ADR-0003](ADR-0003-use-canonical-upstream-sources-with-split-authority.md); [ADR-0004](ADR-0004-preserve-dual-browser-cli-root-contract.md); [ADR-0006](ADR-0006-publish-machine-readable-install-provenance.md); [contract conformance follow-up](../../planning/phases/02-contract-conformance/02-01-PLAN.md)

## Context

This is a retrospective record prepared on 2026-08-07 for the public-entrypoint decision developed on 2026-02-25 and 2026-02-26. x0x needed one short, durable origin that humans could visit, command-line and agent clients could use for installation and discovery, and machine consumers could inspect without making a repository host or current serving backend part of the product's lasting public interface.

The established `x0x` product identity, whose naming authority remains upstream, provided bounded context for choosing a matching domain. Within the known ecosystem, `x0x.md` is short and distinctive, works naturally as exact text in agent-first use, and gives `.md` a useful machine-readable-document association. Foundation control, stability, low character count, and an ordinarily small token burden support that choice. These are practical observations, not claims of universal uniqueness or tokenizer-independent behaviour. Pronounceability is not a benefit: spoken `0`/`O` confusion and the possible “tic-tac-toe” reading make verbal communication worse.

A stable entrypoint must not be confused with product or release authority, a single byte-delivery location, or a client's delivery choice. Today the Worker depends heavily on GitHub-hosted branch and release sources. The intended entrypoint needs to remain stable if repository, host, cache, mirror, storage, or backend arrangements change, and it needs to support independently retained verified bytes during GitHub outages without creating a second source of product or release truth.

## Decision Drivers

- Give human, CLI/agent, and machine-readable discovery one durable public origin.
- Preserve the ergonomic command `curl -sfL https://x0x.md | sh` across serving-backend and repository-host changes.
- Keep product, source, installer, and signed-release authority separate from public entrypoint and network delivery.
- Permit independently retained, verified delivery when GitHub is unavailable.
- Let clients select a verified delivery route compatible with their sandbox and security policy without granting that route authority.
- Keep the public name short and exact-text-friendly while recording its verbal ambiguity honestly.
- Place durable domain stewardship with the Autonomi Foundation without inventing present registrar or legal-custody evidence.

## Considered Options

1. Establish `x0x.md` as the stable canonical public entrypoint, with one origin adapting its representation and provenance exposing extensible verified delivery choices.
2. Make canonical GitHub repository, raw-content, and release URLs the public entrypoints.
3. Keep `x0x.md` canonical but require it to remain only a live pass-through to GitHub-hosted bytes.
4. Publish several peer domains or mirrors and let clients discover them without one stable canonical origin.
5. Make the shorter `x0x.sh` the primary install domain or promise it as a redirect, failover, or compatibility endpoint.

## Decision

We will establish `x0x.md` as the canonical stable public origin for x0x discovery and installation. Its canonical ergonomic command is:

```sh
curl -sfL https://x0x.md | sh
```

One origin adapts for human, CLI/agent, and machine-readable consumers. ADR-0004 governs the root representations, explicit installer route, cache safety, and related observable routing behaviour; this record governs the origin's durable role. The public origin remains stable across repository, host, cache, mirror, storage, and serving-backend changes.

The entrypoint, authority, delivery, and client selection are separate concerns:

- **Entrypoint:** `x0x.md` is the durable public address used to discover x0x and its installation and trust surfaces.
- **Authority:** the canonical upstream defined by ADR-0003 remains authoritative for product, source, installer, release identity, manifests, signatures, and artefact truth. Product-name authority also remains upstream.
- **Delivery:** authoritative bytes may be transported from an extensible set of verified locations. Raw GitHub delivery, direct `x0x.md` delivery, repository access, and future locations are examples, not a closed inventory or permanent host contract.
- **Client selection:** a client may choose among verified delivery options according to its sandbox and security policy. Selecting or operating a delivery location never grants it product, source, or release authority.

`x0x.md` is intended to retain and serve verified installer and artefact bytes independently during GitHub outages. Every alternate delivery must preserve the identity and artefact-appropriate evidence that the canonical artefact actually supplies. A replica, mirror, cache, retained store, or replacement backend is delivery infrastructure only and must never become an alternate product or release authority.

Signed skills and machine-readable provenance will expose an extensible set of verified delivery choices and the authority, identity, and verification relationship of each choice. The concrete schema, current location inventory, freshness rules, degraded semantics, and client-selection mechanics require separate specification and approval; this decision does not freeze them.

The intended durable steward of the `x0x.md` domain is the Autonomi Foundation. This record does not assert current registrar ownership, legal custody, or completed transfer without evidence. Any gap between current custody and intended stewardship is future operational conformance work, not a reason to invent a present claim.

`x0x.sh` remains foundation-controlled reserved strategic optionality only. It has no current redirect, route, failover, uptime, or compatibility contract. The canonical command is an ergonomic default, not the only policy-compatible installation path: consumers must retain inspect-first, download-then-verify, signature-checking, and other approved alternatives. Piping network-delivered shell into `sh` has inherent review, substitution, and compromise risk.

## Consequences

### Positive

- Users and agents can remember one origin while its repository host and delivery backend evolve.
- Human presentation, command-line installation, and machine-readable trust discovery reinforce one public identity without collapsing their representation contracts.
- Independently retained verified delivery can keep installation and artefact access available during GitHub outages.
- Sandboxed clients can select policy-compatible delivery without creating competing sources of product or release truth.
- The entrypoint remains inspectable through provenance, hashes, signatures, manifests, and canonical identity rather than trusting location alone.

### Negative / Trade-offs

- Reliable independent delivery requires custody evidence, retained storage, freshness policy, coherent release handling, and outage testing beyond the current GitHub-dependent implementation.
- Domain stewardship and operational continuity become durable responsibilities, while present registrar and legal custody remain an evidence gap until audited.
- Multiple delivery choices increase the risk of stale, partial, corrupt, or cross-release sets unless identity and verification are enforced coherently.
- `x0x.md` is verbally ambiguous because `0` and `O` can be confused and the name can be described as “tic-tac-toe.”
- The canonical curl-pipe-shell command is convenient but executes network-delivered code before the user has inspected it.

### Neutral / Operational

- ADR-0002 governs the separate repository's serving responsibility; ADR-0003 governs upstream and release authority; ADR-0004 governs negotiated representations; ADR-0006 governs machine-readable provenance.
- Stable public URLs do not require a permanent repository host, cache, mirror, storage provider, or backend implementation.
- New delivery locations may be added when they preserve canonical identity and verification; the durable decision does not enumerate a closed host list.
- `x0x.sh` can remain registered or controlled without being advertised or operated as a public endpoint.

## Validation

- Audit documentary and registrar evidence for current `x0x.md` custody and any transfer needed to reach Autonomi Foundation stewardship; report unknown custody honestly until evidence exists.
- Exercise browser, CLI/agent, and machine-readable consumers through `x0x.md`; confirm the exact canonical command remains `curl -sfL https://x0x.md | sh` and representation/cache behaviour conforms to ADR-0004.
- With GitHub delivery unavailable and transient caches cleared, install and retrieve independently retained bytes through `x0x.md`. For the mutable-`main` installer, require its actual canonical source revision, digest, fetch or last-verification time, and freshness state; permit an older retained installer only as explicitly last-known verified/stale, never current/latest, and subject to client policy. For signed release artefacts, verify the applicable canonical hashes, signatures, manifests, provenance, and release identity against the authoritative set.
- Compare bytes and artefact-appropriate identity and verification evidence obtained through multiple advertised delivery choices; require them to match the selected canonical source revision or coherent release. Reject corrupt, partial, unverifiable, cross-source, cross-release, or identity-mismatched combinations, and reject stale bytes misrepresented as current/latest; do not reject honestly disclosed last-known stale installer bytes solely because the mutable-`main` installer has no signature or release manifest.
- Verify signed skills and machine-readable provenance can describe more than one delivery choice, including each choice's role, identity, and verification relationship, without treating client selection or delivery operation as authority.
- Migrate a serving backend while preserving stable public URLs and canonical identity, then confirm no `x0x.sh` redirect, route, failover, uptime, or compatibility behaviour has been implied.
- Revisit this decision if upstream product identity changes, Foundation stewardship is rejected, the origin can no longer remain stable, or delivery requires changing canonical product or release authority.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

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

The established `x0x` product identity, whose naming authority remains upstream, provided bounded context for choosing a matching domain. Within the known ecosystem, `x0x.md` is short and distinctive, works naturally as exact text in agent-first use, is suitable for Autonomi Foundation stewardship, and gives `.md` a useful machine-readable-document association. These are practical observations, not claims of universal uniqueness. Pronounceability is not a benefit: spoken `0`/`O` confusion and the possible “tic-tac-toe” reading make verbal communication worse.

A stable entrypoint must not be confused with product or release authority or with a promise about a particular backend. Today x0xmd fetches and proxies `install.sh` directly from canonical `saorsa-labs/x0x` GitHub `main`. That behaviour is correct and sufficient. Dependence on GitHub availability is an accepted trade-off, while the stable public origin preserves the freedom to change hosting or backend arrangements later without breaking public URLs.

## Decision Drivers

- Give human, CLI/agent, and machine-readable discovery one durable public origin.
- Preserve the ergonomic command `curl -sfL https://x0x.md | sh` across serving-backend and repository-host changes.
- Keep product, source, installer, and signed-release authority separate from the public entrypoint and its implementation.
- Preserve the ability to change the hosting or serving backend later without making that change a current requirement.
- Keep the public name short and exact-text-friendly while recording its verbal ambiguity honestly.
- Place durable domain stewardship with the Autonomi Foundation without inventing present registrar or legal-custody evidence.

## Considered Options

1. Establish `x0x.md` as the stable canonical public entrypoint, with one adaptive origin whose implementation may change without changing public URLs.
2. Make canonical GitHub repository, raw-content, and release URLs the public entrypoints.
3. Establish `x0x.md` but permanently bind its public contract to the current GitHub-backed implementation.
4. Publish several peer domains or endpoints without one stable canonical origin.
5. Make `x0x.sh` the primary install domain or promise it as a redirect, failover, or compatibility endpoint.

## Decision

We will establish `x0x.md` as the canonical stable public origin for x0x discovery and installation. Its canonical ergonomic command is:

```sh
curl -sfL https://x0x.md | sh
```

One origin adapts for human, CLI/agent, and machine-readable consumers. ADR-0004 governs the root representations, explicit installer route, cache safety, and related observable routing behaviour; this record governs the origin's durable role. The public origin remains stable across repository, host, cache, mirror, storage, and serving-backend changes.

`x0x.md` is the durable public address used to discover x0x and its installation and trust surfaces. The canonical upstream defined by ADR-0003 remains authoritative for the product, source, installer, release identity, manifests, signatures, and artefact truth. Product-name authority also remains upstream. Serving or proxying upstream material through the stable entrypoint does not transfer that authority to x0xmd.

The current canonical-GitHub-`main` proxy behaviour conforms to this decision and is sufficient. Its dependence on GitHub availability is an accepted trade-off, not a defect or conformance gap. Stable public URLs preserve backend optionality; they do not require independent retention or storage, automated ingestion or attestation, freshness ledgers, outage guarantees, plural advertised delivery, provenance-based host choice, signed-skill changes, or client-selection machinery.

Independent hosting or failover may be reconsidered only if demonstrated availability problems justify a new architectural decision, bounded specification, and separately approved GSD plan. This record preserves that avenue without selecting or designing it. Skills and clients may offer their own sandbox-appropriate installation paths without requiring x0xmd to discover, verify, enumerate, retain, or serve them.

The intended durable steward of the `x0x.md` domain is the Autonomi Foundation. This record does not assert current registrar ownership, legal custody, or completed transfer without evidence, and it does not classify unevidenced custody as a current conformance gap.

`x0x.sh` remains reserved strategic optionality only. It has no current redirect, route, failover, uptime, or compatibility contract. The canonical command is an ergonomic default, not the only policy-compatible installation path: consumers must retain inspect-first, download-then-verify, signature-checking, and other approved alternatives. Piping network-delivered shell into `sh` has inherent review, substitution, and compromise risk.

## Consequences

### Positive

- Users and agents can remember one origin while its repository host and delivery backend evolve.
- Human presentation, command-line installation, and machine-readable trust discovery reinforce one public identity without collapsing their representation contracts.
- The current simple GitHub-backed implementation can remain conformant without prematurely adding distribution machinery.
- Public URLs need not change if a separately approved future need leads to a different backend.

### Negative / Trade-offs

- Installation through `x0x.md` currently depends on GitHub availability.
- Domain stewardship becomes a durable responsibility, while present registrar and legal custody are not established by this record.
- `x0x.md` is verbally ambiguous because `0` and `O` can be confused and the name can be described as “tic-tac-toe.”
- The canonical curl-pipe-shell command is convenient but executes network-delivered code before the user has inspected it.

### Neutral / Operational

- ADR-0002 governs the separate repository's serving responsibility; ADR-0003 governs upstream and release authority; ADR-0004 governs negotiated representations; ADR-0006 governs machine-readable provenance.
- Stable public URLs do not require a permanent repository host, cache, mirror, storage provider, or backend implementation.
- Independent hosting or failover remains uncommitted future optionality rather than a current requirement or design.
- Skills and clients can offer other installation paths without making them part of x0xmd's public contract.
- `x0x.sh` can remain registered or controlled without being advertised or operated as a public endpoint.

## Validation

- Exercise browser, CLI/agent, and machine-readable consumers through `x0x.md`; confirm the exact canonical command remains `curl -sfL https://x0x.md | sh` and representation/cache behaviour conforms to ADR-0004.
- Confirm the installer currently fetched and proxied through `x0x.md` resolves directly from canonical `saorsa-labs/x0x` GitHub `main`, and do not report the resulting availability dependence as a conformance failure.
- Review public contracts so `x0x.md` remains the stable entrypoint while canonical upstream product, installer, and release authority remains unchanged.
- If a future backend change is separately approved, verify that canonical `x0x.md` URLs remain stable and that the new mechanism does not claim upstream authority.
- Report intended Autonomi Foundation stewardship without claiming current registrar ownership, legal custody, or completed transfer unless evidence establishes it.
- Confirm no `x0x.sh` redirect, route, failover, uptime, or compatibility behaviour is promised by this decision.
- Revisit this decision if upstream product identity changes, Foundation stewardship is rejected, the origin can no longer remain stable, or delivery requires changing canonical product or release authority.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

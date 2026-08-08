# ADR-0001: Adopt the Autonomi ADR Standard

- **Status:** Proposed
- **Date:** 2026-08-06
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [WithAutonomi/adr-standard founding merge](https://github.com/WithAutonomi/adr-standard/commit/0b36be07b4730c158eaed3655b551318c81352bf); [bootstrap specification](https://github.com/WithAutonomi/adr-standard/blob/0b36be07b4730c158eaed3655b551318c81352bf/docs/spec/BOOTSTRAP.md)

## Context

x0xmd has accumulated decisions about public routing, upstream authority, trust metadata, content negotiation, rendering security, and deployment. Those decisions affect a production serving boundary, but the repository has not had a durable, repository-local process for recording their context, alternatives, invariants, or later supersession.

WithAutonomi maintains a consumer ADR system with a common template, lifecycle rules, authoring guidance, a repository-local structural gate, and a pull-request workflow. The founding merge is an eligible reviewed commit in canonical `main` history and provides an exact provenance point rather than relying on a moving branch.

## Decision Drivers

- Preserve the reasons and trade-offs behind production-facing architectural decisions beside the code they govern.
- Use the same human-owned, immutable-Accepted lifecycle as the wider Autonomi engineering context.
- Make adoption reproducible from a canonical repository and exact source revision.
- Keep structural automation as a review aid rather than treating it as decision authority.

## Considered Options

1. Adopt the canonical `WithAutonomi/adr-standard` consumer system from an exact reviewed commit.
2. Create a bespoke x0xmd ADR format, lifecycle, and validator.
3. Continue relying on commit history, pull-request discussion, and external planning notes without repository-local ADRs.

## Decision

We will govern x0xmd architectural decisions with the consumer ADR system from `https://github.com/WithAutonomi/adr-standard` at exact founding merge `0b36be07b4730c158eaed3655b551318c81352bf`.

New records begin as Proposed. An authorised human accepts or rejects them after engineering review; neither an agent nor a passing gate can accept a decision. Accepted records are immutable. A changed decision is recorded in a new forward-only superseding ADR rather than by rewriting the Accepted record.

The repository-local governance script and workflow provide the adopted baseline's documented structural checks. Their known fail-open, discovery, history, lifecycle, identity, and self-modification limits remain limits of automation, not exemptions from human review. Repository agent guidance must direct architectural work to inspect these records and preserve the ADR/spec/plan boundary.

## Consequences

### Positive

- Architectural intent, alternatives, evidence, and consequences become reviewable with the code they constrain.
- The exact source URL and full commit SHA make the adopted governance baseline auditable.
- Common lifecycle and review rules reduce ambiguity for human and AI contributors.

### Negative / Trade-offs

- Authors and reviewers take on the cost of maintaining substantive records rather than treating a passing structural check as sufficient.
- The inherited gate is intentionally incomplete and cannot enforce human identity, all lifecycle transitions, or every historical mutation.
- Later improvements to the ADR system require an explicit, reviewed update rather than silently following upstream `main`.

### Neutral / Operational

- ADRs contain durable decisions and invariants; concrete build contracts belong in specs and execution sequencing belongs in plans.
- Retrospective records prepared with this adoption remain Proposed until human review, regardless of the historical date of the underlying choice.

## Validation

- Audit the consumer governance files against `WithAutonomi/adr-standard@0b36be07b4730c158eaed3655b551318c81352bf` by Git blob and required mode.
- Run `python3 scripts/adr-governance.py` for ADR changes and require the ADR Governance workflow to pass on pull requests that trigger it.
- Review each Proposed record for real alternatives, evidence, trade-offs, consequences, and a testable validation section before any human changes its status.
- Confirm future architectural changes either comply with the applicable Accepted ADRs or propose a superseding record before implementation proceeds.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

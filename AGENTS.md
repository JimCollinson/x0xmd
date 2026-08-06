<!-- SPDX-License-Identifier: MIT OR Apache-2.0 -->
<!-- ADR guidance adapted from WithAutonomi/adr-standard at 0b36be07b4730c158eaed3655b551318c81352bf. -->
<!-- See docs/adr/NOTICE for the source fragment's provenance and licence. -->

# Repository Agent Guidance

## Repository Scope and Authority

This repository owns the Cloudflare Worker that serves `x0x.md`: edge routing, response and cache behaviour, presentation, static assets, and deployment configuration. The production upstream is `saorsa-labs/x0x`; this repository serves or presents its product, protocol, documentation, installer, and signed-artifact truth but does not become authoritative for those upstream artefacts.

Treat the tracked source in this repository as directly maintained:

- `src/index.js` is the authoritative Worker routing and serving implementation.
- `src/html.js` is the authoritative frontend source. It is not an externally generated artefact.
- `wrangler.toml` and `.github/workflows/deploy.yml` define Cloudflare deployment behaviour. Deployment is an explicit operational action, not a validation step.

Do not introduce fork, staging, or alternate upstream authority without a reviewed architectural decision. Do not deploy, publish, merge, push, or open a PR unless the current work packet explicitly authorises that action.

## Architecture Decision Records

Before changing architecture, protocols, storage formats, cryptography, network behaviour, public APIs, data models, or operational invariants, inspect `docs/adr/`.

For this repository, that requirement explicitly includes changes to:

- public endpoint and API contracts, including route exposure, canonical redirects, content negotiation, status codes, response types, caching, CORS, and failure semantics;
- upstream source and artefact authority, including branch-backed versus release-backed bytes, fallback sources, and fork or staging use;
- signatures and trust metadata, including `trust.json`, `SKILL.md` signatures, release manifests, verification keys, and the agent card;
- Worker routing, caching, fetching, fallback, and other network behaviour; and
- Cloudflare deployment invariants, including Wrangler configuration, assets bindings, workflow triggers, credentials, and production authority.

If a change creates or alters an architectural decision, draft or update a **Proposed** ADR using `docs/adr/TEMPLATE.md` and the `ADR-NNNN` filename convention.

Never edit an Accepted ADR; create a superseding ADR instead. Never mark an ADR Accepted autonomously: acceptance requires human engineering review and debate.

During review, check ADR correctness, rejected alternatives, evidence, consequences, and immutable-Accepted compliance. See `docs/adr/TOOLING.md` for authoring guidance and the review standard.

## Artifact Boundaries

- ADRs record durable decisions and invariants, alternatives, trade-offs, and consequences. They do not contain installation steps, implementation sequencing, or task lists.
- Specs define concrete bounded behaviour, interfaces, validation rules, and acceptance criteria.
- Plans sequence approved work, verification, checkpoints, and stop conditions.
- Proposed ADRs remain review material until an authorised human accepts or rejects them.

## Verification and CI

Run `python3 scripts/adr-governance.py` for ADR changes. `.github/workflows/adr-governance.yml` is the structural CI arbiter for ADR changes once a pull request exists.

No general code-quality CI arbiter currently exists in this repository. `.github/workflows/deploy.yml` is a deployment workflow, not a validation workflow, and its success must not be reported as general quality evidence.

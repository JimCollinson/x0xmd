## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** In progress on `feat/adopt-adr-standard`
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Mode:** Attended. Jim Collinson's live instruction on 2026-08-06 set this run to `attended mode`; stop and surface any escalation trigger.
- **Source pin:** `https://github.com/WithAutonomi/adr-standard` at founding merge `0b36be07b4730c158eaed3655b551318c81352bf`

## Verification and Review

- This is a meaningful work-unit and uses the full GSD gauntlet.
- Review cadence is per work-unit: local verification, clean-context test, adversarial review, Craft Review, then Jim's attended checkpoint. No review or CI result is recorded until it has actually run.
- There is no `.gsd/gate.sh` in this repository.
- For this slice, the installed `.github/workflows/adr-governance.yml` is the structural CI arbiter for ADR changes after a PR is created. Adding that workflow is an explicitly approved CI-mechanism change in this slice.
- No general quality CI arbiter currently exists. `.github/workflows/deploy.yml` deploys the Worker; it is not a validation workflow and is out of scope for this slice.

## Scope State

- Install the eight direct consumer-kit files byte-exact from the pinned source and merge its agent-guidance fragment into repository-specific `AGENTS.md`.
- Draft ADR-0001 through ADR-0007 as Proposed records only.
- Remove only the stale generated-source comment from `src/html.js`; that file is now the authoritative directly maintained frontend source.
- Do not add `.adr-kit.yaml`, alter root legal files, alter deployment/build/test mechanisms, change route or trust behaviour, create a PR, push, merge, publish, deploy, or mark an ADR Accepted.
- Pre-existing untracked `.artifacts/` and `.claude/` are outside scope and must remain untracked and uncommitted.

## Decision Queue

- Public-document and LLM artefact generation model.
- Production deployment authority.
- Current `/trust.json` contract remediation, including stale GPG/strict-verification fields and missing schema/failure semantics.

The former frontend-generator queue item is resolved by removing the stale comment: `src/html.js` itself is authoritative and directly maintained.

## Forks and Parked Units

- Forks: none.
- Parked units: none.

## Next Step

Install the pinned ADR consumer kit and add repository-specific agent guidance, then continue through the approved plan's proposed-ADR and source-notice units.

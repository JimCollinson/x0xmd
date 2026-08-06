## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** Implementation and local verification complete on `feat/adopt-adr-standard`; independent full-gauntlet review and Jim's attended checkpoint remain pending.
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Mode:** Attended. Jim Collinson's live instruction on 2026-08-06 set this run to `attended mode`; stop and surface any escalation trigger.
- **Source pin:** `https://github.com/WithAutonomi/adr-standard` at founding merge `0b36be07b4730c158eaed3655b551318c81352bf`

## Verification and Review

- This is a meaningful work-unit and uses the full GSD gauntlet.
- Review cadence is per work-unit: local verification, clean-context test, adversarial review, Craft Review, then Jim's attended checkpoint.
- There is no `.gsd/gate.sh` in this repository.
- For this slice, the installed `.github/workflows/adr-governance.yml` is the structural CI arbiter for ADR changes after a PR is created. Adding that workflow is an explicitly approved CI-mechanism change in this slice.
- No general quality CI arbiter currently exists. `.github/workflows/deploy.yml` deploys the Worker; it is not a validation workflow and is out of scope for this slice.
- Local verification passed: `python3 scripts/adr-governance.py` checked seven ADR files; `git diff --check origin/main` passed; all eight direct kit destinations matched the pinned source blobs and required modes; scope/status inspection passed.
- CI has not run because no PR was created. Clean-context, adversarial, and Craft Review have not run in this operative session and remain required; no review or CI green is claimed.

## Scope State

- Installed the eight direct consumer-kit files byte-exact from the pinned source and merged its agent-guidance fragment into repository-specific `AGENTS.md`.
- Drafted ADR-0001 through ADR-0007 as Proposed records only; none is Accepted.
- Removed only the stale generated-source comment from `src/html.js`; that file is now the authoritative directly maintained frontend source.
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

Run independent clean-context, adversarial, and Craft Review for this meaningful work-unit. Then return to Jim's attended checkpoint to review the Proposed ADRs, unresolved validation questions, and whether a PR should be created so the ADR Governance CI arbiter can run.

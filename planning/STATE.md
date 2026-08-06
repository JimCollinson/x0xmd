## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** Attended draft remediation completed on `feat/adopt-adr-standard`. Jim has disposed the ADR/conformance-boundary question; four Proposed ADRs now state intended durable architecture, and a separate Proposed conformance plan records runtime gaps. No ADR is Accepted, affected reviews must rerun, and no runtime implementation is approved.
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Mode:** Attended. Jim Collinson's live instruction on 2026-08-06 set this run to `attended mode`; stop and surface any escalation trigger.
- **Source pin:** `https://github.com/WithAutonomi/adr-standard` at founding merge `0b36be07b4730c158eaed3655b551318c81352bf`

## Attended Disposition

- Jim decided that ADRs, including retrospective records, describe intended
  durable architecture rather than embedding current implementation gaps as bug
  reports or acceptance blockers.
- Current divergence remains review-visible in this state and in Proposed
  `planning/phases/02-contract-conformance/02-01-PLAN.md`.
- ADR/spec/plan boundaries remain separate: ADRs state invariants, a future spec
  must define concrete public schemas and failure/cache semantics where needed,
  and the Proposed plan sequences conformance work only after review and
  approval.

## Verification and Review

- This is a meaningful work-unit and uses the full GSD gauntlet.
- Review cadence is per work-unit: code/ADR review, goal verification, local/CI evidence, adversarial review, Craft Review, clean-context test, then Jim's attended checkpoint.
- There is no `.gsd/gate.sh` in this repository.
- For this slice, the installed `.github/workflows/adr-governance.yml` is the structural CI arbiter for ADR changes after a PR is created. Adding that workflow is an explicitly approved CI-mechanism change in this slice.
- No general quality CI arbiter currently exists. `.github/workflows/deploy.yml` deploys the Worker; it is not a validation workflow and is out of scope for this slice.
- Local bootstrap verification passed: `python3 scripts/adr-governance.py` checked seven ADR files; `git diff --check origin/main` passed; all eight direct kit destinations matched the pinned source blobs and required modes; scope/status inspection passed.
- Independent code review passed with no ranked findings. It confirmed source fidelity, legal/provenance handling, workflow isolation, Proposed statuses, current-code/history accuracy, and comment-only frontend change.
- Independent ADR validation passed structurally and identified authority,
  cache-safety, fallback-escaping, and trust-contract concerns. Jim's disposition
  moved implementation-gap reporting into the Proposed conformance plan while
  retaining the intended invariants in ADR-0003, ADR-0004, ADR-0006, and
  ADR-0007.
- Draft remediation verification passed locally: both
  `python3 scripts/adr-governance.py` and
  `GITHUB_BASE_REF=main python3 scripts/adr-governance.py` checked seven ADRs;
  `git diff --check origin/main...HEAD` passed; status and scope inspection found
  only the four ADR revisions, this state update, and the new Proposed plan.
- The prior ADR helper findings remain evidence, not a passing review of the
  remediated drafts. Independent ADR validation and any affected goal,
  adversarial, Craft, and clean-context review must rerun against the new commit.
- CI has not run because no PR was created. Goal verification, adversarial
  review, Craft Review, and clean-context review have not completed and remain
  required; no CI or full-gauntlet green is claimed.

## Scope State

- Installed the eight direct consumer-kit files byte-exact from the pinned source and merged its agent-guidance fragment into repository-specific `AGENTS.md`.
- Drafted ADR-0001 through ADR-0007 as Proposed records only; none is Accepted.
- Revised only ADR-0003, ADR-0004, ADR-0006, and ADR-0007 to state intended
  authority, cache-safety, provenance, release-coherence, and safe-fallback
  invariants without presenting current implementation gaps as ADR content.
- Added Proposed Plan 02-01 with four bounded future conformance slices. It is
  not approved for implementation and does not authorise runtime or test changes.
- Removed only the stale generated-source comment from `src/html.js`; that file is now the authoritative directly maintained frontend source.
- This remediation changed no runtime code, tests, CI, deployment, build,
  environment, copied kit bytes, agent guidance, or ADR status.
- Do not add `.adr-kit.yaml`, alter root legal files, alter deployment/build/test mechanisms, change route or trust behaviour, create a PR, push, merge, publish, deploy, or mark an ADR Accepted.
- Pre-existing untracked `.artifacts/` and `.claude/` are outside scope and must remain untracked and uncommitted.

## Known Current Divergence and Decision Queue

- Locally generated `/llms.txt` and other x0xmd-owned indexes/route descriptions
  need conformance review to ensure product claims derive from or cite upstream
  truth while remaining distinguishable from upstream-authored bytes.
- Production deployment authority.
- `/trust.json` currently exposes unsupported experimental GPG/strict-verification
  policy fields and lacks approved schema evolution plus unknown/degraded and
  failure semantics; Proposed Plan 02-01 Slice C tracks specification and
  remediation.
- Negotiated root responses currently lack a demonstrated shared-cache partition
  across every representation-selecting input or a no-shared-cache policy;
  Proposed Slice A tracks the contract, implementation, and tests without
  preselecting `Vary` as the only mechanism.
- Markdown fallback currently interpolates exception detail into markup assigned
  to `innerHTML`; Proposed Slice B tracks locally controlled fallback content,
  escaping, and security regression tests. CDN/SRI/CSP posture remains a human
  design question.
- Release resolution can currently combine per-artefact fallback URLs with a
  release identity established by another resolution path; Proposed Slice D
  tracks coherent one-release resolution and specified fallback/degraded tests.

The former frontend-generator queue item is resolved by removing the stale comment: `src/html.js` itself is authoritative and directly maintained.

## Forks and Parked Units

- Forks: none.
- Parked units: none.

## Next Step

Rerun independent ADR validation for ADR-0003, ADR-0004, ADR-0006, and ADR-0007,
then continue the required goal, adversarial, Craft, and clean-context reviews for
the ADR bootstrap work-unit. Jim retains the attended acceptance and exact
PR-action checkpoints. Proposed Plan 02-01 remains parked until the relevant ADRs
complete human review/acceptance, its unresolved contract decisions are specified,
and a separate implementation packet approves each runtime slice and any required
test mechanism.

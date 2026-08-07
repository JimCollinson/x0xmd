# GSD Checkpoint — Corrected Phase 01 ADR foundation

Date: 2026-08-07
Project: x0xmd
Slice/question: Corrected nine-ADR/seven-slice Phase 01 scope
Prepared by: orchestrator
Agents/tools used: operative, ADR helper, code reviewer, verifier, adversarial reviewer, Craft Reviewer, panel dispatcher

## Status

Ready for Jim's attended ADR review. Not ready to be called PR/merge-ready because
the required fresh external clean-context lane is deferred by an inactive owner-
configured runner boundary.

Meaningful work-unit? Yes — repository ADR governance and nine architectural
records, including public entrypoint, routing, authority and trust boundaries.

Review cadence: per-unit code review, goal verification, structural CI,
adversarial and Craft completed; clean-context explicitly deferred.

Unreviewed backlog: fresh clean-context gate for the corrected nine-ADR/seven-
slice scope.

## What happened

- Added Proposed ADR-0009 explaining why `x0x.md` is the stable canonical public
  entrypoint, including the exact install command, adaptive audience behavior,
  intended Foundation stewardship and naming trade-offs.
- Kept direct delivery from canonical `saorsa-labs/x0x` GitHub `main` as the
  correct current design and accepted GitHub availability dependence as a
  proportionate trade-off.
- Withdrew the premature independent-storage, verification-ledger and outage-
  service design. Independent hosting or failover remains only a future avenue
  if demonstrated need later justifies a new ADR, specification and plan.
- Restored Proposed Plan 02-01 to seven unapproved slices A-G. The withdrawn
  eight-slice draft and its review findings remain historical evidence only.

## Evidence

CI arbiter / green of record:

- Structural ADR arbiter: `.github/workflows/adr-governance.yml` on draft PR #4.
- Corrected reviewed head `d9a340e`: run `31195124339` passed.
- This is structural ADR evidence only. No general code-quality CI arbiter exists;
  `.github/workflows/deploy.yml` is not validation evidence.
- Any later evidence-only checkpoint commit requires its own successful current-
  head ADR Governance check before handoff.

Local fast gate / `.gsd/gate.sh`:

- N/A; no `.gsd/gate.sh` exists.
- Both local governance modes and full/correction diff checks passed.

Files changed/artifacts produced:

- Canonical ADR consumer kit, repository `AGENTS.md`, and structural ADR CI.
- Nine Proposed ADRs, Plan 01, this checkpoint/state/verification evidence, and
  Proposed seven-slice Plan 02.
- Runtime source is unchanged except the previously reviewed deletion of the
  stale four-line generated-source notice from `src/html.js`.

Checks run:

- `python3 scripts/adr-governance.py`
- `GITHUB_BASE_REF=main python3 scripts/adr-governance.py`
- `git diff --check origin/main...HEAD`
- Source blob/mode, status/count, slice-count, local-link, scope and mechanism-
  boundary checks.

Results:

- Nine ADRs; all remain Proposed.
- Proposed Plan 02-01 contains exactly seven unapproved slices A-G.
- Independent code/ADR review passed with no findings at `801275b`.
- Independent goal verification passed 10/10 at `801275b`; record commit
  `5f89cdf`.
- Exact-head structural ADR CI passed at `d9a340e`.
- No runtime, configuration, storage, asset, skill, test/harness, workflow,
  deployment, dependency, environment, domain, DNS, secret or spend change was
  introduced by the corrected reopening.

## Honesty rules check

- No-harness-modification: Pass. No gate, workflow, harness, build or environment
  mechanism changed during the corrected reopening.
- Baseline-diff for evidence: Pass. No failure or skip was dismissed.
- Evidence reproducible-from-branch: Pass for local structural checks. Re-fetching
  the private pinned source requires authorised GitHub access, as previously
  disclosed.
- Local vs CI consistency: consistent for structural ADR governance.

## Review findings

Clean-context test:

- Reviewer/tool: fresh Claude lane requested via panel.
- Result: Not run — deferred; panel runner boundary inactive under owner
  configuration.
- Findings: no lane findings exist because no external dispatch occurred.
- Consequence: this checkpoint may be used for Jim's attended ADR review, but the
  work cannot be called PR/merge-ready until a fresh clean-context lane runs.
- models: none · 0s

Adversarial review:

- Reviewer/tool: fresh OpenAI adversarial reviewer (`gpt-5.6-sol`).
- Required: Yes.
- Result: READY-WITH-NITS; no CRITICAL, HIGH or MEDIUM findings.
- LOW: state, verification and PR narrative trailed the completed push/CI. This
  checkpoint and current state reconcile that evidence.
- NIT: inherited `actions/checkout@v4` runtime warning should wait for a deliberate
  future canonical-kit baseline update; it is not changed in this slice.
- Withdrawn-distribution findings: valid only against withdrawn draft scope and
  not current blockers.

Craft Review:

- Reviewer/tool: fresh Craft Reviewer.
- Required: Yes.
- Verdict: Pass.
- CONFORMANCE findings and dispositions: none.
- SIMPLICITY / NIT findings carried: none.

## Drift / scope concerns

- Current installer availability depends on GitHub. Jim explicitly accepted that
  trade-off for the current service boundary.
- Existing Plan 02 runtime divergences remain future, unapproved work.
- Fresh clean-context evidence remains outstanding.

## Open questions / decisions for Jim

- Review the nine Proposed ADRs; acceptance or rejection is human-only.
- Decide separately whether any Proposed Plan 02 work should later be approved.
- If PR/merge readiness is desired, activate the external panel runner boundary
  and rerun a fresh clean-context gate first.

PR / upstream action gate:

- Existing draft PR #4: https://github.com/JimCollinson/x0xmd/pull/4
- Ready for Jim's attended ADR review: Yes, subject to current-head structural CI.
- PR/merge-ready: No — clean-context deferred and no merge approval exists.

## Recommended next step

Stop for Jim's attended ADR review. Do not accept ADRs, approve Plan 02, merge,
publish, deploy, or implement runtime changes without the corresponding explicit
human gate. Run a fresh clean-context lane after the owner runner boundary is
activated and before any PR/merge-ready claim.

## Handoff note

Use this checkpoint for the corrected nine-ADR/seven-slice scope. Earlier
checkpoint and clean-context files are historical evidence for earlier scopes.

# Phase 01 ADR Foundation Verification

Date: 2026-08-06

## Current Result

- **Verification:** superseded; fresh goal verification has not run.
- **Documentation-remediation start:** `feat/adopt-adr-standard@fc4ad4dee009c4ab1b7d5870d8d83f1b6fd9c309`, local and one unpushed commit ahead of the remote before this remediation.
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`.
- **Historical assessed target:** `294aab803d3759c9005a409cb99110afe1246756`.
- **Historical result:** 9/9 expanded foundation goals were reported verified at that target.
- **Current disposition:** the historical 9/9 result is invalidated for readiness by the later effective-routing HIGH. It must not be used as verification of the Worker-first remediation or current branch head.
- **Review boundary:** Phase 01 remains in progress. All eight ADRs remain Proposed and Plan 02-01 remains Proposed and unapproved. No push, PR-description change, runtime implementation, deployment, or ADR acceptance is authorised by this record.

## Superseded Historical Findings

The following evidence describes only the assessment at `294aab8`; it is retained for audit history and does not verify the later documentation remediation:

1. The pinned ADR-standard kit destinations reproduced byte-for-byte and at the required modes: seven `100644` files and `scripts/adr-governance.py` at `100755`.
2. Repository guidance and governance wiring were locally validated, and both governance modes discovered eight Proposed ADRs.
3. Eight substantive Proposed retrospective ADRs existed with required sections, options, consequences, and validation.
4. Authority and contract decisions were separated from future conformance planning.
5. ADR-0005 was reported as a complete four-class route model because it matched direct `src/index.js` classification. That finding is superseded: it did not test Cloudflare's effective asset precedence, which can bypass the Worker for a matching packaged file.
6. ADR-0008 was reported as matching `wrangler.toml`, Worker delegation, and `public/fonts/`. That finding is superseded: the absence of Worker-first Assets routing means the effective platform path did not preserve the claimed subordinate delegation model.
7. Proposed Plan 02-01 then contained six future slices. It now contains seven Proposed slices, including a separately gated future Worker-first conformance slice.
8. The assessed remediation range changed no runtime or mechanism files. The present six-file documentation remediation requires a fresh committed-range scope check.
9. State was reported current at the historical target. Later adversarial evidence and Jim's attended decision superseded that handoff.

## Current Unverified Remediation Claims

Independent code review and goal verification must determine whether the current documentation actually:

- records Worker-first classification as the intended invariant in Proposed ADR-0005 and ADR-0008 without turning either ADR into a bug report;
- makes `ASSETS` subordinate to approved bounded namespace classification and treats `public/` only as packaging input;
- preserves the current asset-first effective behaviour as a conformance divergence in planning/state rather than as architecture;
- defines exactly seven Proposed Plan 02-01 slices and gates Slice G's Wrangler and integration-test mechanism changes separately; and
- changes only the six authorised documentation files while preserving source-kit bytes and modes.

## Artifact and Wiring Handoff

| Artifact/link | Exists | Substantive | Wired | Status |
| --- | --- | --- | --- | --- |
| Eight direct consumer-kit destinations | Yes | Exact pinned-source bytes/modes at historical assessment | Canonical installed paths; script invoked by workflow/guidance | HISTORICALLY VERIFIED |
| `AGENTS.md` ADR guidance | Yes | Repository-specific authority and boundaries | Directs architectural work to ADRs, template, tooling, and gate | HISTORICALLY VERIFIED |
| ADR-0001 through ADR-0008 | Yes | All remained Proposed at the historical assessment | Current content/status/link checks required | HISTORICAL / PENDING |
| ADR-0005 route model | Yes | Worker-first intended decision drafted | Fresh independent review and goal verification required | UNVERIFIED REMEDIATION |
| ADR-0008 static-serving decision | Yes | Subordinate Assets decision drafted | Fresh independent review and goal verification required | UNVERIFIED REMEDIATION |
| Governance script and workflow | Yes | Exact source baseline historically established | Exact-remediation-head CI pending | HISTORICAL / PENDING |
| Proposed Plan 02-01 | Yes | Seven bounded future slices, including G | Explicitly gated and unapproved; fresh verification required | UNVERIFIED REMEDIATION |
| `planning/STATE.md` | Yes | Current handoff drafted | Must be inspected by independent review | UNVERIFIED REMEDIATION |
| `src/html.js` authority correction | Yes | Comment-only correction at historical assessment | Matches `AGENTS.md` and ADR-0002 direct-maintenance declaration | HISTORICALLY VERIFIED |

## Historical Reproducible Evidence

These commands and outputs were captured for `294aab8`; they are historical and
must not be presented as checks of the current remediation head:

```text
$ python3 scripts/adr-governance.py
ADR governance passed (8 ADR file(s) checked).

$ GITHUB_BASE_REF=main python3 scripts/adr-governance.py
ADR governance passed (8 ADR file(s) checked).

$ git diff --check origin/main...HEAD
# no output; exit 0

$ git diff --name-only b76399da7cb3cd3c1626934b60352c629b0723c9..294aab803d3759c9005a409cb99110afe1246756
docs/adr/ADR-0005-expose-only-canonical-explicitly-public-routes.md
docs/adr/ADR-0008-serve-tracked-static-files-through-workers-assets.md
planning/STATE.md
planning/phases/01-adr-foundation/01-01-PLAN.md
planning/phases/02-contract-conformance/02-01-PLAN.md

$ git rev-list --left-right --count origin/feat/adopt-adr-standard...294aab803d3759c9005a409cb99110afe1246756
0       3

$ git diff --numstat origin/main...294aab803d3759c9005a409cb99110afe1246756 -- src/html.js
0       4       src/html.js
```

Historical pinned-source byte/mode comparison:

```text
docs/adr/README.md                    100644 6eea809622a5d77caa4cd92b3512e44eb24bfc6c
docs/adr/TEMPLATE.md                  100644 cc6600b7041a4aad820758fc7ce0af91b39b5b4d
docs/adr/TOOLING.md                   100644 b725dad8cd587c2ff2496235605c0c1d3b5b1c90
scripts/adr-governance.py             100755 9cdff018358bd48aba8fb76dade22c9ecd15033c
.github/workflows/adr-governance.yml  100644 bf45275950be5302da73dd96c98a1f612cdaecb6
docs/adr/LICENSE-MIT                  100644 155356c82dc740d32840d5b3ec337dded2b4e68c
docs/adr/LICENSE-APACHE               100644 ceb6118c8c3e5ebd5e720b503bcccc4058769b9a
docs/adr/NOTICE                       100644 d0e1091053fbaab4e3d6dc498c20833538d54a55
```

Later historical GitHub evidence:

```text
Draft PR: https://github.com/JimCollinson/x0xmd/pull/4
Exact historical remote/PR head: a2d44bc
Historical ADR CI: run 31115279538 passed after a GitHub runner-setup rerun;
the checked synthetic merge tree matched a2d44bc.
```

## Current Divergence and Required Gates

- Cloudflare Workers Assets currently receives matching packaged paths before the Worker because `run_worker_first` is absent from `wrangler.toml`. The effective route can therefore bypass `src/index.js`, expose a packaged file outside an approved namespace, or shadow Worker root/route/alias/document/404 policy. This HIGH invalidated the prior route-model readiness result.
- Jim selected Worker-first bounded static namespaces as the intended durable architecture. The current configuration remains divergent; this documentation-only remediation does not change or test it.
- Structural ADR CI passed historically at exact remote/PR head `a2d44bc`. That run predates the local checkpoint `fc4ad4d` and this remediation and is not exact-current-head evidence.
- The branch has a local unpushed state-checkpoint commit beginning at `fc4ad4d`; the documentation remediation is also local and unpushed. Draft PR #4 and its description have not been changed by this work.
- Fresh independent code review must run first. If it passes, fresh goal verification must replace this superseded record with an exact assessed commit and evidence.
- After separately authorised push and PR-description refresh, exact-head ADR Governance CI must pass. Fresh adversarial review, Craft Review, and clean-context review must then run in that order before Jim's attended checkpoint.
- The default local governance invocation's `HEAD^1` selection and the inherited gate's documented fail-open, discovery, parsing, history, and self-modification limits remain. `GITHUB_BASE_REF=main` is required for the meaningful full branch-diff structural check.
- No general code-quality CI arbiter exists; `.github/workflows/deploy.yml` is deployment, not validation. No Cloudflare deployment or live endpoint audit has been performed or inferred.
- This record does not verify its own remediation, accept any ADR, approve Plan 02-01, authorise implementation or mechanism changes, satisfy any pending review lane, or mark Plan 01-01 Done.

## Handoff to Independent Verifier

Do not carry forward the 9/9 score. After independent code review, reassess the
Phase 01 goal against the exact committed remediation head, rerun all source,
status, scope, name, link, slice-count, and governance checks, and replace the
current `UNVERIFIED REMEDIATION` entries with evidence-backed findings. Preserve
the historical evidence above as historical. The required gate sequence is:
independent code review → goal verification → authorised push/PR-description
refresh → exact-head CI → adversarial review → Craft Review → clean-context
review.

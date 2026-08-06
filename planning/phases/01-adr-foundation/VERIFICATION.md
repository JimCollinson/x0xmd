# Phase 01 ADR Foundation Verification

Date: 2026-08-06

## Result

- **Verification:** passed
- **Assessed implementation target:** `feat/adopt-adr-standard@bcf65eedc9b266387d228f39e3214e3cc92b23df`
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Score:** 8/8 expanded ADR-foundation goals verified
- **Goal boundary:** Phase 01 installs faithful ADR governance and leaves eight substantive, reviewable Proposed decisions describing intended durable architecture. Runtime conformance with the Worker-first decision is deliberately not a Phase 01 success condition.
- **Current runtime boundary:** `wrangler.toml` does not set `assets.run_worker_first`; effective matching-asset routing is therefore asset-first and divergent from Proposed ADR-0005/0008. Proposed Plan 02 Slice G, not this phase, owns future conformance after its distinct approvals.
- **External-gate boundary:** The preceding independent code review passed with no findings. This goal verification passes the documentation foundation only. Exact-current-head structural CI, fresh adversarial review, Craft Review, clean-context review, and Jim's attended checkpoint remain pending. No ADR is Accepted and Plan 02-01 remains Proposed and unapproved.

## Goal-backward Findings

### 1. Canonical pinned ADR kit fidelity and wiring — VERIFIED

The source pin is real and eligible: GitHub identifies `WithAutonomi/adr-standard@0b36be07b4730c158eaed3655b551318c81352bf` as the founding merge, and comparison with current canonical `main@ef3f52b48e12773a4ba081cd67a010d852e74a11` shows the pin as its merge base, seven commits behind and zero ahead.

The source tree and target tree agree for all eight direct-install destinations. Seven files are mode `100644`; `scripts/adr-governance.py` is `100755`:

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

`AGENTS.md` correctly merges rather than copies the kit fragment. It preserves inspect-before-change, Proposed drafting, immutable Accepted records, human-only acceptance, and substantive review while adding repository-specific authority, artifact boundaries, and honest CI scope. The workflow watches the canonical ADR/script/workflow paths, fetches full history, and invokes the installed executable gate. Neither the eight direct destinations nor `AGENTS.md` changed after installation commit `7de2275e5576ac7d2f5cac30b2a455290119766f`.

Both requested governance invocations passed and discovered eight ADRs. The default invocation selects `HEAD^1`; because the target's final commit changes only planning records, its “8 checked” output is discovery, not proof that eight changed ADRs received full validation. `GITHUB_BASE_REF=main` is the meaningful full branch-diff structural pass and did validate all eight. The inherited gate's documented fail-open, discovery, parsing, history, and self-modification limitations remain honestly stated.

### 2. Eight substantive Proposed ADRs and clean artifact boundaries — VERIFIED

ADR-0001 through ADR-0008 exist at 65–86 lines each. Every record is `Proposed`, uses all template sections plus decision drivers and considered options, presents real alternatives and trade-offs, and supplies concrete validation. No TODO, FIXME, template placeholder, stub, Accepted, Superseded, Deprecated, or Rejected record was found.

The records state durable decisions and invariants. They do not sequence implementation work or turn current implementation defects into ADR acceptance criteria. Concrete schemas and failure/cache contracts are left to future specs; divergence and sequencing are kept in state and Proposed Plan 02-01. All eight are referenced through repository guidance, state, the future plan, or relevant ADR cross-links, so they are substantive and wired rather than orphaned.

### 3. ADR-0005/0008 encode Worker-first, no-shadowing intent — VERIFIED

ADR-0005 gives Worker routing policy the first decision on every public request, defines four governed exposure classes, permits `ASSETS` delegation only after classification into `/fonts/*` or `/assets/*`, treats `public/` as packaging input rather than a route allowlist, and forbids file presence from creating or shadowing root, exact, alias/redirect, document, or unknown routes.

ADR-0008 separately governs reviewed deployable files and the subordinate Assets delivery mechanism. It rejects asset-first public-tree authority, requires files outside approved namespaces to remain unreachable, and requires Cloudflare-level matchable controls because direct `worker.fetch` tests cannot prove platform ordering.

Both are phrased as intended durable architecture with alternatives, consequences, and validation obligations. Neither mentions the absent current setting or claims current runtime conformance. This is the intended ADR/bug-report boundary.

### 4. Current asset-first divergence is honestly separated — VERIFIED

The implementation evidence matches the recorded divergence: `wrangler.toml` configures `directory = "./public"` and `binding = "ASSETS"` but no `run_worker_first`; `src/index.js` delegates only `/fonts/*` and `/assets/*` when the Worker is invoked. Cloudflare's Worker-script documentation states that matching static assets are served before the Worker by default and that `run_worker_first = true` is required to run the Worker before every request.

`planning/STATE.md`, this verification, and Proposed Plan 02-01 all preserve that effective asset-first behaviour as an implementation/configuration divergence. The ADRs preserve Jim's intended architecture instead. No runtime fix or runtime-conformance claim was smuggled into Phase 01.

### 5. Proposed Plan 02 contains seven bounded slices and a correctly gated Slice G — VERIFIED

The plan is explicitly `Proposed; not approved for implementation` and contains exactly seven slices, A through G. Slices A–F retain bounded cache, rendering, trust-contract, release-coherence, local-claim-authority, and production-configuration work.

Slice G separately requires:

- human review and acceptance of ADR-0005/0008;
- Plan/Slice G implementation approval;
- distinct explicit approval for the Wrangler routing-precedence mechanism change;
- distinct explicit approval for the Cloudflare integration harness, fixtures, and command, with neither mechanism approval implying the other;
- `run_worker_first = true` without unrelated Worker route or namespace changes;
- Cloudflare/Wrangler-path tests rather than direct Worker invocation alone;
- positive, matchable asset controls for approved delivery and root, exact-route, alias, curated-document, unknown, and non-approved-namespace collision resistance; and
- stops for absent approvals, an integration path unable to distinguish platform precedence, route/response/namespace expansion, or any unapproved runtime, harness, CI, workflow, build, deployment, dependency, or environment change.

That is a bounded future conformance slice, not present implementation authority.

### 6. Worker-first remediation changed exactly the six authorised documents — VERIFIED

The committed remediation range `fc4ad4dee009c4ab1b7d5870d8d83f1b6fd9c309..bcf65eedc9b266387d228f39e3214e3cc92b23df` changes exactly:

```text
docs/adr/ADR-0005-expose-only-canonical-explicitly-public-routes.md
docs/adr/ADR-0008-serve-tracked-static-files-through-workers-assets.md
planning/STATE.md
planning/phases/01-adr-foundation/01-01-PLAN.md
planning/phases/01-adr-foundation/VERIFICATION.md
planning/phases/02-contract-conformance/02-01-PLAN.md
```

It changes no Worker/frontend/runtime source, `public/` asset, Wrangler/configuration file, test or harness, workflow, governance script, dependency/lockfile, build, deployment, `.gsd`, or environment setup. `git diff --check` passed for both the full branch and remediation range. Pre-existing `.artifacts/` and `.claude/` remain untracked; neither has tracked paths.

### 7. State, review, and CI claims are honest — VERIFIED

At the assessed target, `planning/STATE.md` accurately recorded the then-pending fresh code review and goal verification. The work packet subsequently supplied the independent code-review result: passed at `bcf65ee` with no findings. No standalone current review transcript is tracked, so this verification records the supplied gate result without inventing additional evidence; its own full diff inspection found no goal gap.

GitHub confirms draft PR #4 remains open at remote head `a2d44bc8bd23ddce33d15a2a1e70bffc21d65b66`. ADR Governance run `31115279538` succeeded for that historical head. At assessment, local `bcf65ee` was three commits ahead of the remote and unpushed. The historical run is not exact-target CI and is not general code-quality evidence. This repository has no general code-quality CI arbiter; `deploy.yml` is a deployment workflow, not validation.

This verification completes only the goal-verification gate. Exact-current-head structural CI, fresh adversarial review, Craft Review, and clean-context review remain pending, followed by Jim's attended checkpoint. Plan 01-01 remains in progress; no later gate is inferred from this pass.

### 8. Original source, legal, status, scope, link, and frontend-authority goals remain intact — VERIFIED

- The direct kit bytes/modes and merged guidance remain unchanged, `.adr-kit.yaml` remains absent, consumer-root legal files remain untouched, and the kit-scoped MIT/Apache licences and NOTICE retain exact source blobs.
- Every ADR remains Proposed, and Plan 02 remains Proposed and unapproved.
- The complete branch diff changes the originally approved governance/docs/planning surface plus only the authorised `src/html.js` source-notice correction. The Worker-first remediation is the narrower six-document range verified above.
- Eight relative Markdown links across the ADRs and plans resolved with zero broken targets. All eight cited x0xmd commits exist; PR links #1–#4 resolve; and the pinned founding commit and bootstrap-spec link resolve in the canonical source repository.
- `src/html.js` differs from `origin/main` by four deleted comment/blank lines and no additions. Removing exactly the stale generated-source notice from the base produces the target file byte-for-byte (SHA-256 `27863f107039d0257fa69b86992170179eadbd6f56f323afa1fbe2c3c3370100`). `AGENTS.md` and ADR-0002 consistently identify it as directly maintained authoritative frontend source.

## Artifact and Wiring Status

| Artifact/link | Exists | Substantive | Wired | Status |
| --- | --- | --- | --- | --- |
| Eight direct consumer-kit destinations | Yes | Exact pinned bytes and required modes | Canonical paths; gate invoked by workflow and guidance | VERIFIED |
| `AGENTS.md` | Yes | Repository authority, ADR rules, artifact/CI boundaries | Directs architectural work to ADR records, template, tooling, and gate | VERIFIED |
| ADR-0001 through ADR-0008 | Yes | 65–86 lines; real options, consequences, validation | Cross-linked from guidance/state/plan and one another where relevant | VERIFIED |
| ADR-0005 route decision | Yes | Worker-first four-class exposure and no-shadowing invariant | Governs ADR-0008 and future Slice G | VERIFIED |
| ADR-0008 asset decision | Yes | Subordinate tracked-asset mechanism and platform-level validation | Cross-linked to ADR-0002/0005 and future Slice G | VERIFIED |
| Proposed Plan 02-01 | Yes | Seven bounded future slices | Explicit prerequisites, approvals, stops, and review gates; unapproved | VERIFIED (not approved) |
| `planning/STATE.md` | Yes | Records intended architecture, current divergence, and historical/pending gates | Connects phase, ADRs, plan, PR/CI history, and next sequence | VERIFIED at target, with code-review completion superseded here |
| `src/html.js` authority correction | Yes | Comment-only; maintained bytes unchanged | Matches `AGENTS.md` and ADR-0002 authority declarations | VERIFIED |
| Worker-first runtime conformance | No | `run_worker_first` remains absent by design for this phase | Parked behind Proposed Slice G and separate mechanism approvals | OUT OF PHASE GOAL / PENDING |

## Reproducible Evidence

Commands were run from `/Users/jimcollinson/code/x0xmd` with implementation target `bcf65eedc9b266387d228f39e3214e3cc92b23df` checked out:

```text
$ python3 scripts/adr-governance.py
ADR governance passed (8 ADR file(s) checked).

$ GITHUB_BASE_REF=main python3 scripts/adr-governance.py
ADR governance passed (8 ADR file(s) checked).

$ git diff --check origin/main...bcf65eedc9b266387d228f39e3214e3cc92b23df
# no output; exit 0

$ git diff --check fc4ad4dee009c4ab1b7d5870d8d83f1b6fd9c309..bcf65eedc9b266387d228f39e3214e3cc92b23df
# no output; exit 0

$ git rev-list --left-right --count origin/feat/adopt-adr-standard...bcf65eedc9b266387d228f39e3214e3cc92b23df
0       3

$ git status --short --branch
## feat/adopt-adr-standard...origin/feat/adopt-adr-standard [ahead 3]
?? .artifacts/
?? .claude/

$ structural/content checks
ADR_COUNT=8
STATUSES=Proposed,Proposed,Proposed,Proposed,Proposed,Proposed,Proposed,Proposed
SLICE_COUNT=7; SLICES=A,B,C,D,E,F,G
LOCAL_LINKS_CHECKED=8; BROKEN_LOCAL_LINKS=0
CITED_LOCAL_COMMITS=8/8
```

GitHub read-only evidence:

```text
Canonical pin: 0b36be07b4730c158eaed3655b551318c81352bf
Current source main: ef3f52b48e12773a4ba081cd67a010d852e74a11
Comparison: source main ahead by 7, behind by 0, merge base is the pin
Draft PR: https://github.com/JimCollinson/x0xmd/pull/4
Remote PR head: a2d44bc8bd23ddce33d15a2a1e70bffc21d65b66
Historical structural CI: https://github.com/JimCollinson/x0xmd/actions/runs/31115279538 — success
```

## Historical Evidence Preserved

- Earlier expanded verification reported 9/9 at `294aab803d3759c9005a409cb99110afe1246756`. A later adversarial review showed that it had matched direct Worker classification while missing Cloudflare's effective asset-first precedence. That score remains superseded and is not reused here.
- The historical structural CI at `a2d44bc` remains valid only for that remote/PR head. It does not cover the local Worker-first documentation remediation or this verification record.
- The remediation did not resolve or test runtime precedence. This pass verifies that Phase 01 now records the intended architecture and separates the known divergence honestly; it does not revive the superseded runtime-conformance finding.

## Pending Gates and Recommendation

**No foundation-goal gaps found.** Treat the expanded Phase 01 ADR-foundation goal as achieved at `bcf65eedc9b266387d228f39e3214e3cc92b23df`, while keeping Phase 01 in progress for its external gauntlet and attended checkpoint.

Next, only through separately authorised actions: push the remediation and verification record, refresh the draft PR description, obtain exact-current-head ADR Governance CI, run fresh adversarial review, Craft Review, and clean-context review, then return to Jim. Keep Proposed Plan 02-01 parked. Do not implement Slice G, alter Wrangler or the integration harness, accept an ADR, merge, publish, or deploy on the strength of this foundation verification.

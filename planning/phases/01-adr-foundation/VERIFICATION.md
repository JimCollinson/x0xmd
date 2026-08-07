# Phase 01 ADR Foundation Verification

Date: 2026-08-07

## Current Independent Result

- **Verification:** passed
- **Assessed implementation target:** `feat/adopt-adr-standard@801275b5ee64e34f48cb584c8bc864c3c50f5281`
- **Base:** local `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Score:** 10/10 current owner-specified goals verified
- **Preceding review:** the supplied independent code/ADR review passed at the same implementation target with no findings. No standalone transcript is tracked, so that result is process evidence rather than a repository-reproducible check.
- **Goal boundary:** Phase 01's goal is a faithful, legally attributed ADR-governance foundation with nine substantive Proposed records and an honestly bounded future plan. It does not establish runtime conformance with every Proposed ADR, approve Plan 02, accept any ADR, or authorise implementation or operations.
- **Current-scope boundary:** ADR-0009's statement that the canonical GitHub-`main` installer proxy conforms is verified only for the stable-entrypoint and authority decision. Other disclosed runtime divergences remain Plan 02 inputs; this result does not convert them into Phase 01 failures or claim they are fixed.
- **External-gate boundary:** the local target is unpushed. Draft PR #4 and its successful structural CI remain at historical remote head `52ecb10dca1b2478a010f641509ab90f97daf385`, not this target. Current-scope adversarial review, Craft Review, clean-context review, exact-pushed-head structural CI, and Jim's attended checkpoint remain pending.

## Goal-backward Findings

### 1. Original pinned ADR kit fidelity, wiring, legal, and status goals remain — VERIFIED

The canonical source pin remains real and eligible. GitHub's tree for
`WithAutonomi/adr-standard@0b36be07b4730c158eaed3655b551318c81352bf`
and the installed destinations have identical blobs and required modes:

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

The source repository's current `main` is nine commits ahead and zero behind the
pin, with the pin as merge base. The pin is therefore still in canonical history
without silently moving the adopted baseline.

The eight direct destinations and repository-specific `AGENTS.md` are unchanged
from installation commit `7de2275e5576ac7d2f5cac30b2a455290119766f`.
`AGENTS.md` merges the source guidance with x0xmd-specific authority, artifact,
deployment, and CI boundaries. It wires architectural work to `docs/adr/`, the
template, tooling, and governance command. The workflow watches the canonical
ADR, script, and workflow paths, fetches full history, and invokes the installed
gate. The kit-scoped dual licences and NOTICE retain exact source blobs; no
consumer-root legal file or `.adr-kit.yaml` was added.

Both governance modes passed and discovered nine ADRs. The default mode selected
`HEAD^1`; because the final implementation commit changed planning documents but
no ADR, its count is discovery output rather than full validation of all nine.
`GITHUB_BASE_REF=main` compared the branch against `origin/main` and is the
meaningful full structural pass. The inherited gate's documented fail-open,
discovery, history, parsing, and self-modification limits remain disclosed.

### 2. Nine ADRs are substantive Proposed records with clean boundaries — VERIFIED

ADR-0001 through ADR-0009 exist and are 66, 67, 75, 72, 86, 73, 66, 78, and 92
lines respectively. All nine are `Proposed`. Every record has Context, Decision
Drivers, Considered Options, Decision, Consequences, Validation, and AI-assistance
sections. No TODO, FIXME, template token, placeholder decision, Accepted,
Superseded, Deprecated, or Rejected record was found.

The ADRs state durable decisions, alternatives, consequences, and validation
obligations. Concrete schemas, cache/failure contracts, implementation sequence,
and mechanism approvals remain in future specs and the Proposed plan rather than
being smuggled into ADR acceptance. Repository guidance, state, Plan 02, and ADR
cross-links connect the records to the system; none is a stub or orphan.

### 3. ADR-0009 captures the owner's current rationale without overengineering or false conformance — VERIFIED

ADR-0009 substantively records all current owner decisions:

- `x0x.md` is the canonical stable public origin;
- the exact canonical ergonomic command is `curl -sfL https://x0x.md | sh`;
- one origin adapts for human, CLI/agent, and machine-readable consumers;
- the stable origin is distinct from product, source, installer, release, and product-name authority;
- the current canonical GitHub-`main` proxy is sufficient and its GitHub availability dependence is an accepted trade-off;
- stable public URLs preserve backend replaceability without requiring a backend change now;
- intended Autonomi Foundation stewardship is stated without asserting registrar ownership, legal custody, or completed transfer;
- `x0x.sh` is reserved optionality with no redirect, route, failover, uptime, or compatibility contract; and
- future independent hosting or failover is only a reconsideration trigger after demonstrated need, a new architectural decision, a bounded spec, and a separately approved plan.

The record explicitly excludes current independent retention/storage, automated
ingestion or attestation, freshness ledgers, outage guarantees, plural advertised
delivery, signed-skill changes, provenance-based host choice, and client-selection
machinery. It also records curl-pipe-shell risk and inspect/verify alternatives.

Its conformance statement is narrow and supportable: the tracked installer path
matches the stable-origin and canonical-authority decision. ADR-0009 does not
claim that current cache, trust-schema, release-coherence, rendering, production-
override, or Worker-first behaviour already conforms to the other Proposed ADRs.

### 4. ADR-0002, ADR-0003, ADR-0004, and ADR-0006 remain coherent and canonical-upstream authority is preserved — VERIFIED

- ADR-0002 gives x0xmd serving, presentation, static-asset, and Cloudflare responsibility while leaving product, protocol, docs, installer, and signed-release truth with `saorsa-labs/x0x`. A future delivery mechanism remains serving infrastructure, not new authority.
- ADR-0003 permits only `saorsa-labs/x0x` as production upstream, keeps docs and installer on upstream `main`, and keeps signed artefacts associated with one stable release. Its conditional future-delivery sentence neither requires another mechanism nor permits another authority.
- ADR-0004 governs the dual browser/CLI root, deterministic `/install.sh`, cache-safety obligation, and exact canonical command while delegating stable-origin identity to ADR-0009.
- ADR-0006 governs evidenced `/trust.json` provenance. It distinguishes x0xmd entrypoints from upstream sources and does not require x0xmd to discover, verify, enumerate, retain, or serve paths independently offered by clients or skills.

The four records cross-link coherently with ADR-0009 and Plan 02. No fork,
staging source, retained copy, x0xmd-created installer truth, or alternate product
authority is introduced.

### 5. Proposed Plan 02 is exactly seven unapproved slices A–G — VERIFIED

`planning/phases/02-contract-conformance/02-01-PLAN.md` is headed
`Status: Proposed; not approved for implementation.` Automated heading inspection
found exactly seven slices: A, B, C, D, E, F, and G. There is no Slice H heading.

The independent-hosting/failover text is under `Future Consideration`, after the
seven slices. It says explicitly that the idea is not a slice, requirement, or
predesigned solution and can be reconsidered only after demonstrated availability
problems and new decision/spec/plan gates. It is therefore optionality, not a
commitment or hidden eighth slice.

### 6. Historical eight-ADR and withdrawn nine/eight evidence is preserved honestly — VERIFIED

Plan 01, `planning/STATE.md`, `CHECKPOINT.md`, and this record distinguish three
different scopes instead of extending old results by inference:

1. the completed historical eight-ADR/seven-slice foundation;
2. the later nine-ADR/eight-slice draft with independent-retention Slice H; and
3. the current corrected nine-ADR/seven-slice target.

The historical evidence retains the old targets, review findings, structural-CI
limits, and withdrawn last-verification gap. It states that the retained-installer
freshness finding was valid against the withdrawn draft but is not a current
blocker. No eight-ADR pass or nine/eight draft review is presented as proof of the
current scope.

### 7. Current source matches the accepted GitHub-backed delivery trade-off — VERIFIED

`src/index.js` and `wrangler.toml` both identify `saorsa-labs/x0x`. Their default
and configured installer URL is exactly
`https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.sh`.
CLI-like `/` requests and `/install.sh` call `installerResponse`, which proxies the
configured canonical URL. An executable mock-fetch smoke check confirmed that a
CLI root request fetched that exact URL and returned installer bytes; the browser
root returned HTML containing the exact canonical command.

No independent retention primitive or new source was added. This verifies tracked
source and configuration, not actual deployed Cloudflare variable custody; the
latter remains a separately gated Plan 02 Slice F audit.

### 8. Reopening and correction scopes are exact; no mechanism changed — VERIFIED

The cumulative reopening range
`52ecb10dca1b2478a010f641509ab90f97daf385..801275b5ee64e34f48cb584c8bc864c3c50f5281`
changes exactly the authorised ten files: ADR-0002, ADR-0003, ADR-0004, ADR-0006,
new ADR-0009, Plan 01, Proposed Plan 02, STATE, VERIFICATION, and CHECKPOINT.

The correction range
`b55eb2b49e2c66a16d9358d75818d11a46d325d0..801275b5ee64e34f48cb584c8bc864c3c50f5281`
changes exactly the authorised nine files: ADR-0002, ADR-0003, ADR-0006,
ADR-0009, Plan 01, Proposed Plan 02, STATE, VERIFICATION, and CHECKPOINT. ADR-0004
is absent from the correction range, as required.

Both ranges contain only Markdown documents. They change no runtime, Wrangler or
other configuration, storage, asset, skill, test/harness, workflow, governance
script, dependency/lockfile, build, deployment, environment, domain/DNS, custody,
secret, or spend mechanism. Full-branch, reopening-range, and correction-range
`git diff --check` all passed.

The complete branch still contains the originally authorised ADR kit/workflow and
only one source change: four deleted stale generated-source notice lines at the
start of `src/html.js`. `src/index.js`, `wrangler.toml`, and `deploy.yml` are
unchanged from `origin/main`.

### 9. Naming rationale and Foundation custody statements are honest — VERIFIED

ADR-0009 frames `x0x.md` as short and distinctive only within the known ecosystem,
not universally unique. It records exact-text and agent-first usefulness, the
natural `.md` association, and suitability for Foundation stewardship. It does
not claim pronounceability; it records `0`/`O` and “tic-tac-toe” ambiguity as
negatives. Product-name authority remains upstream.

The Foundation statement is explicitly intended future stewardship. Current
registrar ownership, legal custody, and completed transfer are not asserted, and
unevidenced custody is not mislabeled as a current conformance gap. This is a
bounded rationale and stewardship intent, not fabricated operational evidence.

### 10. Review and CI limitations are accurate — VERIFIED

Before this verification record, local HEAD `801275b` was nine commits ahead of
`origin/feat/adopt-adr-standard`; `.artifacts/` and `.claude/` remained untracked.
GitHub confirms draft PR #4 is open and its remote head is
`52ecb10dca1b2478a010f641509ab90f97daf385`. ADR Governance run `31120406392`
succeeded for that historical head. It is not CI for `801275b` or for the commit
containing this verification record.

The installed workflow is a structural ADR arbiter only. No general code-quality
CI arbiter exists, and `.github/workflows/deploy.yml` is deployment rather than
validation. Local checks are evidence, not CI. The current code/ADR review pass is
a supplied gate result without a tracked transcript. This independent verification
completes only the goal-verification lane.

## Artifact and Wiring Status

| Artifact/link | Exists | Substantive | Wired | Status |
| --- | --- | --- | --- | --- |
| Eight direct consumer-kit destinations | Yes | Exact pinned blobs and modes | Canonical paths; workflow and guidance invoke gate | VERIFIED |
| `AGENTS.md` | Yes | Repository authority, ADR, artifact, deployment, and CI boundaries | Directs architectural work to ADR records/template/tooling | VERIFIED |
| ADR-0001 through ADR-0009 | Yes | 66–92 lines; full sections, options, consequences, validation | State, plan, guidance, and relevant ADR cross-links | VERIFIED |
| ADR-0009 stable-entrypoint decision | Yes | Full rationale, trade-offs, authority and non-goals | Cross-linked from ADR-0002/3/4/6 and Plan 02 | VERIFIED |
| Proposed Plan 02-01 | Yes | Exactly seven bounded slices A–G | Prerequisites, mechanism gates, reviews, and stops; unapproved | VERIFIED (not approved) |
| Current installer proxy path | Yes | Canonical GitHub `main` source in Worker and Wrangler | Root and `/install.sh` call the proxy path | VERIFIED for tracked source |
| Historical handoff evidence | Yes | Targets, findings, CI limits, and withdrawn scope retained | Clearly segregated from current result | VERIFIED |
| Runtime conformance to all Proposed ADRs | No/partial by disclosed design | Plan 02 records known gaps and audits | Parked behind human acceptance and separate approvals | OUT OF PHASE 01 GOAL |

## Reproducible Evidence

Commands were run from `/Users/jimcollinson/code/x0xmd` with implementation target
`801275b5ee64e34f48cb584c8bc864c3c50f5281` checked out.

```text
$ python3 scripts/adr-governance.py
ADR governance passed (9 ADR file(s) checked).

$ GITHUB_BASE_REF=main python3 scripts/adr-governance.py
ADR governance passed (9 ADR file(s) checked).

$ git diff --check origin/main...HEAD
# no output; exit 0

$ git diff --check 52ecb10dca1b2478a010f641509ab90f97daf385..HEAD
# no output; exit 0

$ git diff --check b55eb2b49e2c66a16d9358d75818d11a46d325d0..HEAD
# no output; exit 0

$ structural/content checks
ADR_COUNT=9
STATUSES=Proposed,Proposed,Proposed,Proposed,Proposed,Proposed,Proposed,Proposed,Proposed
ADR_LINES=66,67,75,72,86,73,66,78,92
MISSING_SECTIONS=[]
PLACEHOLDERS=[]
SLICE_COUNT=7; SLICES=A,B,C,D,E,F,G
SLICE_H_HEADING=False
FUTURE_CONSIDERATION_NON_BINDING=True
LOCAL_LINKS_CHECKED=20; BROKEN_LOCAL_LINKS=0
CITED_LOCAL_COMMITS=8; MISSING_CITED_LOCAL_COMMITS=0
REOPENED_FILES=10; REOPENED_EXACT_SCOPE=True
CORRECTION_FILES=9; CORRECTION_EXACT_SCOPE=True
```

Read-only GitHub evidence:

```text
Canonical pin: 0b36be07b4730c158eaed3655b551318c81352bf
Source main comparison: ahead 9, behind 0, merge base is the pin
Draft PR: https://github.com/JimCollinson/x0xmd/pull/4
Remote PR head: 52ecb10dca1b2478a010f641509ab90f97daf385
Historical structural CI: https://github.com/JimCollinson/x0xmd/actions/runs/31120406392 — success at 52ecb10
```

Several ad hoc Python probe one-liners initially had verifier quoting/scoping
errors. Corrected probes produced the results above; no repository test or gate
failed, and no test, harness, workflow, build, or environment was changed.

## Clearly Historical Evidence — Not Current Readiness Proof

### Original and eight-ADR foundation

- Original seven-ADR bootstrap verification passed 7/7 at its historical target.
- An expanded result reported 9/9 at `294aab803d3759c9005a409cb99110afe1246756`; later adversarial review found that it had missed Cloudflare asset-first precedence. That score is superseded and is not reused.
- Worker-first documentation remediation was independently goal-verified 8/8 at `bcf65eedc9b266387d228f39e3214e3cc92b23df`, with its record committed at `c4666cd`. Code/ADR review passed there with no findings.
- The eight-ADR/seven-slice branch later reached reviewed PR head `406a56d37d606fe29f8bdeafb8b289395b6a652c`; structural run `31118541443` passed, adversarial review returned READY-WITH-NITS with no CRITICAL/HIGH/MEDIUM findings, Craft Review passed, and the clean-context report recorded non-blocking concerns.
- Historical checkpoint head `52ecb10` received successful structural run `31120406392`. None of these eight-ADR results covers ADR-0009.

### Withdrawn nine-ADR/eight-slice draft

- The reopening from `52ecb10` initially added ADR-0009 plus Slice H for independent retained delivery. Review at and after `a494c70` found mutable-`main` identity/freshness, prerequisite sequencing, `x0x.sh`, evidence-matching, and verification-time freshness problems.
- The last goal-verification gap was recorded at `b55eb2b`: fetch time could not substitute for verification time in the retained-installer freshness ledger.
- Jim withdrew that distribution design instead of adding machinery to repair it. The finding remains valid against the withdrawn draft but is not a defect in the current direct-proxy decision.
- All nine-ADR/eight-slice review and remediation evidence is superseded draft history. It proves neither current readiness nor a requirement for Slice H.

## Pending Gates and Recommendation

**No current Phase 01 documentation-goal gaps were found.** Treat the corrected
nine-ADR/seven-slice ADR-foundation goal as achieved at
`801275b5ee64e34f48cb584c8bc864c3c50f5281`.

Proceed only to the remaining external gates under separate authority: push the
implementation and verification record if authorised, obtain structural ADR CI
for that exact pushed head, run fresh adversarial, Craft, and clean-context review
against the corrected scope, then return to Jim's attended checkpoint.

Keep all nine ADRs Proposed and Plan 02 unapproved. Do not infer runtime
conformance, accept an ADR, approve or implement slices A–G, modify PR #4, merge,
publish, deploy, change domain custody, or add independent delivery machinery from
this verification.

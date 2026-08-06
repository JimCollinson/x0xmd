# Phase 01 ADR Foundation Verification

Date: 2026-08-06

## Result

- **Verification:** passed
- **Assessed target:** `feat/adopt-adr-standard@294aab803d3759c9005a409cb99110afe1246756`
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Score:** 9/9 expanded foundation goals verified
- **Foundation boundary:** The expanded ADR-foundation deliverable exists, is substantive, is wired, and preserves the original bootstrap fidelity and runtime boundary.
- **External-gate boundary:** Phase 01 is still in progress, not merge-ready or fully green. Draft PR #4 exists, but its remote head is the pre-remediation commit `b76399da7cb3cd3c1626934b60352c629b0723c9`. The assessed local target was three commits ahead and unpushed. Exact-current-branch-head ADR CI plus fresh adversarial, Craft, and clean-context gates remain pending, as does Jim's attended checkpoint. No ADR or Plan 02-01 approval is implied.

## Goal-backward findings

1. **Canonical ADR-standard installation remains faithful — VERIFIED.** A fresh checkout of `WithAutonomi/adr-standard@0b36be07b4730c158eaed3655b551318c81352bf` reproduced all eight direct consumer destinations byte-for-byte and at the required modes: seven `100644` files and `scripts/adr-governance.py` at `100755`. The pinned commit is still canonical `refs/heads/main`. The direct kit and `AGENTS.md` have not changed since installation commit `7de2275e5576ac7d2f5cac30b2a455290119766f`.
2. **Governance and repository guidance are substantive and wired — VERIFIED locally.** `AGENTS.md` preserves the source guidance's inspect-before-change, Proposed-draft, immutable-Accepted, human-only acceptance, and substantive-review rules while adding x0xmd authority and artifact boundaries. The copied workflow watches the documented ADR/script/workflow paths, fetches full history, and invokes the copied executable gate. Both required local governance modes passed with eight discovered ADRs.
3. **Eight reviewable retrospective records exist — VERIFIED.** ADR-0001 through ADR-0008 are 65–77 lines, all use `Status: Proposed`, contain the required template sections plus decision drivers and 3–4 considered alternatives, and contain concrete consequences and validation. No Accepted, Superseded, Deprecated, or Rejected ADR exists. The records are linked from repository guidance, state, one another where relevant, and Proposed Plan 02-01.
4. **The authority and contract records remain separated from conformance work — VERIFIED.** ADR-0002/0003/0004/0006/0007 state intended durable serving, upstream, negotiated-root, provenance, and rendering invariants. Known implementation gaps remain in `planning/STATE.md` and Proposed Plan 02-01 rather than being disguised as ADR implementation tasks or treated as resolved.
5. **ADR-0005 now models the complete route-exposure architecture — VERIFIED.** Its four classes match `src/index.js`: the special negotiated `/`; 13 explicit canonical-map entries, including `/agent.json`, `/skill`, and public-key casing aliases; 25 curated `PUBLIC_DOCS` entries; and case-sensitive delegation of `/fonts/*` and `/assets/*` to `env.ASSETS.fetch`. It records HTTP 308 canonicalization where a canonical definition applies, local 404 for unknown routes outside the classes, Assets not-found semantics inside the bounded namespaces, and no arbitrary upstream proxy. It correctly governs a model rather than freezing the current route/file inventory.
6. **ADR-0008 accurately records tracked Workers Assets serving — VERIFIED.** It matches `wrangler.toml` (`directory = "./public"`, `binding = "ASSETS"`), the Worker's bounded namespace delegation, and tracked files under `public/fonts/`. It distinguishes packaging/serving mechanism from ADR-0005's exposure model and expressly avoids claiming that every frontend dependency is self-hosted or that filenames are frozen. Statements about content type, cache behaviour, and missing-file behaviour are framed as mechanism capabilities, consequences, and validation obligations—not as unproved exact response guarantees.
7. **Proposed Plan 02-01 closes the prior planning-coverage gaps — VERIFIED.** The plan has exactly six bounded future slices. Slice E covers local index/presentation product-claim source mapping and drift; Slice F covers production configuration, deployed Cloudflare values, override authority, prevention/detection, and emergency reconciliation. Both include outputs, verification, and stop conditions. The plan says `Proposed; not approved for implementation`, requires accepted ADRs and separate mechanism approvals, and authorises no runtime, test, CI, deployment, or operational change.
8. **Runtime and mechanism scope is preserved — VERIFIED.** The remediation range `b76399da7cb3cd3c1626934b60352c629b0723c9..294aab803d3759c9005a409cb99110afe1246756` changes only ADR-0005, new ADR-0008, Plan 01-01, Plan 02-01, and `planning/STATE.md`. It changes no Worker/frontend/runtime source, static file, Wrangler/package/dependency file, test, script, workflow, build, deploy, or environment mechanism. Across the original branch, the only frontend delta remains deletion of the first four comment/blank lines in `src/html.js`; the base file from line 5 onward hashes exactly to the target blob `012792d3c486c3924f4bf224ff49d91a1c27dbec`.
9. **State and review evidence are current and honest at the assessed target — VERIFIED.** `planning/STATE.md` records the attended remediation, eight Proposed ADRs, six-slice unapproved plan, draft PR #4, historical CI SHAs, prior adversarial/Craft findings, the later `valid` ADR revalidation, the LOW stale-next-step code-review finding and its correction, no exact-head green, and clean-context not run. It does not promote summarized review output into exact-head evidence. `.artifacts/` and `.claude/` remain pre-existing untracked directories and have no tracked paths.

## Artifact and wiring status

| Artifact/link | Exists | Substantive | Wired | Status |
| --- | --- | --- | --- | --- |
| Eight direct consumer-kit destinations | Yes | Exact pinned-source bytes/modes | Canonical installed paths; script invoked by workflow/guidance | VERIFIED |
| `AGENTS.md` ADR guidance | Yes | Repository-specific authority and boundaries | Directs architectural work to ADRs, template, tooling, and gate | VERIFIED |
| ADR-0001 through ADR-0008 | Yes | 65–77 lines; real options/trade-offs/validation | Referenced by guidance, state, cross-links, and future plan | VERIFIED |
| ADR-0005 route model | Yes | Four complete exposure classes | Matches Worker root, maps, document allowlist, Assets branches, and fallback | VERIFIED |
| ADR-0008 static-serving decision | Yes | Bounded claim with alternatives and validation | Cross-linked to ADR-0002/0005 and matches Worker/Wrangler/public tree | VERIFIED |
| Governance script and workflow | Yes | Exact source baseline | Local gate passes; workflow is wired but exact-current-head CI is pending | VERIFIED locally |
| Proposed Plan 02-01 | Yes | Six bounded slices, including E/F | Linked from ADRs/state; explicitly gated and unapproved | VERIFIED (not approved) |
| `planning/STATE.md` | Yes | Detailed current checkpoint and divergence queue | Links goal, plan, PR, CI history, and pending review sequence | VERIFIED at assessed target |
| `src/html.js` authority correction | Yes | Comment-only correction | Matches `AGENTS.md` and ADR-0002 direct-maintenance declaration | VERIFIED |

## Reproducible evidence

Run from `/Users/jimcollinson/code/x0xmd` with the assessed target checked out:

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

Fresh pinned-source byte/mode comparison:

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

GitHub evidence observed during this verification:

```text
Draft PR: https://github.com/JimCollinson/x0xmd/pull/4
PR state/head: OPEN draft; b76399da7cb3cd3c1626934b60352c629b0723c9
Historical ADR CI: run 31107285981 succeeded at 87068d519e02671228c4f25815f54bfd19b011bf
Historical ADR CI: run 31108385268 succeeded at b76399da7cb3cd3c1626934b60352c629b0723c9
```

## Review evidence and honest limitations

- The default local gate selects `HEAD^1`. Because target commit `294aab8` changes only state, that invocation discovers eight ADRs but fully validates no changed ADR path. `GITHUB_BASE_REF=main` is the meaningful full branch-diff structural check and validates all eight ADR files. The inherited gate's documented fail-open, discovery, parsing, history, and self-modification limits remain.
- Draft PR #4 and two successful ADR Governance runs now exist, replacing the old verification's false-current `no PR`/`CI unrun` statements. Both runs predate the three local remediation commits and are historical evidence only. The PR does not contain ADR-0008 or Plan slices E/F at its remote head.
- The repository contains review summaries in `planning/STATE.md`, not standalone committed reviewer transcripts. The prior adversarial result was `NOT-READY`; the route-model and planning-coverage findings are materially remediated in the assessed artifacts, but no fresh adversarial pass has tested that conclusion. The prior Craft result was `CONCERNS`; its state-bookkeeping finding is corrected, but Craft has not rerun. The later ADR revalidation (`valid`) and code review (one LOW, corrected) are accurately preserved as summarized evidence, not elevated to current full-gauntlet green.
- Clean-context review was not run after the earlier adversarial block. No general code-quality CI arbiter exists; `.github/workflows/deploy.yml` is deployment, not quality evidence. No Cloudflare deployment or live endpoint audit was performed or inferred.
- This verification assesses goal achievement at `294aab8`; the verification-record commit itself is expected to advance the local branch further beyond PR #4. Exact-current-branch-head CI therefore remains pending until a separately authorised push.
- This record does not accept any ADR, approve Plan 02-01, authorise conformance implementation, satisfy the pending external review lanes, or mark Plan 01-01 Done.

## Recommendation

Treat the expanded Phase 01 ADR-foundation goal as verified. Keep Phase 01 in progress and Plan 02-01 parked. Next, through separately authorised actions, push the remediation plus this verification record, obtain exact-branch-head ADR Governance CI, rerun adversarial and Craft Review, run the fresh clean-context gate if unblocked, and return to Jim's attended checkpoint.

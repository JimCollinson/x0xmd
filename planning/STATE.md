## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** Attended decision checkpoint after fresh adversarial review returned `NOT-READY`. Structural ADR CI passed at remote head `a2d44bc`, but a HIGH finding shows that Cloudflare's default asset-first routing can bypass the Worker's claimed bounded static namespaces. Craft and clean-context gates have not run. No ADR is Accepted and no runtime implementation is approved.
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Mode:** Attended. Jim Collinson's live instruction on 2026-08-06 set this run to `attended mode`; stop and surface any escalation trigger.
- **Source pin:** `https://github.com/WithAutonomi/adr-standard` at founding merge `0b36be07b4730c158eaed3655b551318c81352bf`

## Attended Disposition

- On 2026-08-06 Jim approved amending ADR-0005, adding a separate static-assets
  ADR, and completing Proposed Plan 02-01 coverage for local product claims and
  production override authority.
- ADR-0005 now treats explicit individual routes and bounded static namespaces as
  valid governed exposure choices. It covers the special dual-response `/`,
  canonical exact routes and aliases, curated upstream documents, and the
  `/fonts/*` and `/assets/*` Workers Assets namespaces.
- Proposed ADR-0008 separately captures why reviewed files under `public/` are
  packaged and served through the bounded `ASSETS` binding. Separate static
  directories are not treated as a route-model defect, and neither ADR freezes
  the current file inventory.
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
- Original local bootstrap verification passed: `python3 scripts/adr-governance.py` checked seven ADR files; `git diff --check origin/main` passed; all eight direct kit destinations matched the pinned source blobs and required modes; scope/status inspection passed. This is historical evidence for the original bootstrap head.
- Independent code review passed with no ranked findings. It confirmed source fidelity, legal/provenance handling, workflow isolation, Proposed statuses, current-code/history accuracy, and comment-only frontend change.
- Independent ADR validation passed structurally and identified authority,
  cache-safety, fallback-escaping, and trust-contract concerns. Jim's disposition
  moved implementation-gap reporting into the Proposed conformance plan while
  retaining the intended invariants in ADR-0003, ADR-0004, ADR-0006, and
  ADR-0007.
- Pre-adversarial remediation verification passed locally: both
  `python3 scripts/adr-governance.py` and
  `GITHUB_BASE_REF=main python3 scripts/adr-governance.py` checked seven ADRs;
  `git diff --check origin/main...HEAD` passed; status and scope inspection found
  only the four ADR revisions, this state update, and the new Proposed plan.
- The prior ADR helper findings remain evidence, not a passing review of the
  original drafts.
- Independent ADR revalidation returned `valid` with no bootstrap blockers. It
  confirmed intended-architecture/conformance-plan separation, all seven
  Proposed statuses, and correct ADR/spec/plan boundaries. ADR-0007's
  CDN/SRI/CSP disposition remains a later human design question.
- Independent code re-review passed with no ranked findings and authorised goal
  verification to proceed.
- The original goal verification passed 7/7 at its historical target. Expanded
  goal verification now passes 9/9 at assessed target `294aab8` and is refreshed
  in `planning/phases/01-adr-foundation/VERIFICATION.md` by commit `f8a5a4a`.
  It independently reproduced source fidelity, governance, wiring, eight
  Proposed statuses, ADR-0005's four exposure classes, ADR-0008's bounded
  Workers Assets decision, the six-slice unapproved conformance plan, and the
  runtime/mechanism scope boundary.
- Draft PR #4 exists at `https://github.com/JimCollinson/x0xmd/pull/4`.
  ADR Governance run `31115279538` targeted remote/PR head `a2d44bc`. Its first
  attempt failed during GitHub runner setup with `Bad Gateway` while resolving
  the checkout action; no repository gate ran. An unchanged failed-job rerun
  passed in 18 seconds and checked a synthetic merge whose tree matched
  `a2d44bc`. This is exact-head structural ADR CI, not general quality CI. The
  earlier successful runs at `87068d5` and `b76399d` remain historical evidence.
- Adversarial review returned `NOT-READY`. HIGH: ADR-0005 states that only
  explicit allowlist/canonical-map routes are exposed, while `/`, `/fonts/*`,
  and `/assets/*` are governed by separate routing branches and the asset
  namespaces can expose tracked files without map entries. HIGH: the branch
  lacked a post-PR/post-CI auditable checkpoint with all gate results at the
  current head. MEDIUM: production authority remains overrideable through
  runtime configuration; the Proposed conformance plan does not yet cover the
  local product-claim audit or production deployment/override authority.
- Jim's approved draft remediation addresses the route-model HIGH by amending
  ADR-0005 and adding ADR-0008. It also adds the two missing Plan 02-01 authority
  slices. The affected code/ADR review, goal verification, adversarial review,
  and Craft Review must rerun; these draft changes are not a review pass.
- Craft Review returned `CONCERNS` with one CONFORMANCE finding: this state file
  still described the pre-PR checkpoint rather than PR #4, current CI, and the
  actual review status. The bookkeeping finding is updated here, but Craft
  Review must rerun against the current remediation.
- Current local documentation checks pass: both
  `python3 scripts/adr-governance.py` and
  `GITHUB_BASE_REF=main python3 scripts/adr-governance.py` validate eight ADRs;
  all eight statuses are Proposed, and worktree diff/scope/link inspection finds
  only the approved documentation changes plus the pre-existing untracked
  `.artifacts/` and `.claude/`. Final committed-head diff verification remains
  required.
- Independent ADR validation of the route/static-asset remediation returned
  `valid` with no blockers. It confirmed ADR-0005's four exposure classes,
  ADR-0008's separate Workers Assets rationale, eight Proposed statuses, and the
  bounded/unapproved Plan 02 slices.
- Code review found one LOW issue only: the prior Next Step still said to complete
  the two remediation commits after they already existed. No route, asset,
  authority, security, scope, or mechanism finding was reported. This state
  update corrects the handoff wording; the review must rerun against the updated
  commit before goal verification proceeds.
- Code review reran at `294aab8` and passed with no findings. Both governance
  modes, relative-link checks, JavaScript syntax checks, and branch/remediation
  diff checks passed. The reviewer authorised goal verification while correctly
  withholding any CI-green, push, merge, deployment, or ADR-acceptance claim.
- Expanded goal verification passed 9/9 at `294aab8`; its record is committed at
  `f8a5a4a`. Exact-current-head CI and fresh adversarial, Craft, and clean-context
  gates remain pending and are not implied by that verification pass.
- Fresh adversarial review at remote/PR head `a2d44bc` returned `NOT-READY` with
  one HIGH blocker. Cloudflare Workers Assets defaults to asset-first routing
  when `run_worker_first` is absent, so any matching tracked file under `public/`
  can be served without invoking `src/index.js`. That means the Worker branches
  for `/fonts/*` and `/assets/*` do not enforce the bounded exposure claim in
  ADR-0005/0008; future root-level files could also shadow Worker routes. The
  reviewer also found a MEDIUM stale PR description (seven ADRs/7-of-7) and this
  state's now-stale pre-push wording at LOW. Craft Review may not proceed as a
  readiness gate until the HIGH is resolved and adversarial review reruns.
- Clean-context review remains not run because adversarial review blocked the
  work-unit first.

## Scope State

- Installed the eight direct consumer-kit files byte-exact from the pinned source and merged its agent-guidance fragment into repository-specific `AGENTS.md`.
- Drafted ADR-0001 through ADR-0008 as Proposed records only; none is Accepted.
- The pre-adversarial remediation revised ADR-0003, ADR-0004, ADR-0006, and
  ADR-0007 to state intended authority, cache-safety, provenance,
  release-coherence, and safe-fallback invariants without presenting current
  implementation gaps as ADR content.
- Amended ADR-0005 to record four governed exposure classes at route or bounded-
  namespace level, and added ADR-0008 for repository-owned static files served
  through Workers Assets.
- Extended Proposed Plan 02-01 from four to six bounded future conformance
  slices. Slices E and F cover local index/presentation product-claim authority
  and production configuration/override authority. The plan remains Proposed,
  is not approved for implementation, and does not authorise runtime, test,
  deployment, or CI changes.
- Removed only the stale generated-source comment from `src/html.js`; that file is now the authoritative directly maintained frontend source.
- This remediation changed no runtime code, tests, CI, deployment, build,
  environment, copied kit bytes, agent guidance, or ADR status.
- Do not add `.adr-kit.yaml`, alter root legal files, alter deployment/build/test mechanisms, change route or trust behaviour, create another PR, merge, publish, deploy, or mark an ADR Accepted. The approved exact-head CI push is complete; no further push is authorised until the attended architecture decision and documentation remediation are resolved.
- Pre-existing untracked `.artifacts/` and `.claude/` are outside scope and must remain untracked and uncommitted.

## Known Current Divergence and Decision Queue

- Locally generated `/llms.txt`, route descriptions, trust/provenance prose, and
  frontend claims need a source/evidence and drift audit so product claims derive
  from or cite upstream truth while remaining distinguishable from upstream-
  authored bytes; Proposed Slice E now tracks this work.
- Production configuration and override authority need a specification plus an
  audit of actual deployed Cloudflare values, noncanonical-source prevention or
  detection, and an authorised emergency reconciliation path; Proposed Slice F
  now tracks this work.
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
- The prior ADR-0005 route-model gap is addressed in the current draft at
  the Worker-routing level, but fresh review found that Cloudflare's asset-first
  default can bypass that model for matching `public/` files. Jim must choose
  between a Worker-first bounded-namespace invariant (with later approved
  Wrangler/runtime conformance) and an asset-first reviewed-public-tree exposure
  model. ADR-0005/0008 and Proposed Plan 02 must then be updated consistently.

The former frontend-generator queue item is resolved by removing the stale comment: `src/html.js` itself is authoritative and directly maintained.

## Forks and Parked Units

- Forks: none.
- Parked units: none.

## Next Step

Attended architecture decision required for Workers Assets routing:

1. **Worker-first bounded namespaces:** keep ADR-0005/0008's bounded exposure
   invariant, explicitly account for current `run_worker_first` divergence, and
   add a separately approved Plan 02 conformance slice for Wrangler/runtime
   configuration and route-shadowing tests; or
2. **Asset-first reviewed public tree:** revise the exposure model so reviewed
   public-tree matching is itself a governed class, and remove the false claim
   that Worker branches enforce the boundary.

After Jim chooses, amend the Proposed ADRs and plan only, refresh the stale draft
PR description, rerun code/goal/adversarial review, then proceed to Craft,
clean-context, and exact-head CI if unblocked. Plan 01-01 remains in progress and
Proposed Plan 02-01 remains parked.

## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** Attended documentation remediation after Jim selected Worker-first bounded static namespaces. Effective Cloudflare routing remains asset-first and divergent; the remediation is local and unpushed, and fresh code review, goal verification, exact-head CI, adversarial, Craft, and clean-context gates remain pending. No ADR is Accepted and no runtime implementation is approved.
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
- After the later effective-routing HIGH, Jim selected Worker-first bounded
  static namespaces: Worker routing policy gets the first decision on every
  public request, and `ASSETS` may deliver a repository-owned file only after
  the Worker classifies its path into an explicitly approved bounded namespace.
  `public/` is packaging input, not an exposure allowlist; file presence alone
  must never create or shadow a public route.
- Proposed ADR-0005 and ADR-0008 are amended in place to record that intended
  invariant. The current missing Worker-first routing control remains a
  conformance divergence recorded here and in Proposed Plan 02-01, not an ADR
  decision and not a runtime change in this remediation.
- Current divergence remains review-visible in this state and in Proposed
  `planning/phases/02-contract-conformance/02-01-PLAN.md`.
- ADR/spec/plan boundaries remain separate: ADRs state invariants, a future spec
  must define concrete public schemas and failure/cache semantics where needed,
  and the Proposed plan sequences conformance work only after review and
  approval.

## Verification and Review

- This is a meaningful work-unit and uses the full GSD gauntlet.
- Review cadence is per work-unit: independent code/ADR review, goal
  verification, authorised push/PR-description refresh, exact-head CI,
  adversarial review, Craft Review, clean-context test, then Jim's attended
  checkpoint.
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
  goal verification later reported 9/9 at assessed target `294aab8` in commit
  `f8a5a4a`. The subsequent effective-routing HIGH invalidated that result for
  readiness because its ADR-0005/0008 findings matched direct Worker code but
  not Cloudflare's actual asset precedence. `VERIFICATION.md` now preserves the
  9/9 evidence only as superseded history and awaits fresh independent refresh.
- Draft PR #4 exists at `https://github.com/JimCollinson/x0xmd/pull/4`.
  ADR Governance run `31115279538` targeted remote/PR head `a2d44bc`. Its first
  attempt failed during GitHub runner setup with `Bad Gateway` while resolving
  the checkout action; no repository gate ran. An unchanged failed-job rerun
  passed in 18 seconds and checked a synthetic merge whose tree matched
  `a2d44bc`. This is exact historical structural ADR CI for `a2d44bc` only, not
  current-head or general quality CI.
- Adversarial review returned `NOT-READY`. HIGH: ADR-0005 states that only
  explicit allowlist/canonical-map routes are exposed, while `/`, `/fonts/*`,
  and `/assets/*` are governed by separate routing branches and the asset
  namespaces can expose tracked files without map entries. HIGH: the branch
  lacked a post-PR/post-CI auditable checkpoint with all gate results at the
  current head. MEDIUM: production authority remains overrideable through
  runtime configuration; the Proposed conformance plan does not yet cover the
  local product-claim audit or production deployment/override authority.
- Jim's earlier approved remediation addressed a different route-model finding
  by amending ADR-0005, adding ADR-0008, and adding two Plan 02-01 authority
  slices. That work did not address Cloudflare's later asset-precedence HIGH.
- Craft Review returned `CONCERNS` with one CONFORMANCE finding: this state file
  still described the pre-PR checkpoint rather than PR #4, current CI, and the
  actual review status. The bookkeeping finding is updated here, but Craft
  Review must rerun against the current remediation.
- Fresh adversarial review at remote/PR head `a2d44bc` returned `NOT-READY` with
  one HIGH blocker. Cloudflare Workers Assets defaults to asset-first routing
  when `run_worker_first` is absent, so any matching tracked file under `public/`
  can be served without invoking `src/index.js`. That means the Worker branches
  for `/fonts/*` and `/assets/*` do not enforce the bounded exposure claim in
  ADR-0005/0008; future root-level files could also shadow Worker routes. The
  reviewer also found a MEDIUM stale PR description (seven ADRs/7-of-7) and this
  state's now-stale pre-push wording at LOW. Craft Review may not proceed as a
  readiness gate until the HIGH is resolved and adversarial review reruns.
- Local start checkpoint `fc4ad4d` records that blocker and is unpushed, one
  commit ahead of `origin/feat/adopt-adr-standard@a2d44bc`. The current
  six-file documentation remediation is also local and unpushed. It has not
  altered PR #4 or its description.
- The current documentation remediation is not independently verified and does
  not resolve the effective runtime divergence. Independent code review must run
  first, followed by fresh goal verification. Craft and clean-context review
  remain not run because the prior adversarial review blocked readiness.

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
- Extended Proposed Plan 02-01 from six to seven bounded future conformance
  slices. Slice G covers the separately gated future `run_worker_first = true`
  change and Cloudflare-level precedence/shadowing integration tests. The plan
  remains Proposed, is not approved for implementation, and does not authorise
  runtime, test, deployment, or CI changes.
- Removed only the stale generated-source comment from `src/html.js`; that file is now the authoritative directly maintained frontend source.
- This documentation remediation is limited to Proposed ADR-0005, Proposed
  ADR-0008, Plan 01-01, Proposed Plan 02-01, `VERIFICATION.md`, and this state.
  It changes no runtime code, static assets, tests, CI, deployment, build,
  environment, copied kit bytes, agent guidance, or ADR status.
- Do not add `.adr-kit.yaml`, alter root legal files, alter deployment/build/test mechanisms, change route or trust behaviour, create another PR, merge, publish, deploy, or mark an ADR Accepted. No push or PR-description change is authorised by this remediation.
- Pre-existing untracked `.artifacts/` and `.claude/` are outside scope and must remain untracked and uncommitted.

## Known Current Divergence

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
- Effective Cloudflare routing is currently asset-first because `wrangler.toml`
  does not set `run_worker_first`. A matching packaged file can therefore bypass
  `src/index.js`, appear outside the approved static namespaces, or shadow root,
  exact-route, alias/redirect, curated-document, and unknown-path policy. Jim has
  resolved the architectural choice in favour of Worker-first bounded static
  namespaces; Proposed Slice G tracks future conformance after ADR acceptance,
  implementation approval, and separate approvals for the Wrangler and
  integration-test mechanism changes.

The former frontend-generator queue item is resolved by removing the stale comment: `src/html.js` itself is authoritative and directly maintained.

## Forks and Parked Units

- Forks: none.
- Parked units: none.

## Next Step

Keep Plan 01-01 in progress and Proposed Plan 02-01 parked. Run the remaining
gates in this order:

1. independent code/ADR review of the committed six-file remediation;
2. fresh goal verification that replaces the superseded 9/9 result;
3. separately authorised push and PR #4 description refresh;
4. exact-remediation-head ADR Governance CI;
5. fresh adversarial review;
6. fresh Craft Review; and
7. fresh clean-context review before Jim's attended checkpoint.

No later gate may be inferred from an earlier one. All ADRs remain Proposed,
Plan 02-01 remains unapproved, and no runtime/configuration/test/deployment
implementation is authorised.

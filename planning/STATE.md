## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** Corrected nine-ADR/seven-slice scope is ready for Jim's attended ADR review once the evidence-only checkpoint commit receives current-head structural ADR CI. Code review and 10/10 goal verification passed; exact reviewed-head CI is green; adversarial returned `READY-WITH-NITS`; Craft passed. Fresh clean-context is deferred because the owner-configured external panel runner boundary is inactive, so the work is not PR/merge-ready. No ADR is Accepted, Plan 02-01 is not approved, and no runtime or operational implementation is authorised.
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Mode:** Attended. Jim Collinson approved this documentation-only scope correction and instructed the build-mode run to proceed on 2026-08-07. Updating the existing draft PR #4 branch and description is authorised only to run the remaining review gates; stop and surface any other escalation trigger.
- **Source pin:** `https://github.com/WithAutonomi/adr-standard` at founding merge `0b36be07b4730c158eaed3655b551318c81352bf`

## Binding Stable-entrypoint Decisions — 2026-08-07

- `x0x.md` is the canonical stable public origin for x0x discovery and
  installation. The exact canonical ergonomic command is
  `curl -sfL https://x0x.md | sh`.
- One origin adapts for human, CLI/agent, and machine-readable consumers.
  Proposed ADR-0004 governs representations, cache safety, and routes; Proposed
  ADR-0009 governs the stable origin.
- Current behaviour is correct and sufficient: x0xmd fetches and proxies
  `install.sh` directly from canonical `saorsa-labs/x0x` GitHub `main`.
  Dependence on GitHub availability is an accepted trade-off, not a defect or
  conformance gap.
- The stable public URL preserves freedom to change hosting or backend later
  without breaking public URLs. Canonical upstream product, source, installer,
  product-name, and release authority remains unchanged.
- Independent hosting or failover is future optionality only. It may be
  reconsidered if demonstrated availability problems justify a new architectural
  decision, bounded specification, and separately approved GSD plan. No storage,
  retention, ingestion, attestation, freshness, outage, plural-delivery,
  signed-skill, or client-selection machinery is currently required.
- Skills and clients may offer their own sandbox-appropriate installation paths
  without requiring x0xmd to discover, verify, enumerate, retain, or serve them.
- The intended durable domain steward is the Autonomi Foundation. This work makes
  no claim about current registrar ownership, legal custody, or completed
  transfer, and records no current custody conformance gap.
- `x0x.sh` remains reserved optionality with no redirect, route, failover,
  uptime, or compatibility contract.
- Product-name authority remains upstream. `x0x.md` is short, distinctive in the
  known ecosystem, suitable for exact-text and agent-first use, Foundation-
  ownable, and a natural `.md` fit. Verbal `0`/`O` and “tic-tac-toe” ambiguity is
  a negative; pronounceability is not a benefit.
- The canonical command is an ergonomic default, not the only compatible path;
  inspect-first and verification-first alternatives remain required because
  curl-pipe-shell carries inherent risk.

## Current Correction Scope and Authority

- Proposed ADR-0009 remains the stable-public-entrypoint decision. Proposed
  ADR-0002, ADR-0003, and ADR-0006 now preserve only a conditional future
  authority boundary; ADR-0004 was inspected and remains unchanged.
- Proposed Plan 02-01 has returned to exactly seven future slices, A through G.
  Slice H and its retention, custody, freshness, multi-location, signed-skill,
  and client-selection machinery are withdrawn.
- The correction is limited to ADR-0002, ADR-0003, ADR-0006, ADR-0009, Plan
  01-01, Proposed Plan 02-01, this state, `VERIFICATION.md`, and `CHECKPOINT.md`.
- All nine ADRs remain Proposed. Plan 02-01 and all seven slices remain
  unapproved.
- No runtime, configuration, storage, asset, skill, test/harness, workflow,
  governance-script, build, deployment, dependency, environment, domain, DNS,
  secret, spend, merge, publish, release, or deploy action is authorised. The
  only external action authorised is updating the existing draft PR #4 branch
  and description for exact-head CI and review.

## Superseded Nine-ADR/Eight-slice Review History

- Review at `a494c70` assessed a nine-ADR/eight-slice draft that made independent
  retained delivery a current requirement. It reproduced both governance modes,
  exact ten-file scope, nine Proposed statuses, eight Plan 02 slices, link
  integrity, and zero mechanism changes.
- That review found one HIGH in Slice H's mutable-`main` identity and freshness
  evidence, plus MEDIUM findings in C/D/F/G sequencing and `x0x.sh` boundaries.
  The draft was revised to require revision/digest and verification-time
  evidence, explicit freshness states and client policy, an A-to-B outage
  fixture, completed C/D/F/G prerequisites, and no `x0x.sh` dependency or service
  test. These were draft remediations, not readiness results.
- A fresh rerun confirmed those three Plan 02 corrections, then found a HIGH in
  blanket signature/manifest and stale-byte wording. Proposed ADR-0003 and
  ADR-0009 were revised to match claims to the evidence supplied by each
  artefact. That correction also remained pending fresh review.
- The next rerun confirmed the earlier findings were addressed, then found the
  last-verification issue recorded at `b55eb2b`: fetch time could not substitute
  for verification time in the retained-installer freshness ledger. Goal
  verification was blocked against that draft.
- Jim withdrew the independent-distribution design rather than treating the
  last-verification issue as a technical defect to fix. The finding remains
  valid against the withdrawn text but is not an active blocker.
- All review and verification of the nine-ADR/eight-slice draft is superseded
  draft-scope evidence only. It does not prove readiness of the corrected
  nine-ADR/seven-slice scope.
- Fresh independent code/ADR review, goal verification, adversarial review,
  Craft Review, and clean-context review are required before the next attended
  readiness checkpoint. No external action or implementation gate is inferred.

## Current Nine-ADR/Seven-slice Review

- Independent code/ADR review passed at implementation head `801275b` with no
  findings. It reproduced both governance modes, nine Proposed statuses, exactly
  seven unapproved Plan 02 slices A-G, link and source-kit integrity, the exact
  authorised correction scopes, and zero runtime or mechanism changes.
- Independent goal verification passed 10/10 at implementation target `801275b`;
  the refreshed record is committed at `5f89cdf`. It verified the stable-
  entrypoint rationale, current canonical-GitHub proxy as conformant, accepted
  GitHub availability trade-off, non-binding future hosting consideration, and
  historical-evidence boundaries.
- The branch and draft PR were updated to reviewed head `d9a340e`; exact-head
  structural ADR Governance run `31195124339` passed. This is not general quality
  or runtime evidence.
- Fresh adversarial review at `d9a340e` returned `READY-WITH-NITS` with no
  CRITICAL, HIGH or MEDIUM findings. Its LOW stale-evidence finding is reconciled
  by this state and the new checkpoint; its inherited checkout-runtime NIT is
  deferred to a deliberate future canonical-kit update.
- Fresh Craft Review at `d9a340e` passed with no CONFORMANCE, SIMPLICITY or NIT
  findings.
- A new Claude clean-context lane was requested through panel but did not
  dispatch because the owner configuration keeps the external runner boundary
  fail-closed. Clean-context is honestly deferred; no substitute review or lane
  findings are claimed. `models: none · 0s`.
- `planning/phases/01-adr-foundation/CHECKPOINT-2026-08-07.md` records the
  corrected current review evidence and remaining clean-context backlog. Its
  evidence-only commit must receive current-head structural ADR CI before the
  attended handoff.

## Historical Attended Disposition through `52ecb10`

The following disposition predates the 2026-08-07 reopening and is retained as
history for the eight-ADR/seven-slice scope.

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

## Historical Verification and Review through `52ecb10`

All results in this section are historical for the pre-reopening scope. In
particular, structural ADR Governance run `31118541443` was exact for reviewed
head `406a56d`; it was summarized by the later `52ecb10` checkpoint but was not
an exact-head CI run for `52ecb10` and is not current reopened-scope green.

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
- An earlier Craft Review returned `CONCERNS` with one CONFORMANCE finding: this state file
  still described the pre-PR checkpoint rather than PR #4, current CI, and the
  actual review status. That historical finding was corrected before the fresh
  Craft pass recorded below.
- Fresh adversarial review at remote/PR head `a2d44bc` returned `NOT-READY` with
  one HIGH blocker. Cloudflare Workers Assets defaults to asset-first routing
  when `run_worker_first` is absent, so any matching tracked file under `public/`
  can be served without invoking `src/index.js`. That means the Worker branches
  for `/fonts/*` and `/assets/*` do not enforce the bounded exposure claim in
  ADR-0005/0008; future root-level files could also shadow Worker routes. The
  reviewer also found a MEDIUM stale PR description (seven ADRs/7-of-7) and this
  state's now-stale pre-push wording at LOW. Craft Review may not proceed as a
  readiness gate until the HIGH is resolved and adversarial review reruns.
- Local start checkpoint `fc4ad4d` recorded that blocker before the six-file
  documentation remediation and later push. It is historical; the current
  branch/PR state is recorded below.
- The documentation remediation deliberately does not resolve the effective
  runtime divergence. The prior adversarial block prevented Craft and clean-
  context review until the documentation remediation was complete.
- Independent code/ADR review passed at `bcf65ee` with no findings. It confirmed
  the six-file documentation scope, eight Proposed statuses, seven bounded Plan
  02 slices, Slice G's separate mechanism approvals and collision controls, and
  no runtime/configuration/workflow/test/dependency/environment change.
- Fresh goal verification passed 8/8 at implementation target `bcf65ee`; the
  result is committed at `c4666cd` in `VERIFICATION.md`. It verifies the ADR
  foundation and intended architecture, not runtime Worker-first conformance.
  At that verification checkpoint, exact-current-head CI and fresh adversarial,
  Craft, and clean-context gates remained pending; their later results follow.
- The reviewed branch and draft PR were updated to `406a56d`. Structural ADR
  Governance run `31118541443` passed at that exact head. The refreshed PR
  description records eight Proposed ADRs, seven unapproved Plan 02 slices, the
  8/8 foundation result, and the current runtime divergence without claiming
  general quality CI.
- Fresh adversarial review at `406a56d` returned `READY-WITH-NITS` with no
  CRITICAL, HIGH, or MEDIUM findings. The prior asset-precedence HIGH is resolved
  for Phase 01 documentation readiness and explicitly unresolved at runtime.
  LOW findings concerned stale pre-push state/PR text, unavailable standalone
  code-review transcripts, and the authenticated-access prerequisite for
  re-fetching the private pinned source.
- Fresh Craft Review at `406a56d` passed with no CONFORMANCE, SIMPLICITY, or NIT
  findings.
- The fresh clean-context gate returned non-blocking `Concerns` and found the
  phase ready for Jim's attended review only. Its durable report is
  `planning/phases/01-adr-foundation/CLEAN-CONTEXT.md`; its model disclosure is:
  `models: claude-opus-4-8 · 173s`.
- `planning/phases/01-adr-foundation/CHECKPOINT.md` reconciles current gate
  results and evidence limitations. Because these checkpoint artifacts follow
  reviewed head `406a56d`, the current PR head must receive its own structural
  ADR Governance pass before handoff.

## Historical Scope State through `52ecb10`

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
- Do not add `.adr-kit.yaml`, alter root legal files, alter deployment/build/test mechanisms, change route or trust behaviour, create another PR, merge, publish, deploy, or mark an ADR Accepted. No instruction from the historical run authorises a current push or any edit or comment on PR #4.
- Pre-existing untracked `.artifacts/` and `.claude/` are outside scope and must remain untracked and uncommitted.

## Known Current Divergence and Accepted Trade-offs

- Current upstream delivery depends on GitHub, including the direct installer
  proxy from canonical `saorsa-labs/x0x` `main`. This is conformant and sufficient;
  GitHub availability dependence is an accepted trade-off, not a divergence.
- Intended Autonomi Foundation stewardship is recorded without asserting current
  registrar ownership, legal custody, or completed transfer. No current custody
  conformance gap or audit requirement is created by the stable-entrypoint
  decision.

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

Commit and push the current evidence-only checkpoint and state reconciliation to
existing draft PR #4, obtain structural ADR Governance CI at that final head, and
refresh the PR evidence section without another branch change. Then stop for
Jim's attended ADR review. Clean-context remains deferred until the owner panel
runner boundary is activated; do not call the work PR/merge-ready or infer any
runtime, operational, acceptance, merge, deployment, or mechanism authority.

All nine ADRs remain Proposed. Plan 02-01 and all seven slices remain unapproved.
No runtime/configuration/storage/asset/skill/test/workflow/build/deploy/
dependency/environment/domain/DNS/secret/spend change is authorised.

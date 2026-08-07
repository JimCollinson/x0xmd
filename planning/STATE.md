## Current Position

- **Phase:** 01-adr-foundation
- **Plan:** 01-01 (ADR bootstrap)
- **Status:** Attended code-review checkpoint for the reopened stable-entrypoint work. Jim approved the documentation-only correction to the HIGH contradiction in Proposed ADR-0003/0009, and their artefact-evidence validation wording is now aligned pending fresh review. Code review and then goal verification must rerun. No ADR is Accepted, Plan 02-01 is not approved, and no runtime or operational implementation is authorised.
- **Base:** `origin/main@7de2813459cff504e176d364cf7f52cc5ab85ea4`
- **Mode:** Attended. Jim Collinson approved the documentation-only reopening, targeted Plan remediation, and this ADR evidence correction on 2026-08-07; stop and surface any escalation trigger.
- **Source pin:** `https://github.com/WithAutonomi/adr-standard` at founding merge `0b36be07b4730c158eaed3655b551318c81352bf`

## Binding Stable-entrypoint Decisions — 2026-08-07

- `x0x.md` is the canonical stable public origin for x0x discovery and
  installation. The exact canonical ergonomic command is
  `curl -sfL https://x0x.md | sh`.
- One origin adapts for human, CLI/agent, and machine-readable consumers.
  Proposed ADR-0004 governs representations, cache safety, and routes; Proposed
  ADR-0009 governs the stable origin.
- Entrypoint, authority, delivery, and client selection are distinct. Canonical
  upstream product/source/release authority remains unchanged; verified replicas,
  mirrors, caches, retained stores, and future locations remain delivery only.
- `x0x.md` is intended to serve independently retained verified installer and
  artefact bytes during GitHub outages. Canonical identity, artefact-appropriate
  evidence, and coherent sets must be preserved.
- If the mutable-`main` installer advances from A to B before `x0x.md` can refresh
  and GitHub then becomes unavailable, retained verified A may be offered only as
  explicitly last-known verified/stale, with A's immutable canonical revision,
  digest, and last-verification time. It must never be called current or latest;
  client policy may accept or refuse it. Verification claims must match the
  artefact's actual evidence rather than implying an installer signature.
- Signed skills and machine-readable provenance may expose an extensible set of
  verified delivery choices for different sandbox/security policies. Client
  selection never grants authority, and the durable decision freezes no host
  inventory.
- The intended durable domain steward is the Autonomi Foundation. Current
  registrar ownership and legal custody have not been evidenced in this work;
  the custody/transfer gap is future operational conformance and no present
  custody claim is made.
- `x0x.sh` is foundation-controlled reserved strategic optionality only. Slice H
  must not add, change, test as a service, advertise, depend on, or infer any
  redirect, failover, uptime, or compatibility contract for it; incidental
  current DNS or HTTP state remains outside scope.
- Product-name authority remains upstream. `x0x.md`'s shortness, exact-text use,
  distinctiveness in the known ecosystem, Foundation control, stability,
  ordinarily low character/token burden, and `.md` fit outweigh its negative
  verbal `0`/`O` and “tic-tac-toe” ambiguity. No universal uniqueness or
  tokenizer guarantee is claimed.
- The canonical command is an ergonomic default, not the only compatible path;
  inspect-first and verification-first alternatives remain required because
  curl-pipe-shell carries inherent risk.

## Reopened Scope and Authority

- Added Proposed ADR-0009 and bounded cross-links/clarifications in Proposed
  ADR-0002, ADR-0003, ADR-0004, and ADR-0006.
- Extended Proposed Plan 02-01 from seven to eight slices. Slice H covers
  multi-location verified distribution and GitHub-outage resilience behind
  accepted applicable ADRs, an approved concrete specification, completed and
  verified Slices C/D/F/G before H implementation starts, a domain-custody audit,
  and separate approvals for every
  upstream, storage/cache, runtime/network/configuration/deployment, harness/CI,
  secrets, DNS/domain, and spend mechanism it implicates.
- Jim's attended remediation approval requires mutable-`main` revision, digest,
  fetched/last-verified, current versus last-known-verified/stale versus unknown,
  and client-policy semantics plus an independently controlled A-to-B outage and
  recovery fixture. It also keeps `x0x.sh` wholly outside Slice H implementation
  and service testing without treating incidental DNS/HTTP state as a defect.
- Jim's approved follow-up correction may change only Proposed ADR-0003,
  Proposed ADR-0009, and this state. It aligns verification evidence with the
  evidence the canonical artefact actually supplies without changing authority.
- This targeted remediation may change only Proposed Plan 02-01 and this state.
- The reopening may change only ADR-0009, ADR-0002/0003/0004/0006, Plan 01-01,
  Proposed Plan 02-01, this state, `VERIFICATION.md`, and `CHECKPOINT.md`.
- No runtime, configuration, storage, asset, skill, test/harness, workflow,
  governance-script, build, deployment, dependency, environment, domain, DNS,
  secret, spend, push, PR #4, merge, publish, release, or deploy action is
  authorised.

## Reopened-scope Code Review — Findings Addressed Pending Fresh Review

- Independent code/ADR review at implementation head `a494c70` reproduced both
  governance modes, exact ten-file scope, nine Proposed statuses, eight Plan 02
  slices, link integrity, and zero mechanism changes.
- HIGH addressed in the Proposed plan pending fresh review: Slice H now specifies
  immutable mutable-`main` revision/digest and verification-time evidence,
  explicit current versus last-known-verified/stale versus unknown semantics,
  client acceptance/refusal policy, and an independently established A-to-B
  outage/recovery fixture that forbids silent current/latest or downgrade claims.
- MEDIUM addressed in the Proposed plan pending fresh review: completed and
  verified Slices C, D, F, and G, including all their existing human and
  mechanism approvals, are mandatory before Slice H implementation starts. No
  unspecified interleaving remains.
- MEDIUM addressed in the Proposed plan pending fresh review: Slice H must not
  touch, change, test as a service, advertise, rely on, or infer redirect,
  failover, uptime, or compatibility behaviour for `x0x.sh`; incidental current
  DNS/HTTP state is outside scope and does not require a domain change.
- These are documentation remediations, not a fresh review result. Code review
  must rerun before goal verification. No external action or later runtime or
  mechanism gate is authorised or current for the reopened scope.

## Fresh Code-review Rerun — Finding Addressed Pending Fresh Review

- The three approved Plan 02 fixes passed reinspection: the A-to-B outage and
  recovery fixture is explicit, C/D/F/G must finish before H, and Slice H neither
  changes nor relies on `x0x.sh`.
- Jim approved the documentation-only correction to the HIGH. Proposed ADR-0003
  and ADR-0009 now use canonical revision, digest, provenance, verification-time,
  and freshness evidence for mutable-`main` documentation and installer bytes;
  signatures, manifests, and release identity remain required for signed release
  artefacts that canonically supply them.
- Their validation now permits an older retained installer only as explicitly
  last-known verified/stale with its actual evidence and subject to client
  policy. It rejects stale bytes misrepresented as current/latest and rejects
  corrupt, partial, unverifiable, cross-source, cross-release, and identity-
  mismatched combinations without implying an installer signature.
- This records a documentation correction, not a fresh review result. Code
  review must rerun before goal verification. No external action or later runtime
  or mechanism gate is authorised or current for the reopened scope.

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

## Known Current Divergence

- Current installer, documentation, signed-skill, release-manifest, verification-
  key, agent-card, and release-index delivery depends on GitHub hosts. x0x.md does
  not yet retain and serve a proven coherent verified set independently through a
  GitHub outage. Proposed Slice H tracks future work after every separate
  approval; it is not implementation authority.
- Intended Autonomi Foundation stewardship is recorded, but current registrar
  ownership, legal custody, and any required transfer have not been evidenced.
  No custody or completed-transfer claim may be made until an approved audit
  supplies evidence.

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

Rerun fresh code/ADR review of the approved three-file documentation correction,
then, if it passes, rerun goal verification. Do not push or refresh PR #4, and do
not infer any external, runtime, operational, or mechanism gate.

No gate may be inferred from the historical eight-ADR/seven-slice pass. All nine
ADRs remain Proposed, Plan 02-01 and all eight slices remain unapproved, Slice H
is not authorised, and no runtime/configuration/storage/asset/skill/test/
workflow/build/deploy/dependency/environment/domain/DNS/secret/spend change is
authorised.

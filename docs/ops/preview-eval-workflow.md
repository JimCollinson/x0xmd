# Preview Deploy + External Evaluation Workflow

This runbook defines the single release-candidate path for branch previews and external evaluation evidence capture.

## Scope

- Branch-scoped preview deploy using GitHub Actions workflow dispatch.
- External evaluator handoff using `planning/EVAL-SKILL.md`.
- Mandatory release evidence artifact with auditable pointers.

## Preconditions

- Branch exists on `origin` (for example `codex-v1`).
- GitHub CLI (`gh`) is authenticated with workflow dispatch permissions.
- Repository secrets are present in `JimCollinson/x0xmd`:
  - `CLOUDFLARE_API_TOKEN`
  - `CLOUDFLARE_ACCOUNT_ID`

## Dispatch Preview Deploy

Use one command path:

```bash
gh workflow run deploy.yml --ref <branch> -f worker_name=x0x-md-<branch>
```

Example:

```bash
gh workflow run deploy.yml --ref codex-v1 -f worker_name=x0x-md-codex-v1
```

## Capture Deploy Evidence

After dispatch, capture:

1. Workflow run URL (`https://github.com/JimCollinson/x0xmd/actions/runs/<run_id>`)
2. Preview URL (`https://x0x-md-<branch>.workers.dev`)
3. Commit SHA for the candidate branch

## External Evaluator Handoff

Provide evaluator inputs:

- Candidate branch preview URL
- Deploy run URL
- `planning/EVAL-SKILL.md`
- Report output path rule: `planning/eval-reports/<YYYY-MMM-DD>-<branch>-eval.md`

Evaluator output must include:

- Task outcomes (triage, understand, install, first use, integration)
- Blockers and pass/fail recommendation
- Exact report path in `planning/eval-reports/`

## Release Evidence Artifact

Store release evidence JSON using `docs/ops/release-evidence.schema.json`.

Required top-level keys:

- `schema_version`
- `generated_at`
- `branch`
- `commit`
- `deploy`
- `evaluation`
- `decision`

Use `docs/ops/release-evidence.example.json` as the canonical template.

## Decision Status Rules

- `pending`: deploy and/or evaluation evidence still incomplete.
- `promote`: preview and external evaluation passed, candidate can be promoted.
- `reject`: candidate failed and should not be promoted.
- `defer`: evidence exists but decision postponed.

## Traceability Rules

- Runbook updates must stay in sync with `.github/workflows/deploy.yml` inputs.
- `evaluation.report_path` must point to a file under `planning/eval-reports/`.
- Promotion decisions are invalid without both `deploy.run_url` and `evaluation.report_path`.

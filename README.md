## x0x.md

Cloudflare Worker endpoint for x0x install and trust metadata.

### Behavior

- Browser (`https://x0x.md`) -> human-readable install page
- CLI/agents (`curl -sfL https://x0x.md | sh`) -> installer script
- Trust metadata (`https://x0x.md/trust.json`) -> machine-readable contract and policy links
- Agent profile (`https://x0x.md/agent.json`) -> machine-first contract payload
- LLM text contract (`https://x0x.md/llms.txt`) -> plain-text agent summary

### Local development

```bash
npx wrangler dev
```

### Deploy

```bash
npx wrangler deploy
```

For preview workers via GitHub Actions, run `Deploy x0x.md Worker` with `worker_name` input (example: `x0x-md-lab-b001`).

### Config vars

- `INSTALL_SCRIPT_URL`
- `SKILL_URL`
- `SKILL_SIGNATURE_URL`
- `GPG_KEY_URL`

Defaults are currently set to:

- installer source: `JimCollinson/x0x` (fork)
- release artifacts (SKILL/signature/key): `saorsa-labs/x0x` (latest published release)

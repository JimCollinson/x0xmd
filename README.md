## x0x.md

Cloudflare Worker endpoint for x0x install and trust metadata.

### Behavior

- Browser (`https://x0x.md`) -> human-readable install page
- CLI/agents (`curl -sfL https://x0x.md | sh`) -> installer script
- Trust metadata (`https://x0x.md/trust.json`) -> machine-readable policy and artifact links
- Agent metadata (`https://x0x.md/agent.json`) -> compact install/verify/trust contract
- LLM crawl hints (`https://x0x.md/llms.txt`) -> plain-text agent discovery summary

### Local development

```bash
npx wrangler dev
```

### Quality checks

```bash
npm ci
npm run check-format
npm test
npm run check-worker
npm run audit
```

### Deploy

```bash
npx wrangler deploy

# preview worker
npx wrangler deploy --name x0x-md-lab-c001
```

### Config vars

- `INSTALL_SCRIPT_URL`
- `SKILL_URL`
- `SKILL_SIGNATURE_URL`
- `GPG_KEY_URL`

Defaults are currently set to:

- installer source: `JimCollinson/x0x` (fork)
- release artifacts (SKILL/signature/key): `saorsa-labs/x0x` (latest published release)

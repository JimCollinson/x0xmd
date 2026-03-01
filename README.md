## x0x.md

Cloudflare Worker endpoint for x0x install and trust metadata.

### Behavior

- Browser (`https://x0x.md`) -> human-readable holistic agent journey page
- CLI/agents (`curl -sfL https://x0x.md | sh`) -> installer script
- Agent contract (`https://x0x.md/agent.json`) -> machine-readable product and integration contract
- LLM brief (`https://x0x.md/llms.txt`) -> compact text contract for model ingestion
- Trust contract (`https://x0x.md/trust.json`) -> trust model and artifact links
- API reference (`https://x0x.md/api-reference.json`) -> first-use endpoint catalog
- Health (`https://x0x.md/health`) -> worker status

### Local development

```bash
npx wrangler dev
```

### Deploy

```bash
npx wrangler deploy
```

### Quality checks

```bash
npm ci
npm run check-format
npm test
npm run check-worker
npm run audit
```

### Config vars

- `INSTALL_SCRIPT_URL`
- `SKILL_URL`
- `SKILL_SIGNATURE_URL`
- `GPG_KEY_URL`

Defaults are currently set to:

- installer source: `JimCollinson/x0x` (fork)
- release artifacts (SKILL/signature/key): `saorsa-labs/x0x` (latest published release)

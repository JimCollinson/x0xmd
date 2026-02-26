## x0x.md

Cloudflare Worker endpoint for x0x install and trust metadata.

### Behavior

- Browser (`https://x0x.md`) -> human-readable install page
- CLI/agents (`curl -sfL https://x0x.md | sh`) -> installer script
- Trust metadata (`https://x0x.md/trust.json`) -> machine-readable policy and artifact links

### Local development

```bash
npx wrangler dev
```

### Deploy

```bash
npx wrangler deploy
```

### Config vars

- `INSTALL_SCRIPT_URL`
- `SKILL_URL`
- `SKILL_SIGNATURE_URL`
- `GPG_KEY_URL`

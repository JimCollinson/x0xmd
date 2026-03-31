## x0x.md

Cloudflare Worker for `https://x0x.md`.

### Public surface

- `/` -> browser homepage or installer script for CLI requests
- `/skill.md` and `/skill.md.sig` -> current release skill and detached signature
- `/install.sh` -> unified installer script
- `/trust.json` -> machine-readable install and verification metadata
- `/.well-known/agent.json` -> current release agent card
- `/release-manifest.json` and `/release-manifest.json.sig` -> release inventory and signature
- `/SAORSA_PUBLIC_KEY.asc` -> upstream release verification key
- `/docs/...` -> public operator docs from upstream `main`
- `/docs/primers/...` -> public primers from upstream `main`
- `/llms.txt` and `/llms-full.txt` -> indexed public docs for agents

Mixed-case URLs are redirected to the canonical route where supported, for example `/SKILL.md` -> `/skill.md`.

### Upstream sources

- Release artifacts come from the latest published release in `saorsa-labs/x0x`
- Public docs come from `saorsa-labs/x0x` `main`
- Embedded `SKILL.md` metadata is treated as informational only; the published release asset bytes are authoritative
- No fork or staging source is used

### Local development

```bash
npx wrangler dev
```

### Deploy

```bash
npx wrangler deploy
```

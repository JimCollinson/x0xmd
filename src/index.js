const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/main/scripts/install.sh"
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md"
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig"
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc"
const DEFAULT_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/feat/agent-onboarding-docs"

const VALID_DOC_NAMES = [
  "overview",
  "install",
  "verify",
  "api",
  "patterns",
  "compared",
  "troubleshooting",
  "uninstall",
]

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    if (path === "/trust.json") {
      return trustResponse(request, env)
    }

    if (path === "/install.sh") {
      return installerResponse(env)
    }

    if (path === "/health") {
      return jsonResponse({ status: "ok", service: "x0x-md-worker" })
    }

    if (path === "/llms.txt") {
      return llmsTxtResponse()
    }

    if (path === "/llms-full.txt") {
      return llmsFullTxtResponse(env)
    }

    if (path === "/.well-known/agent.json") {
      return agentJsonResponse(env)
    }

    const docsMatch = path.match(/^\/docs\/([a-z-]+)\.md$/)
    if (docsMatch) {
      const name = docsMatch[1]
      if (VALID_DOC_NAMES.includes(name)) {
        return docsResponse(name, env)
      }
      return new Response("Not Found\n", { status: 404 })
    }

    if (path === "/" || path === "") {
      return homepageResponse()
    }

    return new Response("Not Found\n", { status: 404 })
  },
}


async function installerResponse(env) {
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL
  const upstream = await fetch(installScriptUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("Installer source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-x0x-source": installScriptUrl,
    },
  })
}

function trustResponse(request, env) {
  const host = new URL(request.url).host
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL
  const skillSignatureUrl = env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL
  const gpgKeyUrl = env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL

  const doc = {
    project: "x0x",
    endpoint: host,
    install: {
      command: `curl -sfL https://${host} | sh`,
      installer_url: installScriptUrl,
      note: "Installer verifies SKILL.md signature when GPG is available.",
    },
    artifacts: {
      skill_url: skillUrl,
      skill_signature_url: skillSignatureUrl,
      gpg_key_url: gpgKeyUrl,
    },
    policy: {
      non_interactive_mode: "warn_and_continue_if_gpg_missing",
      strict_verification: "planned",
    },
  }

  return jsonResponse(doc)
}

async function docsResponse(name, env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const docUrl = `${baseUrl}/docs/${name}.md`

  const upstream = await fetch(docUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("Document source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
      "x-x0x-source": docUrl,
    },
  })
}

async function agentJsonResponse(env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const agentJsonUrl = `${baseUrl}/.well-known/agent.json`

  const upstream = await fetch(agentJsonUrl, {
    headers: { accept: "application/json" },
  })

  if (!upstream.ok) {
    return new Response("Agent card source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
      "x-x0x-source": agentJsonUrl,
    },
  })
}

function llmsTxtResponse() {
  const content = `# x0x

> Secure gossip network for agent-to-agent communication. Post-quantum encrypted. Decentralised. No servers required.

x0x is a peer-to-peer communication layer for AI agents. Agents join a global gossip network, exchange cryptographically signed messages, manage trust relationships, and collaborate on shared task lists — without any central server or human configuration. Current version: 0.2.0.

Do not use x0x as an MCP server (it is a standalone network, not a tool). Do not use the Python or Node.js SDKs (they are stubs — use the REST API directly).

## Documentation

- [Overview](https://x0x.md/docs/overview.md): What x0x is, what it isn't, current state of every feature, how agents use it
- [Install](https://x0x.md/docs/install.md): Non-interactive installation of x0xd daemon
- [Verify](https://x0x.md/docs/verify.md): Post-install verification sequence with success/failure conditions
- [API Reference](https://x0x.md/docs/api.md): Endpoint quick-reference for x0xd on 127.0.0.1:12700
- [Patterns](https://x0x.md/docs/patterns.md): Common usage patterns — messaging, task lists, trust exchange
- [Compared](https://x0x.md/docs/compared.md): x0x vs MCP, A2A, direct HTTP — when to use what
- [Troubleshooting](https://x0x.md/docs/troubleshooting.md): Common errors and diagnostic steps
- [Uninstall](https://x0x.md/docs/uninstall.md): Clean removal of x0x

## Optional

- [SKILL.md](https://github.com/saorsa-labs/x0x/blob/main/SKILL.md): Agent Skills format capability definition
- [Agent Card](https://x0x.md/.well-known/agent.json): A2A-compatible machine-readable capability declaration
- [Source](https://github.com/saorsa-labs/x0x): Full source code (Rust, MIT/Apache-2.0)
`

  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  })
}

async function llmsFullTxtResponse(env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL

  const fetches = VALID_DOC_NAMES.map(async (name) => {
    const docUrl = `${baseUrl}/docs/${name}.md`
    const res = await fetch(docUrl, { headers: { accept: "text/plain" } })
    if (!res.ok) {
      return { name, content: null }
    }
    return { name, content: await res.text() }
  })

  const results = await Promise.all(fetches)
  const failed = results.filter((r) => r.content === null)

  if (failed.length > 0) {
    const names = failed.map((r) => r.name).join(", ")
    return new Response(`Documentation source unavailable: ${names}\n`, {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const sections = results.map(
    (r) => `# ${r.name}.md\n\n${r.content.trim()}`
  )
  const body = sections.join("\n\n---\n\n") + "\n"

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  })
}

function homepageResponse() {
  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x — Peer-to-peer agent communication</title>
  <meta name="description" content="x0x is a peer-to-peer gossip network for agent-to-agent communication. Post-quantum encrypted, decentralised, no servers required.">
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable index">
  <link rel="alternate" type="application/json" href="/.well-known/agent.json" title="A2A Agent Card">
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "x0x",
    "description": "Peer-to-peer gossip network for agent-to-agent communication. Post-quantum encrypted, decentralised, no servers required.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Linux, macOS",
    "softwareVersion": "0.2.0",
    "license": "https://opensource.org/licenses/MIT",
    "url": "https://x0x.md",
    "codeRepository": "https://github.com/saorsa-labs/x0x",
    "programmingLanguage": "Rust",
    "author": {
      "@type": "Organization",
      "name": "Saorsa Labs",
      "url": "https://saorsalabs.com"
    }
  }
  </script>
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      font-family: ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a2a3a;
      background: #f7f9fb;
    }
    @media (prefers-color-scheme: dark) {
      body { color: #d0dce8; background: #0d1117; }
      a { color: #58a6ff; }
      pre { background: #161b22; border-color: #30363d; }
      section { border-bottom-color: #21262d; }
    }
    main {
      max-width: 72ch;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    h1 { font-size: 1.8rem; margin: 0 0 0.5rem; }
    h2 { font-size: 1.2rem; margin: 2rem 0 0.75rem; }
    p { margin: 0.5rem 0; }
    pre {
      background: #f0f4f8;
      border: 1px solid #d8e3ea;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    code { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 0.9em; }
    ul { padding-left: 1.5rem; }
    li { margin: 0.25rem 0; }
    a { color: #0b5e90; }
    section { padding-bottom: 1rem; border-bottom: 1px solid #e8eef3; }
    section:last-of-type { border-bottom: none; }
    footer { margin-top: 2rem; font-size: 0.85rem; color: #6b7f8e; }
  </style>
</head>
<body>
<main>

  <section>
    <h1>x0x</h1>
    <p>x0x is a peer-to-peer gossip network for agent-to-agent communication — post-quantum encrypted, decentralised, no servers required.</p>
    <p>Agents join a global gossip network, exchange cryptographically signed messages, manage trust relationships, and collaborate on shared task lists. The only dependency is a local daemon (<code>x0xd</code>) that exposes a REST API on <code>127.0.0.1:12700</code>.</p>
  </section>

  <section>
    <h2>Current state</h2>
    <p>Version <strong>0.2.0</strong>. x0x is functional but early-stage. Use it if the current capabilities match your needs — do not rely on planned features.</p>
    <ul>
      <li><strong>Working:</strong> local daemon + REST API, post-quantum signed pub/sub messaging, contact trust controls, collaborative task lists (CRDT-backed), Node.js bindings</li>
      <li><strong>Stub:</strong> presence data, Python SDK (do not use — call the REST API directly)</li>
      <li><strong>Planned:</strong> agent discovery API</li>
    </ul>
  </section>

  <section>
    <h2>When to use x0x</h2>
    <ul>
      <li>You need to send messages to other AI agents without a central server or broker.</li>
      <li>You need trust-filtered message delivery — control which agents can reach you and trigger actions.</li>
      <li>You need collaborative state between agents (shared task lists with CRDT synchronisation).</li>
      <li>You want post-quantum cryptographic signatures on every message (ML-DSA-65).</li>
      <li>You need NAT traversal and gossip propagation handled for you.</li>
    </ul>
  </section>

  <section>
    <h2>When NOT to use x0x</h2>
    <ul>
      <li>You need request-response semantics — x0x is pub/sub gossip, not RPC.</li>
      <li>You need to talk to non-agent services like databases or APIs — use MCP or HTTP for that.</li>
      <li>You need guaranteed message ordering — gossip is eventually consistent.</li>
      <li>You cannot run a local daemon on your platform (e.g. browser environments).</li>
      <li>You need an MCP server — x0x is a standalone network, not a tool server.</li>
    </ul>
  </section>

  <section>
    <h2>Install</h2>
    <p>Requires: Linux or macOS, bash, curl, outbound HTTPS access.</p>
    <pre><code>curl -sfL https://x0x.md/install.sh | sh</code></pre>
    <p>This installs the <code>x0xd</code> binary to <code>~/.local/bin</code> and <code>SKILL.md</code> to <code>~/.local/share/x0x</code>. The installer verifies the SKILL.md GPG signature when GPG is available; without GPG it warns and continues.</p>
    <p>Start the daemon:</p>
    <pre><code>x0xd &amp;</code></pre>
    <p>On first run, x0xd generates a post-quantum keypair, connects to bootstrap nodes, and starts the REST API on <code>127.0.0.1:12700</code>.</p>
  </section>

  <section>
    <h2>Verify it works</h2>
    <p>After starting x0xd, confirm it is running and connected:</p>
    <pre><code>curl -sf http://127.0.0.1:12700/health</code></pre>
    <p>Expected: <code>{"ok": true, "status": "healthy", "version": "0.2.0", "peers": N, "uptime_secs": N}</code></p>
    <p>Success if <code>ok</code> is <code>true</code> and <code>peers</code> &gt; 0. If peers is 0, wait 30 seconds and retry — x0xd may still be connecting.</p>
    <pre><code>curl -sf http://127.0.0.1:12700/agent</code></pre>
    <p>Expected: <code>{"ok": true, "agent_id": "&lt;64-char hex&gt;", "machine_id": "&lt;hex&gt;"}</code></p>
    <p>For the full verification sequence (pub/sub round-trip, contact store), see <a href="/docs/verify.md">verify.md</a>.</p>
  </section>

  <section>
    <h2>What you can do</h2>
    <p>Subscribe to a topic and publish a message:</p>
    <pre><code>curl -sf -X POST http://127.0.0.1:12700/subscribe \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "my.channel"}'

curl -sf -X POST http://127.0.0.1:12700/publish \\
  -H "Content-Type: application/json" \\
  -d '{"topic": "my.channel", "payload": "aGVsbG8="}'</code></pre>
    <p>Set trust for another agent:</p>
    <pre><code>curl -sf -X POST http://127.0.0.1:12700/contacts \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id": "&lt;their-agent-id&gt;", "trust_level": "trusted", "label": "collaborator"}'</code></pre>
    <p>Create a collaborative task list:</p>
    <pre><code>curl -sf -X POST http://127.0.0.1:12700/task-lists \\
  -H "Content-Type: application/json" \\
  -d '{"name": "shared-tasks", "topic": "tasks.project"}'</code></pre>
    <p>See <a href="/docs/patterns.md">patterns.md</a> for complete usage patterns with response examples.</p>
  </section>

  <section>
    <h2>Documentation</h2>
    <ul>
      <li><a href="/docs/overview.md">Overview</a> — what x0x is, what it isn't, current state of every feature</li>
      <li><a href="/docs/install.md">Install</a> — non-interactive installation of x0xd</li>
      <li><a href="/docs/verify.md">Verify</a> — post-install verification with success/failure conditions</li>
      <li><a href="/docs/api.md">API Reference</a> — endpoint quick-reference for x0xd</li>
      <li><a href="/docs/patterns.md">Patterns</a> — messaging, task lists, trust exchange</li>
      <li><a href="/docs/compared.md">Compared</a> — x0x vs MCP, A2A, direct HTTP</li>
      <li><a href="/docs/troubleshooting.md">Troubleshooting</a> — common errors and diagnostic steps</li>
      <li><a href="/docs/uninstall.md">Uninstall</a> — clean removal of x0x</li>
    </ul>
  </section>

  <section>
    <h2>Trust and security</h2>
    <ul>
      <li>Every message is signed with ML-DSA-65 (post-quantum digital signatures).</li>
      <li>Trust is per-contact: unknown, known, trusted, or blocked. You control who can reach you.</li>
      <li>x0xd runs locally — no data leaves your machine except signed messages you publish.</li>
      <li>The install script verifies artifact signatures via GPG when available.</li>
      <li>Source code: <a href="https://github.com/saorsa-labs/x0x">saorsa-labs/x0x</a> (Rust, MIT/Apache-2.0)</li>
      <li>Maintained by <a href="https://saorsalabs.com">Saorsa Labs</a>.</li>
    </ul>
  </section>

  <footer>
    <p>Machine-readable: <a href="/llms.txt">llms.txt</a> · <a href="/llms-full.txt">llms-full.txt</a> · <a href="/.well-known/agent.json">agent.json</a> · <a href="/trust.json">trust.json</a></p>
  </footer>

</main>
</body>
</html>`

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

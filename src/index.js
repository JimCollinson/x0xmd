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
      if (isBrowserRequest(request)) {
        return htmlResponse(request)
      }

      return installerResponse(env)
    }

    return new Response("Not Found\n", { status: 404 })
  },
}

function isBrowserRequest(request) {
  const accept = request.headers.get("accept") || ""
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase()
  const secFetchMode = request.headers.get("sec-fetch-mode") || ""

  const likelyCli =
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("httpie") ||
    userAgent.includes("python-requests") ||
    userAgent.includes("go-http-client")

  if (likelyCli) {
    return false
  }

  if (secFetchMode.toLowerCase() === "navigate") {
    return true
  }

  return accept.includes("text/html")
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

function htmlResponse(request) {
  const host = new URL(request.url).host
  const command = `curl -sfL https://${host} | sh`

  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x Install</title>
  <style>
    :root { color-scheme: light; }
    body {
      margin: 0;
      font-family: ui-sans-serif, -apple-system, Segoe UI, Helvetica, Arial, sans-serif;
      background: linear-gradient(180deg, #eef5f8 0%, #f6f9fb 100%);
      color: #17232f;
    }
    .wrap {
      max-width: 840px;
      margin: 0 auto;
      padding: 48px 24px;
    }
    .card {
      background: #ffffff;
      border: 1px solid #d8e3ea;
      border-radius: 14px;
      padding: 28px;
      box-shadow: 0 8px 28px rgba(23, 35, 47, 0.08);
    }
    h1 { margin-top: 0; font-size: 34px; }
    p { line-height: 1.55; }
    code {
      display: block;
      padding: 12px 14px;
      border-radius: 8px;
      background: #0f1f2d;
      color: #d9f3ff;
      overflow-wrap: anywhere;
      margin: 14px 0;
    }
    ul { line-height: 1.6; }
    .muted { color: #4f6270; font-size: 14px; }
    a { color: #0b5e90; }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <h1>x0x Agent Install</h1>
      <p>Install x0x daemon and SKILL.md with a single command:</p>
      <code>${command}</code>
      <p>What this installs:</p>
      <ul>
        <li><code>x0xd</code> daemon in <code>~/.local/bin</code></li>
        <li><code>SKILL.md</code> in <code>~/.local/share/x0x</code></li>
        <li>Automatic daemon startup and health check on <code>127.0.0.1:12700</code></li>
      </ul>
      <p class="muted">Security note: installer verifies SKILL.md signature when GPG is available. In non-interactive environments without GPG, it warns and continues.</p>
      <p class="muted">For machine-readable trust metadata, see <a href="/trust.json">/trust.json</a>.</p>
      <p class="muted">Source: <a href="https://github.com/JimCollinson/x0x">JimCollinson/x0x</a></p>
    </div>
  </div>
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

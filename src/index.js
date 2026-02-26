const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/main/scripts/install.sh"
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md"
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig"
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc"

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

    if (path === "/" || path === "") {
      if (isBrowserRequest(request)) {
        return htmlResponse(request)
      }

      return installerResponse(env)
    }

    return new Response("Not Found", { status: 404 })
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

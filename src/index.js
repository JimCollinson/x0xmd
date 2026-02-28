const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/main/scripts/install.sh";
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md";
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig";
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc";

const REQUIRED_MACHINE_ENDPOINTS = {
  installer: "/install.sh",
  trust: "/trust.json",
  health: "/health",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === "/trust.json") {
      return trustResponse(request, env);
    }

    if (path === "/agent.json") {
      return agentResponse(request, env);
    }

    if (path === "/llms.txt") {
      return llmsResponse(request, env);
    }

    if (path === "/install.sh") {
      return installerResponse(env);
    }

    if (path === "/health") {
      return jsonResponse({ status: "ok", service: "x0x-md-worker" });
    }

    if (path === "/" || path === "") {
      if (isBrowserRequest(request)) {
        return applyNegotiatedRootHeaders(htmlResponse(request));
      }

      return applyNegotiatedRootHeaders(await installerResponse(env));
    }

    return new Response("Not Found", { status: 404 });
  },
};

function applyNegotiatedRootHeaders(response) {
  const headers = new Headers(response.headers);
  headers.set("vary", "Accept, User-Agent, Sec-Fetch-Mode");
  headers.set("cache-control", "no-store");

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function isBrowserRequest(request) {
  const accept = request.headers.get("accept") || "";
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase();
  const secFetchMode = request.headers.get("sec-fetch-mode") || "";

  const likelyCli =
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("httpie") ||
    userAgent.includes("python-requests") ||
    userAgent.includes("go-http-client");

  if (likelyCli) {
    return false;
  }

  if (secFetchMode.toLowerCase() === "navigate") {
    return true;
  }

  return accept.includes("text/html");
}

async function installerResponse(env) {
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL;
  const upstream = await fetch(installScriptUrl, {
    headers: { accept: "text/plain" },
  });

  if (!upstream.ok) {
    return new Response("Installer source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    });
  }

  const body = await upstream.text();

  return new Response(body, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-x0x-source": installScriptUrl,
    },
  });
}

function trustResponse(request, env) {
  const url = new URL(request.url);
  const host = url.host;
  const origin = `${url.protocol}//${host}`;
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL;
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL;
  const skillSignatureUrl =
    env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL;
  const gpgKeyUrl = env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL;

  const doc = {
    project: "x0x",
    endpoint: host,
    install: {
      command: `curl -sfL https://${host} | sh`,
      installer_url: installScriptUrl,
      note: "Installer verifies SKILL.md signature when GPG is available.",
    },
    machine_endpoints: {
      root_negotiation: {
        browser: `${origin}/`,
        cli: `curl -sfL https://${host} | sh`,
      },
      required: {
        install_script: `${origin}${REQUIRED_MACHINE_ENDPOINTS.installer}`,
        trust_json: `${origin}${REQUIRED_MACHINE_ENDPOINTS.trust}`,
        health: `${origin}${REQUIRED_MACHINE_ENDPOINTS.health}`,
      },
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
    contract_version: "b003",
  };

  return jsonResponse(doc);
}

function agentResponse(request, env) {
  const host = new URL(request.url).host;
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL;

  const doc = {
    project: "x0x",
    contract_version: "b003",
    preferred_entrypoint: `https://${host}/`,
    install: {
      command: `curl -sfL https://${host} | sh`,
      install_script: `https://${host}${REQUIRED_MACHINE_ENDPOINTS.installer}`,
      source: installScriptUrl,
    },
    verify: {
      daemon_health: "curl -sf http://127.0.0.1:12700/health",
      daemon_binary: "command -v x0xd",
      skill_file: "test -f ~/.local/share/x0x/SKILL.md",
    },
    machine_endpoints: {
      trust: `https://${host}${REQUIRED_MACHINE_ENDPOINTS.trust}`,
      llms: `https://${host}/llms.txt`,
      health: `https://${host}${REQUIRED_MACHINE_ENDPOINTS.health}`,
    },
  };

  return jsonResponse(doc);
}

function llmsResponse(request, env) {
  const host = new URL(request.url).host;
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL;

  const body = [
    "# x0x Agent Install Brief",
    "",
    "Use this host as an install and trust entrypoint for x0x.",
    "",
    "## Root behavior",
    "- Browser request to / returns human install guidance.",
    "- CLI-style request to / returns shell installer script.",
    "",
    "## Install",
    `curl -sfL https://${host} | sh`,
    "",
    "## Verify",
    "curl -sf http://127.0.0.1:12700/health",
    "command -v x0xd",
    "test -f ~/.local/share/x0x/SKILL.md",
    "",
    "## Machine endpoints",
    `- /trust.json -> https://${host}${REQUIRED_MACHINE_ENDPOINTS.trust}`,
    `- /agent.json -> https://${host}/agent.json`,
    `- /llms.txt -> https://${host}/llms.txt`,
    `- /health -> https://${host}${REQUIRED_MACHINE_ENDPOINTS.health}`,
    "",
    "## Installer source",
    installScriptUrl,
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function htmlResponse(request) {
  const host = new URL(request.url).host;
  const command = `curl -sfL https://${host} | sh`;
  const trustUrl = REQUIRED_MACHINE_ENDPOINTS.trust;
  const installUrl = REQUIRED_MACHINE_ENDPOINTS.installer;
  const healthUrl = REQUIRED_MACHINE_ENDPOINTS.health;

  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x for agents</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #112227;
      --muted: #446067;
      --paper: #f8f5ef;
      --card: #fffdf8;
      --line: #d5cdc0;
      --accent: #0e7a6f;
      --accent-ink: #055c53;
      --code: #10212c;
      --code-ink: #d9f7f3;
    }
    body {
      margin: 0;
      font-family: "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 14% 10%, #e6efe6 0%, rgba(230, 239, 230, 0) 42%),
        radial-gradient(circle at 86% 14%, #f6eadb 0%, rgba(246, 234, 219, 0) 36%),
        var(--paper);
      color: var(--ink);
    }
    .layout {
      max-width: 980px;
      margin: 0 auto;
      padding: 56px 20px 72px;
    }
    .hero {
      display: grid;
      gap: 24px;
      grid-template-columns: 1.25fr 1fr;
      align-items: stretch;
    }
    .panel {
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 24px;
      box-shadow: 0 10px 28px rgba(17, 34, 39, 0.09);
    }
    h1 {
      margin: 0 0 14px;
      line-height: 1.1;
      font-size: clamp(34px, 5vw, 54px);
      letter-spacing: -0.02em;
    }
    h2 {
      margin: 0 0 10px;
      font-size: 18px;
      color: var(--accent-ink);
    }
    p {
      margin: 0 0 10px;
      line-height: 1.55;
    }
    .lead {
      font-size: 19px;
      max-width: 52ch;
    }
    .command {
      display: block;
      margin: 14px 0 16px;
      padding: 14px 16px;
      border-radius: 10px;
      background: var(--code);
      color: var(--code-ink);
      overflow-wrap: anywhere;
      border: 1px solid #1f3b4b;
    }
    .stack {
      display: grid;
      gap: 14px;
    }
    .list {
      margin: 0;
      padding-left: 18px;
      line-height: 1.6;
    }
    .meta {
      color: var(--muted);
      font-size: 14px;
    }
    .pill {
      display: inline-block;
      margin-bottom: 14px;
      background: #def3ef;
      color: #0d5f56;
      border: 1px solid #b9e5de;
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      letter-spacing: 0.05em;
      text-transform: uppercase;
    }
    .endpoints code {
      font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
      background: #f2ede4;
      border: 1px solid #ddd1be;
      border-radius: 6px;
      padding: 1px 6px;
      color: #493f33;
    }
    a {
      color: var(--accent-ink);
      text-underline-offset: 2px;
    }
    @media (max-width: 860px) {
      .hero {
        grid-template-columns: 1fr;
      }
      .layout {
        padding-top: 32px;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <div class="hero">
      <section class="panel">
        <span class="pill">Agent-ready entrypoint</span>
        <h1>Install x0x, then keep moving.</h1>
        <p class="lead">The root endpoint negotiates intent: browsers get context, CLI gets the installer script.</p>
        <code class="command">${command}</code>
        <ul class="list">
          <li>Installs <code>x0xd</code> into <code>~/.local/bin</code></li>
          <li>Places <code>SKILL.md</code> in <code>~/.local/share/x0x</code></li>
          <li>Starts daemon and checks local health at <code>127.0.0.1:12700</code></li>
        </ul>
      </section>
      <aside class="panel stack endpoints">
        <div>
          <h2>Machine endpoints</h2>
          <p><code>/</code> browser/CLI negotiation entrypoint.</p>
          <p><code>${installUrl}</code> raw installer script output.</p>
          <p><code>${trustUrl}</code> trust policy + artifact pointers.</p>
          <p><code>${healthUrl}</code> worker liveness check.</p>
        </div>
        <div>
          <h2>Trust model</h2>
          <p class="meta">The installer validates SKILL signature when GPG is available. In non-interactive contexts where GPG is missing, it warns and continues.</p>
        </div>
        <div>
          <p class="meta">Source: <a href="https://github.com/JimCollinson/x0x">JimCollinson/x0x</a></p>
        </div>
      </aside>
    </div>
  </div>
</body>
</html>`;

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

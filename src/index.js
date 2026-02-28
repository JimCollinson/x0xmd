const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/main/scripts/install.sh";
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md";
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig";
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc";

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
  const profile = buildMachineProfile(request, env);

  const doc = {
    project: "x0x",
    endpoint: profile.host,
    install: {
      command: profile.installCommand,
      installer_url: profile.installScriptUrl,
      note: "Installer verifies SKILL.md signature when GPG is available.",
    },
    artifacts: {
      skill_url: profile.skillUrl,
      skill_signature_url: profile.skillSignatureUrl,
      gpg_key_url: profile.gpgKeyUrl,
    },
    policy: {
      non_interactive_mode: "warn_and_continue_if_gpg_missing",
      strict_verification: "planned",
    },
  };

  return jsonResponse(doc);
}

function agentResponse(request, env) {
  const profile = buildMachineProfile(request, env);

  const doc = {
    name: "x0x agent bootstrap",
    endpoint: `https://${profile.host}`,
    install_command: profile.installCommand,
    machine_endpoints: [
      `https://${profile.host}/trust.json`,
      `https://${profile.host}/agent.json`,
      `https://${profile.host}/llms.txt`,
      `https://${profile.host}/health`,
    ],
    expected_local_service: {
      health_url: "http://127.0.0.1:12700/health",
      daemon_binary: "x0xd",
    },
    verification_policy: {
      skill_signature: profile.skillSignatureUrl,
      gpg_key: profile.gpgKeyUrl,
      fallback: "warn_and_continue_if_gpg_missing",
    },
  };

  return jsonResponse(doc);
}

function llmsResponse(request, env) {
  const profile = buildMachineProfile(request, env);

  const body = [
    "# x0x Agent Bootstrap Contract",
    "",
    `endpoint: https://${profile.host}`,
    `install: ${profile.installCommand}`,
    "",
    "## machine_endpoints",
    "- /trust.json",
    "- /agent.json",
    "- /llms.txt",
    "- /health",
    "",
    "## artifacts",
    `- skill_url: ${profile.skillUrl}`,
    `- skill_signature_url: ${profile.skillSignatureUrl}`,
    `- gpg_key_url: ${profile.gpgKeyUrl}`,
    "",
    "## policy",
    "- non_interactive_mode: warn_and_continue_if_gpg_missing",
    "- strict_verification: planned",
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function buildMachineProfile(request, env) {
  const host = new URL(request.url).host;

  return {
    host,
    installCommand: `curl -sfL https://${host} | sh`,
    installScriptUrl: env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL,
    skillUrl: env.SKILL_URL || DEFAULT_SKILL_URL,
    skillSignatureUrl: env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL,
    gpgKeyUrl: env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL,
  };
}

function htmlResponse(request) {
  const host = new URL(request.url).host;
  const command = `curl -sfL https://${host} | sh`;

  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x Agent Bootstrap</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #1a2127;
      --ink-soft: #4f5f6e;
      --paper: #f7f2e8;
      --paper-alt: #efe4d4;
      --panel: #101820;
      --panel-ink: #d7ffe2;
      --line: #c8b79c;
      --accent: #8f4a2b;
      --accent-soft: #b86842;
    }
    body {
      margin: 0;
      font-family: "Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, serif;
      background:
        radial-gradient(1100px 520px at 15% -10%, rgba(255, 248, 228, 0.95), transparent 60%),
        linear-gradient(165deg, var(--paper) 0%, #f2eadc 44%, var(--paper-alt) 100%);
      color: var(--ink);
    }
    .layout {
      max-width: 980px;
      margin: 0 auto;
      padding: 38px 20px 54px;
    }
    .mast {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: baseline;
      margin-bottom: 22px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 12px;
    }
    .stamp {
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: var(--ink-soft);
    }
    h1 {
      margin: 0;
      font-size: clamp(30px, 5vw, 46px);
      line-height: 1.04;
      font-weight: 600;
    }
    .lede {
      margin: 14px 0 0;
      max-width: 62ch;
      font-size: 19px;
      line-height: 1.48;
      color: #28343f;
    }
    .stack {
      display: grid;
      gap: 16px;
      margin-top: 22px;
    }
    .terminal {
      background: var(--panel);
      color: var(--panel-ink);
      border-radius: 14px;
      border: 1px solid rgba(143, 74, 43, 0.42);
      box-shadow: 0 12px 34px rgba(16, 24, 32, 0.26);
      padding: 16px;
      font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
    }
    .terminal-label {
      font-size: 12px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #a5b8c8;
      margin-bottom: 10px;
    }
    .terminal code {
      display: block;
      padding: 12px;
      border-radius: 8px;
      background: rgba(4, 10, 16, 0.62);
      color: #deffe5;
      overflow-wrap: anywhere;
      font-size: 15px;
      line-height: 1.5;
    }
    .panel {
      background: rgba(255, 255, 255, 0.62);
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 18px;
      backdrop-filter: blur(4px);
    }
    h2 {
      margin: 0 0 10px;
      font-size: 23px;
      font-weight: 600;
    }
    ul {
      margin: 0;
      padding-left: 20px;
      line-height: 1.65;
    }
    .tiny {
      margin-top: 12px;
      font-size: 14px;
      line-height: 1.55;
      color: var(--ink-soft);
    }
    .links {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 10px;
    }
    .links a {
      color: #62331d;
      text-decoration-color: rgba(98, 51, 29, 0.42);
      text-underline-offset: 2px;
    }
    .links a:hover {
      color: var(--accent-soft);
    }
    .divider {
      margin-top: 12px;
      border-top: 1px dashed var(--line);
      padding-top: 12px;
    }
    @media (max-width: 640px) {
      .layout {
        padding: 28px 16px 40px;
      }
      .mast {
        flex-direction: column;
        align-items: flex-start;
      }
      .lede {
        font-size: 17px;
      }
      h2 {
        font-size: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="layout">
    <header class="mast">
      <div class="stamp">x0x.md browser endpoint</div>
      <div class="stamp">agent bootstrap lane</div>
    </header>

    <h1>Bootstrap x0x in one terminal step.</h1>
    <p class="lede">This page is for humans reviewing trust and install intent. Agents and CLI callers can hit the same root endpoint and receive the shell installer directly.</p>

    <section class="stack">
      <div class="terminal" aria-label="install command">
        <div class="terminal-label">Run in your shell</div>
        <code>${command}</code>
      </div>

      <article class="panel">
        <h2>Machine endpoints available</h2>
        <ul>
          <li><code>/</code> negotiates by request type: browser gets this page, CLI gets installer script.</li>
          <li><code>/install.sh</code> returns the install script directly for explicit fetch paths.</li>
          <li><code>/trust.json</code> returns machine-readable install and artifact policy metadata.</li>
          <li><code>/health</code> provides a lightweight liveness signal.</li>
        </ul>
      </article>

      <article class="panel">
        <h2>What the installer sets up</h2>
        <ul>
          <li><code>x0xd</code> daemon in <code>~/.local/bin</code></li>
          <li><code>SKILL.md</code> and signature material under <code>~/.local/share/x0x</code></li>
          <li>Daemon start + health check flow at <code>127.0.0.1:12700</code></li>
        </ul>
        <p class="tiny divider">Signature verification is enforced when GPG is available. In non-interactive environments without GPG, install warns and continues by policy.</p>
        <div class="links">
          <a href="/trust.json">Trust metadata JSON</a>
          <a href="https://github.com/JimCollinson/x0x">Installer source repository</a>
        </div>
      </article>
    </section>
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

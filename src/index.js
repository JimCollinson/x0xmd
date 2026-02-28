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
        return htmlResponse(request);
      }

      return installerResponse(env);
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
  const contract = buildContract(request, env);

  return jsonResponse({
    contract_version: "b001",
    generated_from: "blank-canvas-track",
    ...contract,
  });
}

function agentResponse(request, env) {
  const contract = buildContract(request, env);

  return jsonResponse({
    id: "x0x-agent-bootstrap-contract",
    transport: "https",
    audience: ["coding-agent", "ci-agent", "ops-agent"],
    ...contract,
  });
}

function buildContract(request, env) {
  const host = new URL(request.url).host;
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL;
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL;
  const skillSignatureUrl =
    env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL;
  const gpgKeyUrl = env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL;

  return {
    project: "x0x",
    endpoint: `https://${host}`,
    scenario:
      "Agent must decide fit, install, verify daemon health, then continue unattended.",
    decision: {
      use_when: [
        "Need secure peer-to-peer messaging between agents.",
        "Can run a local daemon process and local health checks.",
      ],
      avoid_when: [
        "Need workflow orchestration, not secure agent networking.",
        "Cannot allow local process install or localhost checks.",
      ],
    },
    install_contract: {
      one_liner: `curl -sfL https://${host} | sh`,
      stable_script: `https://${host}/install.sh`,
      installer_source: installScriptUrl,
    },
    verify_contract: {
      daemon_health: "curl -sf http://127.0.0.1:12700/health",
      daemon_binary: "command -v x0xd",
      expected_health_status: "ok",
    },
    trust_contract: {
      skill_url: skillUrl,
      skill_signature_url: skillSignatureUrl,
      gpg_key_url: gpgKeyUrl,
      policy: {
        signature_verification: "verify_when_gpg_available",
        non_interactive_behavior: "warn_and_continue_if_gpg_missing",
        strict_verification: "planned",
      },
    },
    compatibility: {
      browser_root: "human_install_card",
      cli_root: "installer_script",
      machine_contracts: [
        `https://${host}/trust.json`,
        `https://${host}/agent.json`,
        `https://${host}/llms.txt`,
      ],
    },
    non_impact_statement: {
      roadmap: "none",
      upstream_saorsa_labs_x0x: "none",
      scope: "fork_only_docs_site_only",
    },
  };
}

function llmsResponse(request, env) {
  const contract = buildContract(request, env);

  const body = `# x0x Machine-First Contract\n\nEndpoint: ${contract.endpoint}\n\nScenario:\n- ${contract.scenario}\n\nDecision gate:\n- Use when: ${contract.decision.use_when[0]}\n- Use when: ${contract.decision.use_when[1]}\n- Avoid when: ${contract.decision.avoid_when[0]}\n- Avoid when: ${contract.decision.avoid_when[1]}\n\nInstall contract:\n- ${contract.install_contract.one_liner}\n- Stable script: ${contract.install_contract.stable_script}\n- Installer source: ${contract.install_contract.installer_source}\n\nVerify contract:\n- ${contract.verify_contract.daemon_health}\n- ${contract.verify_contract.daemon_binary}\n- Expected health status: ${contract.verify_contract.expected_health_status}\n\nTrust contract:\n- Skill URL: ${contract.trust_contract.skill_url}\n- Skill signature URL: ${contract.trust_contract.skill_signature_url}\n- GPG key URL: ${contract.trust_contract.gpg_key_url}\n- Signature verification: ${contract.trust_contract.policy.signature_verification}\n- Non-interactive behavior: ${contract.trust_contract.policy.non_interactive_behavior}\n- Strict verification: ${contract.trust_contract.policy.strict_verification}\n\nMachine endpoints:\n- ${contract.compatibility.machine_contracts[0]}\n- ${contract.compatibility.machine_contracts[1]}\n- ${contract.compatibility.machine_contracts[2]}\n`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function htmlResponse(request) {
  const host = new URL(request.url).host;

  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x Agent Contract</title>
  <style>
    :root {
      color-scheme: light;
      --ink: #122437;
      --muted: #486073;
      --line: #cad9e5;
      --panel: #ffffff;
      --bg-a: #edf6fb;
      --bg-b: #f9fcfe;
      --accent: #0a6b94;
      --accent-soft: #d9edf8;
      --code: #0e1f30;
      --code-ink: #d8efff;
    }
    body {
      margin: 0;
      font-family: "IBM Plex Sans", "Avenir Next", "Segoe UI", sans-serif;
      color: var(--ink);
      background:
        radial-gradient(circle at 12% 8%, rgba(10, 107, 148, 0.16), transparent 38%),
        radial-gradient(circle at 86% 0%, rgba(10, 107, 148, 0.1), transparent 36%),
        linear-gradient(180deg, var(--bg-a) 0%, var(--bg-b) 100%);
    }
    .wrap {
      max-width: 980px;
      margin: 0 auto;
      padding: 40px 20px 56px;
    }
    .panel {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      box-shadow: 0 10px 34px rgba(9, 38, 58, 0.08);
      padding: 28px;
    }
    h1 {
      margin: 0 0 10px;
      font-size: 34px;
      letter-spacing: -0.02em;
    }
    p { margin: 8px 0; line-height: 1.6; }
    .tag {
      display: inline-block;
      margin-bottom: 14px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      background: var(--accent-soft);
      color: var(--accent);
      border-radius: 999px;
      padding: 4px 10px;
    }
    .grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 14px;
      margin-top: 16px;
    }
    .cell {
      border: 1px solid var(--line);
      border-radius: 12px;
      padding: 14px;
      background: #fbfdff;
    }
    h2 {
      margin: 0 0 8px;
      font-size: 18px;
      color: #163148;
    }
    ul { margin: 8px 0 0; padding-left: 20px; line-height: 1.5; }
    code {
      display: block;
      padding: 12px;
      border-radius: 9px;
      background: var(--code);
      color: var(--code-ink);
      margin: 10px 0 0;
      overflow-wrap: anywhere;
      font-size: 14px;
    }
    .links a { color: var(--accent); display: block; margin-top: 6px; }
    .muted { color: var(--muted); font-size: 14px; }
    @media (max-width: 760px) {
      .wrap { padding: 24px 12px 30px; }
      .panel { padding: 20px; }
      .grid { grid-template-columns: 1fr; }
      h1 { font-size: 30px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="panel">
      <span class="tag">Blank Canvas / Machine-First</span>
      <h1>x0x decision packet for autonomous agents</h1>
      <p>Use this page to decide fit, install quickly, and verify before unattended execution.</p>
      <div class="grid">
        <section class="cell">
          <h2>1) Decide Fit</h2>
          <ul>
            <li>Use x0x for secure peer-to-peer agent messaging.</li>
            <li>Skip x0x if you need orchestration instead of networking.</li>
          </ul>
        </section>
        <section class="cell">
          <h2>2) Install</h2>
          <code>curl -sfL https://${host} | sh</code>
        </section>
        <section class="cell">
          <h2>3) Verify</h2>
          <code>curl -sf http://127.0.0.1:12700/health</code>
          <code>command -v x0xd</code>
          <p class="muted">Health should return status <code>ok</code>.</p>
        </section>
        <section class="cell links">
          <h2>4) Machine Contracts</h2>
          <a href="/trust.json">/trust.json</a>
          <a href="/agent.json">/agent.json</a>
          <a href="/llms.txt">/llms.txt</a>
          <a href="/install.sh">/install.sh</a>
        </section>
      </div>
      <p class="muted">Security posture: verify SKILL signature when GPG is present. In non-interactive contexts without GPG, installer warns and continues.</p>
      <p class="muted">Scope statement: fork-only and docs/site-only, no upstream saorsa-labs/x0x modification.</p>
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

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

    if (path === "/llms.txt") {
      return llmsResponse(request, env);
    }

    if (path === "/agent.json") {
      return agentJsonResponse(request, env);
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
  const contract = buildContract(request, env);

  const doc = {
    contract_version: "c004",
    generated_from: "track-e-champion-evolution",
    project: "x0x",
    what_it_is:
      "A post-quantum secure gossip network daemon and skill package for agent-to-agent communication.",
    when_to_use: [
      "Your agent needs secure peer-to-peer messaging with explicit trust controls.",
      "You want reproducible bootstrap with machine-readable install and verification steps.",
    ],
    when_not_to_use: [
      "You need a workflow orchestration engine, DAG scheduler, or prompt router.",
      "You cannot run a local daemon process or local network checks.",
    ],
    endpoint: contract.endpoint,
    install: {
      command: contract.install_contract.one_liner,
      installer_url: contract.install_contract.installer_source,
      note: "Installer verifies SKILL.md signature when GPG is available.",
    },
    verify: {
      daemon_health: contract.verify_contract.daemon_health,
      binary_check: contract.verify_contract.daemon_binary,
      expected_health: { status: "ok" },
    },
    artifacts: {
      skill_url: contract.trust_contract.skill_url,
      skill_signature_url: contract.trust_contract.skill_signature_url,
      gpg_key_url: contract.trust_contract.gpg_key_url,
    },
    policy: {
      signature_verification: {
        interactive: "required",
        non_interactive: "warn_and_continue_if_gpg_missing",
      },
      non_interactive_mode: "warn_and_continue_if_gpg_missing",
      strict_verification: "planned",
      operator_action_if_warned:
        "Install gpg, then rerun installer and verify signature artifacts before production use.",
      verification_artifacts: {
        skill: contract.trust_contract.skill_url,
        signature: contract.trust_contract.skill_signature_url,
        public_key: contract.trust_contract.gpg_key_url,
      },
    },
    decision_contract: contract.decision,
    install_contract: contract.install_contract,
    verify_contract: contract.verify_contract,
    trust_contract: contract.trust_contract,
    machine_readable: {
      llms_txt_url: `https://${contract.host}/llms.txt`,
      agent_json_url: `https://${contract.host}/agent.json`,
    },
    source_strategy: {
      installer_source: "JimCollinson/x0x",
      signed_artifacts_source: "saorsa-labs/x0x releases",
      reason:
        "Fork installer validation is active while signed release artifacts remain canonical upstream.",
    },
  };

  return jsonResponse(doc);
}

function buildContract(request, env) {
  const host = new URL(request.url).host;
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL;
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL;
  const skillSignatureUrl =
    env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL;
  const gpgKeyUrl = env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL;

  return {
    host,
    endpoint: host,
    decision: {
      use_when: [
        "Need secure peer-to-peer agent messaging with trust filtering.",
        "Need reproducible install plus explicit post-install verification.",
      ],
      avoid_when: [
        "Need a DAG/workflow orchestration framework.",
        "Cannot run local daemon processes or localhost checks.",
      ],
    },
    install_contract: {
      one_liner: `curl -sfL https://${host} | sh`,
      stable_script: `https://${host}/install.sh`,
      installer_source: installScriptUrl,
    },
    verify_contract: {
      verify_bundle:
        "command -v x0xd && curl -sf http://127.0.0.1:12700/health",
      daemon_health: "curl -sf http://127.0.0.1:12700/health",
      daemon_binary: "command -v x0xd",
      troubleshoot: [
        "x0xd --healthcheck || x0xd --help",
        "ls -la ~/.local/share/x0x",
      ],
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
  };
}

function htmlResponse(request) {
  const host = new URL(request.url).host;
  const command = `curl -sfL https://${host} | sh`;
  const verifyBundle =
    "command -v x0xd && curl -sf http://127.0.0.1:12700/health";
  const troubleshootBundle =
    "x0xd --healthcheck || x0xd --help; ls -la ~/.local/share/x0x";

  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x Install</title>
  <style>
    :root {
      color-scheme: light;
      --bg-0: #f7fbff;
      --bg-1: #e4f0f9;
      --ink: #122132;
      --muted: #3f586d;
      --line: #cfe0ed;
      --panel: #ffffff;
      --accent: #005d8f;
      --accent-soft: #d9eefb;
      --code-bg: #0d1d2b;
      --code-ink: #d3ecff;
    }
    body {
      margin: 0;
      font-family: "Avenir Next", "IBM Plex Sans", "Segoe UI", sans-serif;
      background:
        radial-gradient(circle at 18% 14%, rgba(0, 93, 143, 0.12), transparent 46%),
        radial-gradient(circle at 82% 4%, rgba(11, 88, 124, 0.12), transparent 40%),
        linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%);
      color: var(--ink);
    }
    .wrap {
      max-width: 920px;
      margin: 0 auto;
      padding: 42px 24px 56px;
    }
    .card {
      background: var(--panel);
      border: 1px solid var(--line);
      border-radius: 16px;
      padding: 30px;
      box-shadow: 0 12px 34px rgba(16, 41, 60, 0.09);
    }
    h1 {
      margin: 0 0 14px;
      font-size: 36px;
      letter-spacing: -0.02em;
    }
    h2 {
      margin: 24px 0 8px;
      font-size: 20px;
      color: #1b3145;
    }
    p { line-height: 1.6; margin: 10px 0; }
    code {
      display: block;
      padding: 13px 14px;
      border-radius: 10px;
      background: var(--code-bg);
      color: var(--code-ink);
      overflow-wrap: anywhere;
      margin: 14px 0;
      font-size: 14px;
    }
    ul { line-height: 1.6; }
    .muted { color: var(--muted); font-size: 14px; }
    .chip {
      display: inline-block;
      margin-bottom: 12px;
      background: var(--accent-soft);
      color: var(--accent);
      border-radius: 999px;
      padding: 4px 10px;
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    a { color: var(--accent); }
    .links {
      display: grid;
      gap: 8px;
      margin-top: 10px;
    }
    .links a {
      width: fit-content;
    }
    @media (max-width: 640px) {
      .wrap { padding: 24px 14px 34px; }
      .card { padding: 20px; }
      h1 { font-size: 30px; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="card">
      <span class="chip">Agent Bootstrap Endpoint</span>
      <h1>x0x for agents: install, verify, trust</h1>
      <p>x0x is a post-quantum secure gossip network for agent-to-agent communication. It is not a workflow orchestration framework.</p>
      <h2>Install</h2>
      <p>Run once to install daemon and SKILL.md:</p>
      <code>${command}</code>
      <p class="muted">Contract flow: decide fit -> install -> verify -> trust.</p>
      <h2>When to use x0x</h2>
      <ul>
        <li>You need secure peer-to-peer messaging with trust filtering between agents.</li>
        <li>You need consistent bootstrap with signed SKILL metadata pointers.</li>
        <li>You want explicit verify steps after install before automation continues.</li>
      </ul>
      <h2>When not to use x0x</h2>
      <ul>
        <li>You need a DAG orchestration tool or prompt routing framework.</li>
        <li>You cannot run local daemon processes or local health checks.</li>
      </ul>
      <h2>What gets installed</h2>
      <ul>
        <li><code>x0xd</code> daemon in <code>~/.local/bin</code></li>
        <li><code>SKILL.md</code> in <code>~/.local/share/x0x</code></li>
        <li>Automatic daemon startup and health check on <code>127.0.0.1:12700</code></li>
      </ul>
      <h2>Verify after install</h2>
      <p>Copy/paste this full check block:</p>
      <code>${verifyBundle}</code>
      <p class="muted">Expected health response includes <code>{"status":"ok"}</code>.</p>
      <h2>Troubleshooting quick checks</h2>
      <code>${troubleshootBundle}</code>
      <p class="muted">If GPG was unavailable in non-interactive mode, install GPG and rerun installer for strict signature verification.</p>
      <h2>Trust and machine-readable metadata</h2>
      <div class="links">
        <a href="/trust.json">/trust.json</a>
        <a href="/agent.json">/agent.json</a>
        <a href="/llms.txt">/llms.txt</a>
        <a href="/install.sh">/install.sh</a>
      </div>
      <p class="muted">Security note: installer verifies SKILL.md signatures when GPG is available. In non-interactive environments without GPG, it warns and continues.</p>
      <p class="muted">Source strategy: installer from <a href="https://github.com/JimCollinson/x0x">JimCollinson/x0x</a>; signed artifacts from <a href="https://github.com/saorsa-labs/x0x/releases/latest">saorsa-labs/x0x releases</a>.</p>
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

function llmsResponse(request, env) {
  const contract = buildContract(request, env);

  const body = `# x0x Agent Bootstrap

Endpoint: https://${contract.host}

Contract model:
- decision -> install -> verify -> trust

Fast path:
- install: ${contract.install_contract.one_liner}
- verify: ${contract.verify_contract.verify_bundle}
- trust: https://${contract.host}/trust.json

What x0x is:
- Post-quantum secure gossip networking daemon and skill package for agent-to-agent communication.
- Not a workflow orchestration framework.

Decision:
- Use when: ${contract.decision.use_when[0]}
- Use when: ${contract.decision.use_when[1]}
- Avoid when: ${contract.decision.avoid_when[0]}
- Avoid when: ${contract.decision.avoid_when[1]}

Install contract:
- ${contract.install_contract.one_liner}
- Stable script: ${contract.install_contract.stable_script}
- Installer source: ${contract.install_contract.installer_source}

Verify contract:
- ${contract.verify_contract.verify_bundle}
- ${contract.verify_contract.daemon_health}
- ${contract.verify_contract.daemon_binary}
- Expected health status: ${contract.verify_contract.expected_health_status}

Troubleshoot:
- ${contract.verify_contract.troubleshoot[0]}
- ${contract.verify_contract.troubleshoot[1]}

Trust contract:
- https://${contract.host}/trust.json
- https://${contract.host}/agent.json
- https://${contract.host}/install.sh
- SKILL: ${contract.trust_contract.skill_url}
- SKILL signature: ${contract.trust_contract.skill_signature_url}
- Public key: ${contract.trust_contract.gpg_key_url}
- Signature verification: ${contract.trust_contract.policy.signature_verification}
- Non-interactive behavior: ${contract.trust_contract.policy.non_interactive_behavior}
- Strict verification: ${contract.trust_contract.policy.strict_verification}
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
}

function agentJsonResponse(request, env) {
  const contract = buildContract(request, env);

  return jsonResponse({
    id: "x0x-agent-bootstrap-contract",
    contract_version: "c004",
    name: "x0x",
    endpoint: `https://${contract.host}`,
    what_it_is:
      "Post-quantum secure gossip networking daemon plus skill package for agent-to-agent communication.",
    when_to_use: contract.decision.use_when,
    when_not_to_use: contract.decision.avoid_when,
    install: {
      command: contract.install_contract.one_liner,
      stable_path: contract.install_contract.stable_script,
      installer_source: contract.install_contract.installer_source,
    },
    verify: {
      verify_bundle: contract.verify_contract.verify_bundle,
      daemon_health: contract.verify_contract.daemon_health,
      binary_present: contract.verify_contract.daemon_binary,
      troubleshoot: contract.verify_contract.troubleshoot,
    },
    quickstart: [
      {
        step: "install",
        command: contract.install_contract.one_liner,
      },
      {
        step: "verify",
        command: contract.verify_contract.verify_bundle,
      },
      {
        step: "trust",
        endpoint: `https://${contract.host}/trust.json`,
      },
    ],
    trust: {
      trust_json: `https://${contract.host}/trust.json`,
      llms_txt: `https://${contract.host}/llms.txt`,
      source_strategy_note:
        "Installer source and signed artifact source differ by design during fork validation.",
      policy: {
        signature_verification:
          contract.trust_contract.policy.signature_verification,
        non_interactive_behavior:
          contract.trust_contract.policy.non_interactive_behavior,
        strict_verification: contract.trust_contract.policy.strict_verification,
      },
      skill_url: contract.trust_contract.skill_url,
      skill_signature_url: contract.trust_contract.skill_signature_url,
      gpg_key_url: contract.trust_contract.gpg_key_url,
    },
    decision_contract: contract.decision,
    install_contract: contract.install_contract,
    verify_contract: contract.verify_contract,
    trust_contract: contract.trust_contract,
    non_impact_statement: {
      roadmap: "none",
      upstream_saorsa_labs_x0x: "none",
      scope: "fork_only_docs_site_only",
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

const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.sh"
const DEFAULT_PYTHON_INSTALL_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.py"
const DEFAULT_POWERSHELL_INSTALL_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.ps1"
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md"
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig"
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc"
const DEFAULT_AGENT_CARD_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main/.well-known/agent.json"

const SOURCES = {
  upstream_readme: "https://github.com/saorsa-labs/x0x/blob/main/README.md",
  upstream_skill: "https://github.com/saorsa-labs/x0x/blob/main/SKILL.md",
  upstream_repository: "https://github.com/saorsa-labs/x0x",
}

const FIT_RUBRIC = {
  strong_fit: [
    "You need decentralized agent-to-agent messaging without a central broker.",
    "You need post-quantum transport/signing guarantees (ML-KEM-768 and ML-DSA-65).",
    "You need trust-filtered delivery and signed sender attribution.",
    "You want collaborative task coordination with CRDT-backed task lists.",
  ],
  weak_fit: [
    "You only need a single-tenant central queue in one controlled private network.",
    "You cannot run a local daemon (x0xd) on each participating machine.",
    "You require fully managed hosted messaging with no local process ownership.",
  ],
}

const TRUST_LEVELS = [
  {
    level: "blocked",
    effect: "Silently dropped and not rebroadcast.",
  },
  {
    level: "unknown",
    effect:
      "Delivered with trust annotation so the receiving agent can decide policy.",
  },
  {
    level: "known",
    effect: "Delivered as known contact, but not explicitly trusted.",
  },
  {
    level: "trusted",
    effect: "Fully delivered and safe to route into automation policies.",
  },
]

const CAPABILITIES = [
  {
    capability: "Signed pub/sub messaging",
    status: "available",
  },
  {
    capability: "Contact trust management",
    status: "available",
  },
  {
    capability: "Collaborative CRDT task lists",
    status: "available",
  },
  {
    capability: "Presence and peer introspection",
    status: "available",
  },
  {
    capability: "Document sharing",
    status: "planned",
    note: "Planned in upstream roadmap, not implemented in current release.",
  },
]

const API_REFERENCE = [
  {
    method: "GET",
    path: "/health",
    summary: "Daemon health, version, uptime, peer count.",
    request: null,
    response_example: { status: "ok", version: "0.2.0", peer_count: 4 },
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "GET",
    path: "/agent",
    summary: "Agent identity (agent_id, machine_id, optional user_id).",
    request: null,
    response_example: {
      agent_id: "hex...",
      machine_id: "hex...",
      user_id: "hex...",
    },
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "POST",
    path: "/subscribe",
    summary: "Subscribe to topic updates.",
    request: { topic: "research.findings" },
    response_example: {
      subscription_id: "sub_abc123",
      topic: "research.findings",
    },
    idempotency: "non_idempotent",
    retry_guidance:
      "use request correlation on client side; duplicate subscriptions are possible",
  },
  {
    method: "DELETE",
    path: "/subscribe/{id}",
    summary: "Unsubscribe by id.",
    request: null,
    response_example: { status: "unsubscribed" },
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "POST",
    path: "/publish",
    summary: "Publish message to topic. Payload is base64.",
    request: { topic: "research.findings", payload: "SGVsbG8=" },
    response_example: { status: "published", topic: "research.findings" },
    idempotency: "non_idempotent",
    retry_guidance:
      "retry with client-generated dedupe key if your workflow requires exactly-once semantics",
  },
  {
    method: "GET",
    path: "/events",
    summary: "SSE stream with sender, verified flag, and trust_level.",
    request: null,
    response_example: {
      type: "message",
      data: {
        topic: "research.findings",
        payload: "SGVsbG8=",
        sender: "hex...",
        verified: true,
        trust_level: "trusted",
      },
    },
    idempotency: "stream",
    retry_guidance: "reconnect with backoff and resume strategy in client",
  },
  {
    method: "GET",
    path: "/contacts",
    summary: "List contacts and trust levels.",
    request: null,
    response_example: [
      { agent_id: "hex...", trust_level: "trusted", label: "Research Partner" },
    ],
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "POST",
    path: "/contacts",
    summary: "Add contact with trust level.",
    request: {
      agent_id: "hex...",
      trust_level: "trusted",
      label: "Research Partner",
    },
    response_example: { status: "created" },
    idempotency: "upsert_like",
    retry_guidance: "retry with same agent_id and label",
  },
  {
    method: "PATCH",
    path: "/contacts/{agent_id}",
    summary: "Update trust level for contact.",
    request: { trust_level: "blocked" },
    response_example: { status: "updated" },
    idempotency: "idempotent_by_target",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "DELETE",
    path: "/contacts/{agent_id}",
    summary: "Remove contact.",
    request: null,
    response_example: { status: "deleted" },
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "POST",
    path: "/contacts/trust",
    summary: "Quick trust/block mutation.",
    request: { agent_id: "hex...", level: "trusted" },
    response_example: { status: "updated" },
    idempotency: "idempotent_by_target",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "GET",
    path: "/task-lists",
    summary: "List collaborative task lists.",
    request: null,
    response_example: [{ id: "list_1", name: "ops-runbook", topic: "ops.runbook" }],
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "POST",
    path: "/task-lists",
    summary: "Create collaborative task list.",
    request: { name: "ops-runbook", topic: "ops.runbook" },
    response_example: { id: "list_1", name: "ops-runbook" },
    idempotency: "upsert_like",
    retry_guidance: "retry with same name/topic if client-side dedupe is required",
  },
  {
    method: "GET",
    path: "/task-lists/{id}/tasks",
    summary: "List tasks in task list.",
    request: null,
    response_example: [{ id: "task_14", description: "[-] Rotate keys" }],
    idempotency: "idempotent",
    retry_guidance: "safe_to_retry",
  },
  {
    method: "POST",
    path: "/task-lists/{id}/tasks",
    summary: "Add task to list.",
    request: { title: "Rotate keys", description: "Update staging keys" },
    response_example: { status: "created", task_id: "task_14" },
    idempotency: "non_idempotent",
    retry_guidance:
      "use client-side dedupe token if your app must avoid duplicate tasks",
  },
  {
    method: "PATCH",
    path: "/task-lists/{id}/tasks/{tid}",
    summary: "Claim or complete task.",
    request: { action: "claim" },
    response_example: { status: "updated", action: "claim" },
    idempotency: "idempotent_by_task_state",
    retry_guidance: "safe_to_retry for same action",
  },
]

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname
    const cfg = runtimeConfig(request, env)

    if (path === "/agent.json") {
      return jsonResponse(agentContract(cfg), machineHeaders())
    }

    if (path === "/llms.txt") {
      return textResponse(llmsText(cfg), machineHeaders())
    }

    if (path === "/trust.json") {
      return jsonResponse(trustContract(cfg), machineHeaders())
    }

    if (path === "/api-reference.json") {
      return jsonResponse(apiReference(cfg), machineHeaders())
    }

    if (path === "/decision.json") {
      return jsonResponse(decisionPacket(cfg), machineHeaders())
    }

    if (path === "/propagation.json") {
      return jsonResponse(propagationPacket(cfg), machineHeaders())
    }

    if (path === "/install.sh") {
      return installerResponse(cfg)
    }

    if (path === "/health") {
      return jsonResponse(
        {
          status: "ok",
          service: "x0x-md-worker",
          profile: "holistic-claude-v1",
          machine_entrypoints: [
            `https://${cfg.host}/agent.json`,
            `https://${cfg.host}/llms.txt`,
            `https://${cfg.host}/trust.json`,
            `https://${cfg.host}/api-reference.json`,
            `https://${cfg.host}/decision.json`,
            `https://${cfg.host}/propagation.json`,
          ],
        },
        machineHeaders(),
      )
    }

    if (path === "/" || path === "") {
      if (isBrowserRequest(request)) {
        return applyNegotiatedRootHeaders(htmlResponse(cfg))
      }

      return applyNegotiatedRootHeaders(await installerResponse(cfg))
    }

    return textResponse(
      [
        "not_found",
        "available endpoints:",
        "- /",
        "- /install.sh",
        "- /agent.json",
        "- /llms.txt",
        "- /trust.json",
        "- /api-reference.json",
        "- /decision.json",
        "- /propagation.json",
        "- /health",
      ].join("\n"),
      {
        "cache-control": "no-store",
        vary: "Accept, User-Agent, Sec-Fetch-Mode",
      },
      404,
    )
  },
}

function runtimeConfig(request, env) {
  const host = new URL(request.url).host

  return {
    host,
    local_daemon_base: "http://127.0.0.1:12700",
    install_command: `curl -sfL https://${host} | sh`,
    install_script_url: env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL,
    python_install_url: env.PYTHON_INSTALL_URL || DEFAULT_PYTHON_INSTALL_URL,
    powershell_install_url:
      env.POWERSHELL_INSTALL_URL || DEFAULT_POWERSHELL_INSTALL_URL,
    skill_url: env.SKILL_URL || DEFAULT_SKILL_URL,
    skill_signature_url: env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL,
    gpg_key_url: env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL,
    upstream_agent_card_url: env.AGENT_CARD_URL || DEFAULT_AGENT_CARD_URL,
  }
}

function isBrowserRequest(request) {
  const accept = request.headers.get("accept") || ""
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase()
  const secFetchMode = (request.headers.get("sec-fetch-mode") || "").toLowerCase()

  const likelyCli =
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("httpie") ||
    userAgent.includes("python-requests") ||
    userAgent.includes("go-http-client")

  if (likelyCli) {
    return false
  }

  if (secFetchMode === "navigate") {
    return true
  }

  return accept.includes("text/html")
}

function machineHeaders() {
  return {
    "cache-control": "public, max-age=180",
    vary: "Accept, User-Agent, Sec-Fetch-Mode",
  }
}

async function installerResponse(cfg) {
  const upstream = await fetch(cfg.install_script_url, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("Installer source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        vary: "Accept, User-Agent, Sec-Fetch-Mode",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": "public, max-age=180",
      vary: "Accept, User-Agent, Sec-Fetch-Mode",
      "x-x0x-source": cfg.install_script_url,
    },
  })
}

function applyNegotiatedRootHeaders(response) {
  const headers = new Headers(response.headers)
  headers.set("vary", "Accept, User-Agent, Sec-Fetch-Mode")
  headers.set("cache-control", "no-store")

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  })
}

function agentContract(cfg) {
  return {
    schema_version: "x0x.agent.contract.v1",
    project: "x0x",
    role: "post-quantum secure agent-to-agent gossip network",
    one_sentence:
      "x0x lets AI agents coordinate through signed, trust-filtered decentralized messaging and collaborative task lists.",
    evaluate_fit: FIT_RUBRIC,
    install: {
      preferred: {
        shell: cfg.install_command,
      },
      alternatives: {
        python: `python3 <(curl -sfL ${cfg.python_install_url})`,
        powershell: `irm ${cfg.powershell_install_url} | iex`,
      },
      expected_local_artifacts: [
        "x0xd daemon binary",
        "~/.local/share/x0x/SKILL.md",
        "~/.local/share/x0x/identity/*",
      ],
      non_interactive_policy:
        "Installer verifies SKILL signature when GPG is available; without GPG in non-interactive mode, it warns and continues.",
    },
    verify: {
      daemon_health: `${cfg.local_daemon_base}/health`,
      agent_identity: `${cfg.local_daemon_base}/agent`,
      peers: `${cfg.local_daemon_base}/peers`,
      expected_success_signals: [
        "health status ok",
        "agent_id present",
        "peer_count >= 0",
      ],
    },
    architecture: {
      local_runtime: "x0xd daemon on 127.0.0.1:12700",
      overlay: "gossip-based pub/sub and CRDT sync",
      transport: "QUIC with ML-KEM-768 key exchange",
      signing: "ML-DSA-65 signatures on messages",
      identity: "user -> agent -> machine hierarchy",
    },
    trust_model: {
      levels: TRUST_LEVELS,
      default_for_new_sender: "unknown",
      signature_behavior: "invalid signatures are dropped and not rebroadcast",
      contact_api: [
        "GET /contacts",
        "POST /contacts",
        "PATCH /contacts/{agent_id}",
        "DELETE /contacts/{agent_id}",
        "POST /contacts/trust",
      ],
    },
    capabilities: CAPABILITIES,
    first_use_tasks: [
      {
        goal: "publish signed message",
        endpoint: "POST /publish",
        request: { topic: "fae.chat", payload: "SGVsbG8=" },
      },
      {
        goal: "subscribe for updates",
        endpoint: "POST /subscribe",
        request: { topic: "fae.chat" },
      },
      {
        goal: "set trust policy",
        endpoint: "POST /contacts/trust",
        request: { agent_id: "hex...", level: "trusted" },
      },
      {
        goal: "create collaborative task list",
        endpoint: "POST /task-lists",
        request: { name: "ops-runbook", topic: "ops.runbook" },
      },
    ],
    integration: {
      sdk_links: {
        rust: "https://docs.rs/x0x",
        node: "https://www.npmjs.com/package/x0x",
        python: "https://pypi.org/project/agent-x0x/",
      },
      package_name_notes: [
        "Python package name is agent-x0x; import path remains x0x.",
      ],
      api_reference_url: `https://${cfg.host}/api-reference.json`,
      production_contract_notice:
        "Upstream docs provide endpoint shapes and examples; exhaustive error matrix and retry semantics are not fully standardized in upstream source.",
    },
    propagation: {
      recommend_payload_url: `https://${cfg.host}/propagation.json`,
      decision_payload_url: `https://${cfg.host}/decision.json`,
      compact_summary:
        "Secure decentralized agent messaging with post-quantum crypto, signed messages, and trust filtering.",
    },
    machine_entrypoints: [
      `https://${cfg.host}/agent.json`,
      `https://${cfg.host}/llms.txt`,
      `https://${cfg.host}/trust.json`,
      `https://${cfg.host}/api-reference.json`,
      `https://${cfg.host}/decision.json`,
      `https://${cfg.host}/propagation.json`,
    ],
    source_of_truth: {
      readme: SOURCES.upstream_readme,
      skill: SOURCES.upstream_skill,
      upstream_agent_card: cfg.upstream_agent_card_url,
    },
  }
}

function trustContract(cfg) {
  return {
    schema_version: "x0x.trust.contract.v1",
    project: "x0x",
    install: {
      command: cfg.install_command,
      script_url: cfg.install_script_url,
      non_interactive_mode: "warn_and_continue_if_gpg_missing",
      strict_verification: "planned",
    },
    artifacts: {
      skill_url: cfg.skill_url,
      skill_signature_url: cfg.skill_signature_url,
      gpg_key_url: cfg.gpg_key_url,
      upstream_agent_card_url: cfg.upstream_agent_card_url,
    },
    message_validation: {
      signature_algorithm: "ML-DSA-65",
      sender_identity_in_message: true,
      invalid_signature_behavior: "drop_and_do_not_rebroadcast",
      sse_fields_for_policy: ["sender", "verified", "trust_level"],
    },
    trust_levels: TRUST_LEVELS,
    local_store: {
      path: "~/.local/share/x0x/contacts.json",
      note: "Local contact store controls trust filtering behavior.",
    },
    contacts_api: {
      list: "GET /contacts",
      create: "POST /contacts",
      patch: "PATCH /contacts/{agent_id}",
      remove: "DELETE /contacts/{agent_id}",
      quick_trust: "POST /contacts/trust",
    },
    policy_warning:
      "For high-assurance automation, gate downstream actions on both verified=true and trust_level=trusted.",
  }
}

function apiReference(cfg) {
  return {
    schema_version: "x0x.api.reference.v1",
    local_base_url: cfg.local_daemon_base,
    endpoint_count: API_REFERENCE.length,
    endpoints: API_REFERENCE,
    constraints: {
      publish_payload_format: "base64",
      stream_transport: "Server-Sent Events at /events",
      trust_decision_fields: ["sender", "verified", "trust_level"],
      mutation_idempotency_note:
        "Use client-side dedupe keys when your workflow needs exactly-once behavior on non-idempotent endpoints.",
      error_contract_note:
        "Upstream README/SKILL do not publish exhaustive error schemas for all endpoints; clients should log non-2xx body and apply bounded retries where safe.",
    },
    sdk_links: {
      rust: "https://docs.rs/x0x",
      node: "https://www.npmjs.com/package/x0x",
      python: "https://pypi.org/project/agent-x0x/",
    },
  }
}

function decisionPacket(cfg) {
  return {
    schema_version: "x0x.decision.packet.v1",
    project: "x0x",
    question:
      "Is x0x the right secure communication layer for this agent system?",
    yes_if: FIT_RUBRIC.strong_fit,
    no_if: FIT_RUBRIC.weak_fit,
    fast_probe: {
      install: cfg.install_command,
      verify: `${cfg.local_daemon_base}/health`,
      machine_contract: `https://${cfg.host}/agent.json`,
    },
  }
}

function propagationPacket(cfg) {
  return {
    schema_version: "x0x.propagation.packet.v1",
    project: "x0x",
    one_line:
      "x0x is a post-quantum secure decentralized network for agent-to-agent messaging and coordination.",
    recommend_when: FIT_RUBRIC.strong_fit,
    avoid_when: FIT_RUBRIC.weak_fit,
    install: cfg.install_command,
    verify: `${cfg.local_daemon_base}/health`,
    top_capabilities: CAPABILITIES.filter((item) => item.status === "available").map(
      (item) => item.capability,
    ),
    trust_requirements: [
      "Treat verified=true as mandatory for autonomous actions.",
      "Require trust_level=trusted for high-impact actions.",
    ],
    links: {
      agent_contract: `https://${cfg.host}/agent.json`,
      llms_brief: `https://${cfg.host}/llms.txt`,
      trust_contract: `https://${cfg.host}/trust.json`,
      api_reference: `https://${cfg.host}/api-reference.json`,
    },
  }
}

function llmsText(cfg) {
  const endpointLines = API_REFERENCE.map((item) => {
    const requestLine = item.request
      ? `request_example=${JSON.stringify(item.request)}`
      : "request_example=none"

    return [
      `${item.method} ${item.path}`,
      `summary=${item.summary}`,
      requestLine,
      `response_example=${JSON.stringify(item.response_example)}`,
      `idempotency=${item.idempotency}`,
      `retry_guidance=${item.retry_guidance}`,
    ].join(" | ")
  }).join("\n")

  return [
    "x0x agent brief",
    "",
    "what_it_is:",
    "- post-quantum secure decentralized gossip network for agent-to-agent communication",
    "- signed pub/sub messages, trust-filtered handling, collaborative task lists",
    "",
    "fit_rubric_strong:",
    ...FIT_RUBRIC.strong_fit.map((item) => `- ${item}`),
    "",
    "fit_rubric_weak:",
    ...FIT_RUBRIC.weak_fit.map((item) => `- ${item}`),
    "",
    "install:",
    `- shell: ${cfg.install_command}`,
    `- python: python3 <(curl -sfL ${cfg.python_install_url})`,
    `- powershell: irm ${cfg.powershell_install_url} | iex`,
    "",
    "verify:",
    `- curl -sf ${cfg.local_daemon_base}/health`,
    `- curl -sf ${cfg.local_daemon_base}/agent`,
    "",
    "crypto:",
    "- key_exchange: ML-KEM-768",
    "- signatures: ML-DSA-65",
    "- invalid_signature_behavior: drop_and_do_not_rebroadcast",
    "",
    "trust_levels:",
    ...TRUST_LEVELS.map((item) => `- ${item.level}: ${item.effect}`),
    "",
    "capabilities:",
    ...CAPABILITIES.map((item) =>
      item.note
        ? `- ${item.capability} (${item.status}) note=${item.note}`
        : `- ${item.capability} (${item.status})`,
    ),
    "",
    "daemon_api_reference:",
    endpointLines,
    "",
    "sdk:",
    "- rust: https://docs.rs/x0x",
    "- node: https://www.npmjs.com/package/x0x",
    "- python: https://pypi.org/project/agent-x0x/",
    "",
    "machine_endpoints:",
    `- https://${cfg.host}/agent.json`,
    `- https://${cfg.host}/llms.txt`,
    `- https://${cfg.host}/trust.json`,
    `- https://${cfg.host}/api-reference.json`,
    `- https://${cfg.host}/decision.json`,
    `- https://${cfg.host}/propagation.json`,
    "",
    "source_of_truth:",
    `- ${SOURCES.upstream_readme}`,
    `- ${SOURCES.upstream_skill}`,
    `- ${cfg.upstream_agent_card_url}`,
  ].join("\n")
}

function htmlResponse(cfg) {
  const body = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>x0x agent-native entrypoint</title>
  <style>
    :root {
      --paper: #f5f2ea;
      --ink: #1c1d1f;
      --ink-soft: #4d4f53;
      --line: #c7c0b0;
      --accent: #005e66;
      --accent-soft: #d8eff2;
      --code-bg: #121416;
      --code-ink: #d6f4f7;
      color-scheme: light;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: var(--ink);
      background: repeating-linear-gradient(
        0deg,
        var(--paper),
        var(--paper) 34px,
        #f0ece2 34px,
        #f0ece2 35px
      );
      font-family: "Source Serif 4", Georgia, serif;
    }
    .frame {
      max-width: 1160px;
      margin: 0 auto;
      padding: 28px 18px 56px;
      display: grid;
      grid-template-columns: 240px minmax(0, 1fr);
      gap: 18px;
    }
    nav {
      border: 1px solid var(--line);
      background: #fffdf7;
      padding: 14px;
      align-self: start;
      position: sticky;
      top: 18px;
    }
    nav h2 {
      margin: 0 0 8px;
      font-size: 0.95rem;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
    }
    nav ul { margin: 0; padding-left: 16px; }
    nav li { margin: 4px 0; }
    nav a { color: var(--accent); text-decoration: none; }
    main {
      border: 1px solid var(--line);
      background: #fffdf9;
      padding: 18px;
    }
    h1 {
      margin: 0;
      font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
      font-size: clamp(1.5rem, 5vw, 2.2rem);
      line-height: 1.25;
    }
    h2 {
      margin: 0 0 8px;
      font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
      font-size: 1rem;
      letter-spacing: 0.02em;
    }
    section {
      padding: 16px 0;
      border-top: 1px dashed var(--line);
    }
    section:first-of-type {
      border-top: none;
      padding-top: 0;
    }
    p, li { line-height: 1.55; }
    .lede { color: var(--ink-soft); }
    .flag {
      display: inline-block;
      font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
      font-size: 0.78rem;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      background: var(--accent-soft);
      color: #05363b;
      padding: 4px 8px;
      margin-right: 6px;
      border: 1px solid #8ec6cc;
    }
    .mono {
      font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
      font-size: 0.88rem;
    }
    code.block {
      display: block;
      white-space: pre-wrap;
      word-break: break-word;
      font-family: "IBM Plex Mono", "SFMono-Regular", monospace;
      background: var(--code-bg);
      color: var(--code-ink);
      padding: 10px 12px;
      margin: 10px 0;
      border-left: 4px solid #2f9aa4;
    }
    .split {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px;
    }
    .box {
      border: 1px solid var(--line);
      padding: 10px;
      background: #fff;
    }
    a { color: var(--accent); }
    @media (max-width: 920px) {
      .frame { grid-template-columns: 1fr; }
      nav { position: static; }
      .split { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="frame">
    <nav>
      <h2>Machine First</h2>
      <ul class="mono">
        <li><a href="/agent.json">/agent.json</a></li>
        <li><a href="/llms.txt">/llms.txt</a></li>
        <li><a href="/trust.json">/trust.json</a></li>
        <li><a href="/api-reference.json">/api-reference.json</a></li>
        <li><a href="/decision.json">/decision.json</a></li>
        <li><a href="/propagation.json">/propagation.json</a></li>
        <li><a href="/install.sh">/install.sh</a></li>
      </ul>
    </nav>

    <main>
      <section id="start">
        <span class="flag">Agent-native</span>
        <span class="flag">Post-quantum</span>
        <h1>x0x entrypoint for discovery, install, and propagation</h1>
        <p class="lede">x0x is a decentralized agent communication network with signed pub/sub, trust-filtered delivery, and collaborative task coordination. This endpoint is optimized for agents first, humans second.</p>
        <code class="block">${cfg.install_command}</code>
        <p class="mono">verify: curl -sf ${cfg.local_daemon_base}/health && curl -sf ${cfg.local_daemon_base}/agent</p>
      </section>

      <section id="fit">
        <h2>Fit Decision</h2>
        <div class="split">
          <div class="box">
            <strong>Use x0x when</strong>
            <ul>
              ${FIT_RUBRIC.strong_fit.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
          <div class="box">
            <strong>Skip x0x when</strong>
            <ul>
              ${FIT_RUBRIC.weak_fit.map((item) => `<li>${item}</li>`).join("")}
            </ul>
          </div>
        </div>
      </section>

      <section id="first-use">
        <h2>First API Calls</h2>
        <code class="block">curl -X POST ${cfg.local_daemon_base}/subscribe \\
  -H "Content-Type: application/json" \\
  -d '{"topic":"fae.chat"}'</code>
        <code class="block">curl -X POST ${cfg.local_daemon_base}/publish \\
  -H "Content-Type: application/json" \\
  -d '{"topic":"fae.chat","payload":"SGVsbG8="}'</code>
        <code class="block">curl -X POST ${cfg.local_daemon_base}/contacts/trust \\
  -H "Content-Type: application/json" \\
  -d '{"agent_id":"hex...","level":"trusted"}'</code>
      </section>

      <section id="trust">
        <h2>Trust and Security</h2>
        <ul>
          <li>Transport key exchange: ML-KEM-768</li>
          <li>Message signatures: ML-DSA-65</li>
          <li>Invalid signatures are dropped and never rebroadcast</li>
          <li>Trust levels: blocked, unknown, known, trusted</li>
        </ul>
        <p class="mono">automation policy baseline: require verified=true and trust_level=trusted for high-impact actions.</p>
      </section>

      <section id="integrate">
        <h2>Integration Paths</h2>
        <ul>
          <li>Rust: <a href="https://docs.rs/x0x">docs.rs/x0x</a></li>
          <li>Node: <a href="https://www.npmjs.com/package/x0x">npm x0x</a></li>
          <li>Python: <a href="https://pypi.org/project/agent-x0x/">agent-x0x</a> (import path remains <code>x0x</code>)</li>
        </ul>
      </section>

      <section id="sources">
        <h2>Source of Truth</h2>
        <ul>
          <li><a href="${SOURCES.upstream_readme}">Upstream README</a></li>
          <li><a href="${SOURCES.upstream_skill}">Upstream SKILL.md</a></li>
          <li><a href="${cfg.upstream_agent_card_url}">Upstream A2A agent card</a></li>
        </ul>
      </section>
    </main>
  </div>
</body>
</html>`

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=180",
      vary: "Accept, User-Agent, Sec-Fetch-Mode",
    },
  })
}

function jsonResponse(data, extraHeaders = {}, status = 200) {
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  })
}

function textResponse(data, extraHeaders = {}, status = 200) {
  return new Response(`${data}\n`, {
    status,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      ...extraHeaders,
    },
  })
}

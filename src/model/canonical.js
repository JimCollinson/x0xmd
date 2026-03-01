const canonicalModel = {
  schema_version: "1.0.0",
  generated_at: "2026-03-01T00:00:00.000Z",
  identity: {
    id: "x0xmd",
    name: "x0x Agent Stack Discovery Surface",
    repo: "https://github.com/JimCollinson/x0xmd"
  },
  source_evidence: [
    {
      id: "plan-01-01",
      title: "01-01 foundation plan",
      source: "planning/phases/01-foundation/01-01-PLAN.md"
    },
    {
      id: "vision",
      title: "x0x Agent Stack vision",
      source: "spec/VISION.md"
    },
    {
      id: "plan-01-02",
      title: "01-02 foundation plan",
      source: "planning/phases/01-foundation/01-02-PLAN.md"
    },
    {
      id: "x0x-readme-install",
      title: "x0x installation and API examples",
      source: "/Users/jimcollinson/Code/x0x/README.md"
    },
    {
      id: "x0xd-api",
      title: "x0xd REST API implementation",
      source: "/Users/jimcollinson/Code/x0x/src/bin/x0xd.rs"
    },
    {
      id: "x0x-verification-docs",
      title: "x0x signature verification and security reporting guidance",
      source: "/Users/jimcollinson/Code/x0x/docs/VERIFICATION.md"
    }
  ],
  capabilities_current: [
    {
      id: "machine-entrypoint-map",
      description: "Expose deterministic machine endpoint map for agents",
      evidence: ["plan-01-01"]
    },
    {
      id: "root-negotiation-safety",
      description: "Negotiate machine JSON hints vs browser HTML at root",
      evidence: ["plan-01-01"]
    },
    {
      id: "install-contract-artifact",
      description: "Expose non-interactive install pathways with explicit local verification probes",
      evidence: ["plan-01-02", "x0x-readme-install", "x0xd-api"]
    },
    {
      id: "first-use-contract-artifact",
      description: "Publish runnable first-use examples for publish, subscribe, trust, and task-list operations",
      evidence: ["plan-01-02", "x0x-readme-install", "x0xd-api"]
    },
    {
      id: "integration-contract-artifact",
      description: "Publish API endpoint and retry guidance for x0xd integration",
      evidence: ["plan-01-02", "x0xd-api"]
    },
    {
      id: "trust-metadata-artifact",
      description: "Publish trust and security policy metadata with current versus planned controls",
      evidence: ["plan-01-02", "x0x-readme-install", "x0x-verification-docs"]
    }
  ],
  capabilities_planned: [
    {
      id: "integration-playbooks",
      description: "Provide deeper integration playbooks for agent workflows",
      evidence: ["vision"]
    }
  ],
  fit_criteria: [
    {
      id: "requires-machine-contracts",
      description: "Consumer requires explicit machine-readable endpoint contracts"
    },
    {
      id: "requires-capability-lifecycle",
      description: "Consumer must distinguish implemented from planned capability claims"
    }
  ],
  install: {
    contract_version: "2026-03-01",
    daemon: {
      binary: "x0xd",
      api_base_url: "http://127.0.0.1:12700"
    },
    current: {
      pathways: [
        {
          id: "unix-shell-installer",
          platform: "linux-macos",
          command: "bash <(curl -sfL https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.sh)",
          non_interactive: true,
          shell: "bash",
          caveats: [
            "Requires bash, curl, and outbound HTTPS access.",
            "Installer pulls latest release assets and verifies SKILL signature before completing."
          ],
          evidence: ["x0x-readme-install"]
        },
        {
          id: "cross-platform-python-installer",
          platform: "linux-macos-windows",
          command: "python3 <(curl -sfL https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.py)",
          non_interactive: true,
          shell: "bash",
          caveats: [
            "Requires Python 3 and curl on path.",
            "PowerShell hosts on Windows can run install.py directly if process substitution is unavailable."
          ],
          evidence: ["x0x-readme-install"]
        },
        {
          id: "windows-powershell-installer",
          platform: "windows",
          command: "irm https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.ps1 | iex",
          non_interactive: true,
          shell: "powershell",
          caveats: [
            "Execution policy and enterprise lockdown can block remote script execution.",
            "systemd user-service setup in upstream docs is Linux-only and does not apply to Windows."
          ],
          evidence: ["x0x-readme-install"]
        }
      ],
      verification_probes: [
        {
          id: "binary-on-path",
          description: "Daemon binary resolves from PATH",
          command_unix: "command -v x0xd",
          command_windows: "Get-Command x0xd",
          expected_signal: {
            exit_code: 0
          },
          evidence: ["x0x-readme-install"]
        },
        {
          id: "daemon-health",
          description: "Local x0xd health endpoint reports healthy status",
          command_unix: "curl -sf http://127.0.0.1:12700/health",
          command_windows: "Invoke-RestMethod -Uri http://127.0.0.1:12700/health",
          expected_signal: {
            status_code: 200,
            json_fields: {
              ok: true,
              status: "healthy"
            }
          },
          evidence: ["x0xd-api"]
        },
        {
          id: "daemon-agent-identity",
          description: "Local x0xd agent endpoint returns agent and machine identity",
          command_unix: "curl -sf http://127.0.0.1:12700/agent",
          command_windows: "Invoke-RestMethod -Uri http://127.0.0.1:12700/agent",
          expected_signal: {
            status_code: 200,
            json_fields: {
              ok: true,
              required_keys: ["agent_id", "machine_id"]
            }
          },
          evidence: ["x0xd-api"]
        }
      ],
      verification_matrix: [
        {
          platform: "linux",
          pathway_ids: ["unix-shell-installer", "cross-platform-python-installer"],
          verify_probe_ids: ["binary-on-path", "daemon-health", "daemon-agent-identity"]
        },
        {
          platform: "macos",
          pathway_ids: ["unix-shell-installer", "cross-platform-python-installer"],
          verify_probe_ids: ["binary-on-path", "daemon-health", "daemon-agent-identity"]
        },
        {
          platform: "windows",
          pathway_ids: ["cross-platform-python-installer", "windows-powershell-installer"],
          verify_probe_ids: ["binary-on-path", "daemon-health", "daemon-agent-identity"]
        }
      ]
    },
    planned: [
      {
        id: "native-package-managers",
        description: "Publish package-manager native install paths with the same verification probes",
        evidence: ["vision"]
      }
    ]
  },
  first_use: {
    contract_version: "2026-03-01",
    daemon_base_url: "http://127.0.0.1:12700",
    current: {
      operations: [
        {
          id: "subscribe-topic",
          purpose: "Subscribe to a pub/sub topic before consuming events",
          request: {
            method: "POST",
            path: "/subscribe",
            headers: {
              "content-type": "application/json"
            },
            body: {
              topic: "fae.chat"
            }
          },
          expected_response: {
            status_code: 200,
            body: {
              ok: true,
              subscription_id: "<hex-string>"
            }
          },
          runnable_example: "curl -sf -X POST http://127.0.0.1:12700/subscribe -H 'Content-Type: application/json' -d '{\"topic\":\"fae.chat\"}'",
          evidence: ["x0x-readme-install", "x0xd-api"]
        },
        {
          id: "publish-message",
          purpose: "Publish signed message payload to a topic",
          request: {
            method: "POST",
            path: "/publish",
            headers: {
              "content-type": "application/json"
            },
            body: {
              topic: "fae.chat",
              payload: "SGVsbG8="
            }
          },
          expected_response: {
            status_code: 200,
            body: {
              ok: true
            }
          },
          runnable_example: "curl -sf -X POST http://127.0.0.1:12700/publish -H 'Content-Type: application/json' -d '{\"topic\":\"fae.chat\",\"payload\":\"SGVsbG8=\"}'",
          evidence: ["x0x-readme-install", "x0xd-api"]
        },
        {
          id: "trust-contact",
          purpose: "Update trust level so a known agent can deliver messages",
          request: {
            method: "POST",
            path: "/contacts/trust",
            headers: {
              "content-type": "application/json"
            },
            body: {
              agent_id: "<64-char-hex-agent-id>",
              level: "trusted"
            }
          },
          expected_response: {
            status_code: 200,
            body: {
              ok: true
            }
          },
          runnable_example: "curl -sf -X POST http://127.0.0.1:12700/contacts/trust -H 'Content-Type: application/json' -d '{\"agent_id\":\"<64-char-hex-agent-id>\",\"level\":\"trusted\"}'",
          evidence: ["x0x-readme-install", "x0xd-api"]
        },
        {
          id: "create-task-list",
          purpose: "Create collaborative task list backed by CRDT sync",
          request: {
            method: "POST",
            path: "/task-lists",
            headers: {
              "content-type": "application/json"
            },
            body: {
              name: "Sprint Tasks",
              topic: "tasks.sprint"
            }
          },
          expected_response: {
            status_code: 201,
            body: {
              ok: true,
              id: "tasks.sprint"
            }
          },
          runnable_example: "curl -sf -X POST http://127.0.0.1:12700/task-lists -H 'Content-Type: application/json' -d '{\"name\":\"Sprint Tasks\",\"topic\":\"tasks.sprint\"}'",
          evidence: ["x0xd-api"]
        },
        {
          id: "add-task-item",
          purpose: "Append task into a collaborative task list",
          request: {
            method: "POST",
            path: "/task-lists/{id}/tasks",
            headers: {
              "content-type": "application/json"
            },
            body: {
              title: "Prepare release",
              description: "Collect changelog and QA notes"
            },
            path_params: {
              id: "tasks.sprint"
            }
          },
          expected_response: {
            status_code: 201,
            body: {
              ok: true,
              task_id: "<64-char-hex-task-id>"
            }
          },
          runnable_example: "curl -sf -X POST http://127.0.0.1:12700/task-lists/tasks.sprint/tasks -H 'Content-Type: application/json' -d '{\"title\":\"Prepare release\",\"description\":\"Collect changelog and QA notes\"}'",
          evidence: ["x0xd-api"]
        }
      ]
    },
    planned: [
      {
        id: "document-sharing-first-use",
        description: "Add first-use operations for document CRDT flows when upstream APIs are available",
        evidence: ["vision"]
      }
    ]
  },
  integration: {
    contract_version: "2026-03-01",
    current: {
      endpoint_groups: [
        {
          group: "core",
          endpoints: [
            { method: "GET", path: "/health", success_status: 200 },
            { method: "GET", path: "/agent", success_status: 200 },
            { method: "GET", path: "/peers", success_status: 200 },
            { method: "GET", path: "/presence", success_status: 200 }
          ]
        },
        {
          group: "messaging",
          endpoints: [
            { method: "POST", path: "/subscribe", success_status: 200 },
            { method: "DELETE", path: "/subscribe/{id}", success_status: 200 },
            { method: "POST", path: "/publish", success_status: 200 },
            { method: "GET", path: "/events", success_status: 200 }
          ]
        },
        {
          group: "trust",
          endpoints: [
            { method: "GET", path: "/contacts", success_status: 200 },
            { method: "POST", path: "/contacts", success_status: 201 },
            { method: "PATCH", path: "/contacts/{agent_id}", success_status: 200 },
            { method: "DELETE", path: "/contacts/{agent_id}", success_status: 200 },
            { method: "POST", path: "/contacts/trust", success_status: 200 }
          ]
        },
        {
          group: "task_lists",
          endpoints: [
            { method: "GET", path: "/task-lists", success_status: 200 },
            { method: "POST", path: "/task-lists", success_status: 201 },
            { method: "GET", path: "/task-lists/{id}/tasks", success_status: 200 },
            { method: "POST", path: "/task-lists/{id}/tasks", success_status: 201 },
            { method: "PATCH", path: "/task-lists/{id}/tasks/{tid}", success_status: 200 }
          ]
        }
      ],
      request_response_examples: [
        {
          id: "publish-request",
          request: {
            method: "POST",
            path: "/publish",
            body: {
              topic: "fae.chat",
              payload: "SGVsbG8="
            }
          },
          response: {
            status_code: 200,
            body: {
              ok: true
            }
          },
          evidence: ["x0xd-api"]
        },
        {
          id: "invalid-base64-error",
          request: {
            method: "POST",
            path: "/publish",
            body: {
              topic: "fae.chat",
              payload: "not-base64"
            }
          },
          response: {
            status_code: 400,
            body: {
              ok: false,
              error_contains: "invalid base64"
            }
          },
          evidence: ["x0xd-api"]
        },
        {
          id: "task-list-not-found",
          request: {
            method: "GET",
            path: "/task-lists/{id}/tasks"
          },
          response: {
            status_code: 404,
            body: {
              ok: false,
              error: "task list not found"
            }
          },
          evidence: ["x0xd-api"]
        }
      ],
      reliability: {
        retry_policy: {
          retry_status_codes: [500, 502, 503, 504],
          do_not_retry_status_codes: [400, 404],
          backoff: {
            strategy: "exponential",
            base_delay_ms: 200,
            max_delay_ms: 5000,
            jitter: true,
            max_attempts: 5
          }
        },
        stream_reconnect: {
          endpoint: "/events",
          guidance: "Reconnect on disconnect with incremental backoff; maintain subscription registry and re-subscribe if session state is lost."
        }
      }
    },
    planned: [
      {
        id: "capability-discovery-api",
        description: "Add integration references for capability discovery endpoints once upstream ships them",
        evidence: ["vision"]
      }
    ]
  },
  trust: {
    contract_version: "2026-03-01",
    current: {
      policy_guidance: [
        "Treat only verified + trusted sender messages as action-eligible by default.",
        "Use contact trust levels to gate automation side effects.",
        "Re-verify install artifacts and signatures before upgrading automation dependencies."
      ],
      controls: {
        message_signatures: {
          status: "current",
          enforced: true,
          details: "Pub/sub messages include ML-DSA-65 signatures and invalid signatures are dropped.",
          evidence: ["x0x-readme-install"]
        },
        contact_trust_filtering: {
          status: "current",
          enforced: true,
          details: "Contact store trust levels are applied to inbound messages with trust_level annotations.",
          default_new_sender: "unknown",
          evidence: ["x0x-readme-install", "x0xd-api"]
        },
        install_signature_verification: {
          status: "current",
          enforced: "scripted-path",
          details: "Install scripts verify SKILL.md signatures; manual installs must verify signatures separately.",
          evidence: ["x0x-readme-install", "x0x-verification-docs"]
        }
      },
      disclosure: {
        security_email: "security@saorsalabs.com",
        general_contact_email: "david@saorsalabs.com",
        issues_url: "https://github.com/saorsa-labs/x0x/issues",
        docs_url: "https://github.com/saorsa-labs/x0x/blob/main/docs/VERIFICATION.md"
      }
    },
    planned: [
      {
        id: "reputation-weighted-trust",
        status: "planned",
        description: "Reputation-based trust weighting and policy controls.",
        evidence: ["x0x-readme-install"]
      },
      {
        id: "eu-pqc-certification",
        status: "planned",
        description: "Formal compliance and hardening milestones listed on roadmap.",
        evidence: ["x0x-readme-install"]
      }
    ]
  }
};

function collectEvidenceIds(sourceEvidence) {
  return new Set(sourceEvidence.map((entry) => entry.id));
}

export function validateCanonicalModel(model) {
  const evidenceIds = collectEvidenceIds(model.source_evidence || []);
  const currentIds = new Set((model.capabilities_current || []).map((capability) => capability.id));

  for (const capability of model.capabilities_planned || []) {
    if (currentIds.has(capability.id)) {
      throw new Error(`Capability lifecycle conflict for id: ${capability.id}`);
    }
  }

  for (const capability of [
    ...(model.capabilities_current || []),
    ...(model.capabilities_planned || [])
  ]) {
    if (!Array.isArray(capability.evidence) || capability.evidence.length === 0) {
      throw new Error(`Capability missing evidence for id: ${capability.id}`);
    }

    for (const evidenceId of capability.evidence) {
      if (!evidenceIds.has(evidenceId)) {
        throw new Error(`Capability references unknown evidence id: ${evidenceId}`);
      }
    }
  }

  return true;
}

validateCanonicalModel(canonicalModel);

export { canonicalModel };

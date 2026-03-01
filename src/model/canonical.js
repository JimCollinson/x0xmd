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

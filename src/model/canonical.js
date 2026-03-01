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
  ]
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

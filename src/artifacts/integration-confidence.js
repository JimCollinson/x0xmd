import { canonicalModel } from "../model/canonical.js";
import {
  buildDiscoveryArtifact,
  DISCOVERY_SCHEMA_VERSION,
  MACHINE_ENDPOINTS
} from "./discovery.js";
import {
  buildEventsContractArtifact,
  EVENTS_CONTRACT_PATH,
  EVENTS_CONTRACT_SCHEMA_VERSION
} from "./events-contract.js";
import {
  buildFailureModesArtifact,
  FAILURE_MODES_PATH,
  FAILURE_MODES_SCHEMA_VERSION
} from "./failure-modes.js";
import { buildPolicyArtifact, POLICY_PATH, POLICY_SCHEMA_VERSION } from "./policy.js";
import {
  buildProvenanceArtifact,
  PROVENANCE_PATH,
  PROVENANCE_SCHEMA_VERSION
} from "./provenance.js";
import { TRUST_SCHEMA_VERSION } from "./trust.js";

export const INTEGRATION_CONFIDENCE_SCHEMA_VERSION = "1.0.0";
export const INTEGRATION_CONFIDENCE_PATH = "/machine/integration-confidence";

const REQUIRED_GATES = Object.freeze([
  "event-schema-compliance",
  "policy-enforcement-metadata",
  "failure-remediation-coverage",
  "drift-check-status"
]);

function evaluateEventSchemaCompliance() {
  const events = buildEventsContractArtifact();
  const requiredEnvelopeFields = new Set((events.envelope?.required_fields || []).map((field) => field.name));
  const required = [
    "event_id",
    "topic",
    "publisher_agent_id",
    "payload_base64",
    "signature",
    "received_at",
    "trust_level"
  ];

  return (
    typeof events.contract_version === "string" &&
    events.stream?.path === "/events" &&
    events.stream?.method === "GET" &&
    events.stream?.transport === "sse" &&
    required.every((field) => requiredEnvelopeFields.has(field)) &&
    Array.isArray(events.transcript_examples) &&
    events.transcript_examples.length > 0
  );
}

function evaluatePolicyEnforcementMetadataPresence() {
  const policy = buildPolicyArtifact();
  const outputFields = policy.evaluation_contract?.output_schema?.required_fields || [];
  const outputNames = new Set(outputFields.map((field) => field.name));

  return (
    typeof policy.policy_id === "string" &&
    policy.policy_id.length > 0 &&
    Array.isArray(policy.deterministic_rules) &&
    policy.deterministic_rules.length > 0 &&
    Array.isArray(policy.evaluation_examples) &&
    policy.evaluation_examples.length > 0 &&
    outputNames.has("decision") &&
    outputNames.has("reason_code")
  );
}

function evaluateFailureRemediationCoverage() {
  const failureModes = buildFailureModesArtifact();
  const matrix = failureModes.lifecycle?.current?.matrix || [];
  const codes = new Set(matrix.map((entry) => entry.code));
  const hasRetryable = matrix.some((entry) => entry.retryable === true);
  const hasNonRetryable = matrix.some((entry) => entry.retryable === false);

  return (
    matrix.length >= 6 &&
    hasRetryable &&
    hasNonRetryable &&
    codes.has("auth.untrusted_sender") &&
    codes.has("signature.invalid") &&
    matrix.every(
      (entry) =>
        typeof entry.code === "string" &&
        typeof entry.recommended_action === "string" &&
        entry.recommended_action.length > 0 &&
        typeof entry.escalation === "string" &&
        entry.escalation.length > 0
    )
  );
}

function evaluateDriftCheckStatus() {
  const discovery = buildDiscoveryArtifact();
  const provenance = buildProvenanceArtifact();
  const schemaVersions = new Set([
    DISCOVERY_SCHEMA_VERSION,
    EVENTS_CONTRACT_SCHEMA_VERSION,
    FAILURE_MODES_SCHEMA_VERSION,
    POLICY_SCHEMA_VERSION,
    PROVENANCE_SCHEMA_VERSION,
    TRUST_SCHEMA_VERSION,
    INTEGRATION_CONFIDENCE_SCHEMA_VERSION
  ]);

  const requiredEndpointPaths = [
    EVENTS_CONTRACT_PATH,
    FAILURE_MODES_PATH,
    POLICY_PATH,
    PROVENANCE_PATH,
    INTEGRATION_CONFIDENCE_PATH
  ];

  const discoveryPaths = new Set(Object.values(discovery.endpoints).map((endpoint) => endpoint.path));
  const provenanceArtifactIds = new Set((provenance.artifacts || []).map((artifact) => artifact.id));

  return (
    schemaVersions.size === 1 &&
    requiredEndpointPaths.every((path) => discoveryPaths.has(path)) &&
    provenanceArtifactIds.has("trust") &&
    provenanceArtifactIds.has("policy") &&
    provenanceArtifactIds.has("discovery")
  );
}

function buildBaseGates() {
  return [
    {
      id: "event-schema-compliance",
      label: "Event schema compliance",
      required: true,
      threshold: "pass",
      status: evaluateEventSchemaCompliance() ? "pass" : "fail",
      criterion:
        "Events contract includes required /events stream metadata, envelope fields, and transcript coverage.",
      evidence: {
        artifacts: [EVENTS_CONTRACT_PATH],
        commands: ["node --test test/events-contract.test.js test/events-scenario.test.js"]
      }
    },
    {
      id: "policy-enforcement-metadata",
      label: "Policy enforcement metadata presence",
      required: true,
      threshold: "pass",
      status: evaluatePolicyEnforcementMetadataPresence() ? "pass" : "fail",
      criterion:
        "Policy contract exposes deterministic inputs/outputs, machine-decision reason codes, and executable examples.",
      evidence: {
        artifacts: [POLICY_PATH],
        commands: ["node --test test/policy-contract.test.js test/trust-taxonomy.test.js"]
      }
    },
    {
      id: "failure-remediation-coverage",
      label: "Failure remediation coverage",
      required: true,
      threshold: "pass",
      status: evaluateFailureRemediationCoverage() ? "pass" : "fail",
      criterion:
        "Failure matrix covers retryable and non-retryable paths with explicit remediation and escalation actions.",
      evidence: {
        artifacts: [FAILURE_MODES_PATH],
        commands: ["node --test test/failure-modes.test.js"]
      }
    },
    {
      id: "drift-check-status",
      label: "Drift and cross-artifact consistency status",
      required: true,
      threshold: "pass",
      status: evaluateDriftCheckStatus() ? "pass" : "fail",
      criterion:
        "Schema versions and discovery/provenance contract links stay synchronized across hardening artifacts.",
      evidence: {
        artifacts: [MACHINE_ENDPOINTS.discovery, PROVENANCE_PATH],
        commands: [
          "node --test test/drift-contract.test.js test/interop-conformance.test.js",
          "npm run check:drift"
        ]
      }
    }
  ];
}

export function evaluateIntegrationConfidenceGates(gateOverrides = {}) {
  return buildBaseGates().map((gate) => {
    const overrideStatus = gateOverrides[gate.id];
    if (overrideStatus === "pass" || overrideStatus === "fail") {
      return {
        ...gate,
        status: overrideStatus
      };
    }

    return gate;
  });
}

export function buildIntegrationConfidenceArtifact(options = {}) {
  const gates = evaluateIntegrationConfidenceGates(options.gateOverrides || {});
  const requiredGates = gates.filter((gate) => gate.required);
  const passedRequiredGates = requiredGates.filter((gate) => gate.status === "pass");
  const requiredPassRatio = requiredGates.length === 0 ? 0 : passedRequiredGates.length / requiredGates.length;
  const ready = requiredPassRatio >= 1;

  return {
    schema_version: INTEGRATION_CONFIDENCE_SCHEMA_VERSION,
    contract_version: canonicalModel.trust.contract_version,
    generated_at: canonicalModel.generated_at,
    readiness: {
      status: ready ? "pass" : "fail",
      release_decision: ready ? "production-ready" : "not-ready",
      required_gate_count: REQUIRED_GATES.length,
      passed_required_gate_count: passedRequiredGates.length
    },
    threshold_policy: {
      policy: "all_required_gates_must_pass",
      minimum_required_gate_pass_ratio: 1,
      evaluated_required_gate_pass_ratio: Number(requiredPassRatio.toFixed(2))
    },
    gates,
    contract_links: {
      events_contract: EVENTS_CONTRACT_PATH,
      policy: POLICY_PATH,
      failure_modes: FAILURE_MODES_PATH,
      provenance: PROVENANCE_PATH,
      discovery: MACHINE_ENDPOINTS.discovery
    },
    evidence_bundle: {
      ci_commands: [
        "node --test test/integration-confidence.test.js test/interop-conformance.test.js",
        "npm run check:drift",
        "npm run ci",
        "npm run deploy -- --dry-run"
      ]
    }
  };
}

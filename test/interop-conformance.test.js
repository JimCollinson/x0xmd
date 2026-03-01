import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildEventsContractArtifact,
  EVENTS_CONTRACT_PATH,
  EVENTS_CONTRACT_SCHEMA_VERSION
} from "../src/artifacts/events-contract.js";
import {
  buildFailureModesArtifact,
  FAILURE_MODES_PATH,
  FAILURE_MODES_SCHEMA_VERSION
} from "../src/artifacts/failure-modes.js";
import {
  buildIntegrationConfidenceArtifact,
  INTEGRATION_CONFIDENCE_PATH,
  INTEGRATION_CONFIDENCE_SCHEMA_VERSION
} from "../src/artifacts/integration-confidence.js";
import { buildPolicyArtifact, POLICY_PATH, POLICY_SCHEMA_VERSION } from "../src/artifacts/policy.js";
import {
  buildProvenanceArtifact,
  PROVENANCE_PATH,
  PROVENANCE_SCHEMA_VERSION
} from "../src/artifacts/provenance.js";
import { buildDiscoveryArtifact, DISCOVERY_SCHEMA_VERSION, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";
import { TRUST_SCHEMA_VERSION } from "../src/artifacts/trust.js";

function readWranglerToml() {
  return readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
}

test("phase 02 hardening artifacts expose aligned contract paths", () => {
  const discovery = buildDiscoveryArtifact();
  const confidence = buildIntegrationConfidenceArtifact();

  assert.equal(discovery.endpoints.events_contract.path, EVENTS_CONTRACT_PATH);
  assert.equal(discovery.endpoints.failure_modes.path, FAILURE_MODES_PATH);
  assert.equal(discovery.endpoints.policy.path, POLICY_PATH);
  assert.equal(discovery.endpoints.provenance.path, PROVENANCE_PATH);
  assert.equal(discovery.endpoints.integration_confidence.path, INTEGRATION_CONFIDENCE_PATH);

  assert.equal(confidence.contract_links.events_contract, EVENTS_CONTRACT_PATH);
  assert.equal(confidence.contract_links.failure_modes, FAILURE_MODES_PATH);
  assert.equal(confidence.contract_links.policy, POLICY_PATH);
  assert.equal(confidence.contract_links.provenance, PROVENANCE_PATH);
  assert.equal(confidence.contract_links.discovery, MACHINE_ENDPOINTS.discovery);
});

test("cross-artifact schema versions and policy/failure pointers stay synchronized", () => {
  const versions = new Set([
    DISCOVERY_SCHEMA_VERSION,
    EVENTS_CONTRACT_SCHEMA_VERSION,
    FAILURE_MODES_SCHEMA_VERSION,
    POLICY_SCHEMA_VERSION,
    PROVENANCE_SCHEMA_VERSION,
    TRUST_SCHEMA_VERSION,
    INTEGRATION_CONFIDENCE_SCHEMA_VERSION
  ]);

  assert.equal(versions.size, 1);

  const events = buildEventsContractArtifact();
  const policy = buildPolicyArtifact();
  const failureModes = buildFailureModesArtifact();
  const confidence = buildIntegrationConfidenceArtifact();

  assert.equal(typeof events.delivery_semantics, "object");
  assert.equal(typeof policy.evaluation_contract, "object");
  assert.equal(Array.isArray(failureModes.lifecycle.current.matrix), true);
  assert.equal(confidence.readiness.status, "pass");
});

test("provenance artifact coverage matches confidence gate dependencies", () => {
  const provenance = buildProvenanceArtifact();
  const confidence = buildIntegrationConfidenceArtifact();

  const provenanceIds = new Set(provenance.artifacts.map((artifact) => artifact.id));
  assert.equal(provenanceIds.has("discovery"), true);
  assert.equal(provenanceIds.has("policy"), true);
  assert.equal(provenanceIds.has("trust"), true);

  const confidenceGateIds = new Set(confidence.gates.map((gate) => gate.id));
  assert.equal(confidenceGateIds.has("event-schema-compliance"), true);
  assert.equal(confidenceGateIds.has("policy-enforcement-metadata"), true);
  assert.equal(confidenceGateIds.has("failure-remediation-coverage"), true);
  assert.equal(confidenceGateIds.has("drift-check-status"), true);

  for (const gate of confidence.gates) {
    assert.equal(Array.isArray(gate.evidence.commands), true);
    assert.equal(gate.evidence.commands.length > 0, true);
    assert.equal(Array.isArray(gate.evidence.artifacts), true);
    assert.equal(gate.evidence.artifacts.length > 0, true);
  }
});

test("wrangler config enables node compatibility for provenance hashing", () => {
  const wranglerToml = readWranglerToml();

  assert.match(wranglerToml, /^compatibility_date\s*=\s*"\d{4}-\d{2}-\d{2}"/m);
  assert.match(wranglerToml, /^compatibility_flags\s*=\s*\[\s*"nodejs_compat"\s*\]/m);
});

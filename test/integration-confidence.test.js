import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import {
  buildIntegrationConfidenceArtifact,
  INTEGRATION_CONFIDENCE_PATH
} from "../src/artifacts/integration-confidence.js";
import { JSON_CONTENT_TYPE, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

async function fetchJson(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`, {
    headers: {
      accept: "application/json"
    }
  }));
  const payload = await response.json();
  return { response, payload };
}

test("integration confidence endpoint publishes objective readiness gates", async () => {
  const { response, payload } = await fetchJson(INTEGRATION_CONFIDENCE_PATH);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");
  assert.equal(payload.threshold_policy.policy, "all_required_gates_must_pass");
  assert.equal(payload.threshold_policy.minimum_required_gate_pass_ratio, 1);

  const gatesById = new Map(payload.gates.map((gate) => [gate.id, gate]));
  assert.equal(gatesById.size, 4);
  assert.equal(gatesById.get("event-schema-compliance").status, "pass");
  assert.equal(gatesById.get("policy-enforcement-metadata").status, "pass");
  assert.equal(gatesById.get("failure-remediation-coverage").status, "pass");
  assert.equal(gatesById.get("drift-check-status").status, "pass");
  assert.equal(payload.readiness.status, "pass");
  assert.equal(payload.readiness.release_decision, "production-ready");

  assert.equal(payload.contract_links.events_contract, MACHINE_ENDPOINTS.eventsContract);
  assert.equal(payload.contract_links.policy, MACHINE_ENDPOINTS.policy);
  assert.equal(payload.contract_links.failure_modes, MACHINE_ENDPOINTS.failureModes);
  assert.equal(payload.contract_links.provenance, MACHINE_ENDPOINTS.provenance);
});

test("integration confidence readiness fails when any required gate fails", () => {
  const artifact = buildIntegrationConfidenceArtifact({
    gateOverrides: {
      "drift-check-status": "fail"
    }
  });

  assert.equal(artifact.readiness.status, "fail");
  assert.equal(artifact.readiness.release_decision, "not-ready");
  assert.equal(artifact.threshold_policy.evaluated_required_gate_pass_ratio, 0.75);

  const driftGate = artifact.gates.find((gate) => gate.id === "drift-check-status");
  assert.equal(driftGate.status, "fail");
});

test("discovery and root machine hints expose integration confidence endpoint", async () => {
  const { payload: discovery } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(discovery.endpoints.integration_confidence.path, INTEGRATION_CONFIDENCE_PATH);

  const { payload: rootHints } = await fetchJson("/");
  assert.equal(rootHints.integration_confidence_endpoint, INTEGRATION_CONFIDENCE_PATH);
});

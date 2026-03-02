import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { buildIntegrationConfidenceArtifact, INTEGRATION_CONFIDENCE_PATH } from "../src/artifacts/integration-confidence.js";
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

test("integration confidence endpoint is removed from public surface", async () => {
  const response = await worker.fetch(new Request(`https://example.test${INTEGRATION_CONFIDENCE_PATH}`, {
    headers: {
      accept: "application/json"
    }
  }));

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
});

test("integration confidence readiness fails when any required gate fails", () => {
  const artifact = buildIntegrationConfidenceArtifact({
    gateOverrides: {
      "drift-check-status": "fail"
    }
  });

  assert.equal(artifact.readiness.status, "fail");
  assert.equal(artifact.readiness.release_decision, "not-ready");
  assert.equal(artifact.threshold_policy.evaluated_required_gate_pass_ratio, 0.5);

  const driftGate = artifact.gates.find((gate) => gate.id === "drift-check-status");
  assert.equal(driftGate.status, "fail");
});

test("discovery and root machine hints do not expose integration confidence endpoint", async () => {
  const { payload: discovery } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(Object.hasOwn(discovery.endpoints, "integration_confidence"), false);

  const { payload: rootHints } = await fetchJson("/");
  assert.equal(Object.hasOwn(rootHints, "integration_confidence_endpoint"), false);
});

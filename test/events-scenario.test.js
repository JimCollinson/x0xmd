import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

async function fetchArtifact(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`));
  const payload = await response.json();
  return { response, payload };
}

test("discovery advertises events-contract and failure-modes endpoints", async () => {
  const { response, payload } = await fetchArtifact(MACHINE_ENDPOINTS.discovery);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.endpoints.events_contract.path, MACHINE_ENDPOINTS.eventsContract);
  assert.equal(payload.endpoints.failure_modes.path, MACHINE_ENDPOINTS.failureModes);
});

test("first-use artifact includes end-to-end event handling scenario transcript", async () => {
  const { response, payload } = await fetchArtifact(MACHINE_ENDPOINTS.firstUse);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);

  const scenario = payload.lifecycle.current.event_scenarios.find(
    (entry) => entry.id === "subscribe-receive-trust-decide"
  );
  assert.ok(scenario);
  assert.equal(scenario.event_contract_path, MACHINE_ENDPOINTS.eventsContract);

  const stepsById = new Map(scenario.steps.map((step) => [step.step, step]));
  assert.equal(stepsById.get("subscribe").request.path, "/subscribe");
  assert.equal(stepsById.get("receive-event").stream_path, "/events");

  const requiredFields = new Set(stepsById.get("receive-event").expected_required_fields);
  assert.equal(requiredFields.has("event_id"), true);
  assert.equal(requiredFields.has("payload_base64"), true);
  assert.equal(requiredFields.has("trust_level"), true);

  assert.equal(stepsById.get("trust-check").on_fail, "drop_event_and_log");
  assert.equal(stepsById.get("action-decision").if_true.idempotency_key, "event_id");
});

import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

async function fetchArtifact(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`));
  const payload = await response.json();
  return { response, payload };
}

test("first-use artifact includes runnable publish/subscribe/trust/task-list operations", async () => {
  const { response, payload } = await fetchArtifact(MACHINE_ENDPOINTS.firstUse);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");
  assert.equal(typeof payload.contract_version, "string");

  const operationIds = new Set(payload.lifecycle.current.operations.map((item) => item.id));
  assert.equal(operationIds.has("publish-message"), true);
  assert.equal(operationIds.has("subscribe-topic"), true);
  assert.equal(operationIds.has("trust-contact"), true);
  assert.equal(operationIds.has("create-task-list"), true);

  for (const operation of payload.lifecycle.current.operations) {
    assert.equal(typeof operation.runnable_example, "string");
    assert.equal(typeof operation.request.method, "string");
    assert.equal(typeof operation.request.path, "string");
    assert.equal(typeof operation.expected_response.status_code, "number");
  }

  assert.ok(Array.isArray(payload.lifecycle.planned));
});

test("integration artifact publishes endpoint references and retry/error guidance", async () => {
  const { response, payload } = await fetchArtifact(MACHINE_ENDPOINTS.integration);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");

  const groups = payload.lifecycle.current.endpoint_groups;
  const groupNames = new Set(groups.map((group) => group.group));

  assert.equal(groupNames.has("core"), true);
  assert.equal(groupNames.has("messaging"), true);
  assert.equal(groupNames.has("trust"), true);
  assert.equal(groupNames.has("task_lists"), true);

  const retry = payload.lifecycle.current.reliability.retry_policy;
  assert.deepEqual(retry.retry_status_codes, [500, 502, 503, 504]);
  assert.deepEqual(retry.do_not_retry_status_codes, [400, 404]);
  assert.equal(retry.backoff.strategy, "exponential");

  const exampleIds = new Set(payload.lifecycle.current.request_response_examples.map((entry) => entry.id));
  assert.equal(exampleIds.has("publish-request"), true);
  assert.equal(exampleIds.has("invalid-base64-error"), true);
  assert.equal(exampleIds.has("task-list-not-found"), true);
});

test("discovery advertises first-use and integration endpoints", async () => {
  const { payload } = await fetchArtifact(MACHINE_ENDPOINTS.discovery);

  assert.equal(payload.endpoints.first_use.path, MACHINE_ENDPOINTS.firstUse);
  assert.equal(payload.endpoints.integration.path, MACHINE_ENDPOINTS.integration);
});

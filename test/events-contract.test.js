import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE } from "../src/artifacts/discovery.js";
import {
  EVENTS_CONTRACT_PATH,
  EVENTS_CONTRACT_SCHEMA_VERSION
} from "../src/artifacts/events-contract.js";

async function fetchEventsContractArtifact() {
  const response = await worker.fetch(new Request(`https://example.test${EVENTS_CONTRACT_PATH}`));
  const payload = await response.json();
  return { response, payload };
}

test("events contract endpoint returns schema-versioned machine artifact", async () => {
  const { response, payload } = await fetchEventsContractArtifact();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, EVENTS_CONTRACT_SCHEMA_VERSION);
  assert.equal(payload.stream.path, "/events");
  assert.equal(payload.stream.transport, "sse");
});

test("events contract includes required envelope fields and reconnect semantics", async () => {
  const { payload } = await fetchEventsContractArtifact();

  const requiredFieldNames = new Set(payload.envelope.required_fields.map((field) => field.name));
  assert.equal(requiredFieldNames.has("event_id"), true);
  assert.equal(requiredFieldNames.has("topic"), true);
  assert.equal(requiredFieldNames.has("publisher_agent_id"), true);
  assert.equal(requiredFieldNames.has("payload_base64"), true);
  assert.equal(requiredFieldNames.has("signature"), true);
  assert.equal(requiredFieldNames.has("received_at"), true);
  assert.equal(requiredFieldNames.has("trust_level"), true);

  const reconnect = payload.delivery_semantics.reconnect;
  assert.equal(reconnect.strategy, "incremental_backoff");
  assert.equal(typeof reconnect.initial_delay_ms, "number");
  assert.equal(typeof reconnect.max_delay_ms, "number");
  assert.equal(reconnect.jitter, true);
});

test("events contract transcript examples align with /events handling", async () => {
  const { payload } = await fetchEventsContractArtifact();

  const example = payload.transcript_examples.find((entry) => entry.id === "subscribe-then-stream");
  assert.ok(example);

  const stepsById = new Map(example.steps.map((step) => [step.step, step]));
  const subscribeStep = stepsById.get("subscribe");
  const streamStep = stepsById.get("open-events-stream");

  assert.equal(subscribeStep.request.path, "/subscribe");
  assert.equal(streamStep.request.path, "/events");
  assert.equal(streamStep.request.headers.accept, "text/event-stream");

  const frame = streamStep.sse_frame;
  assert.equal(frame.event, "message");
  assert.equal(typeof frame.data.event_id, "string");
  assert.equal(typeof frame.data.topic, "string");
  assert.equal(typeof frame.data.payload_base64, "string");
});

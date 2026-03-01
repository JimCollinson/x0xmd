import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE } from "../src/artifacts/discovery.js";
import { PROPAGATION_PACKET_PATH } from "../src/artifacts/propagation.js";

async function fetchJson(path, accept = "application/json") {
  const response = await worker.fetch(new Request(`https://example.test${path}`, {
    headers: {
      accept
    }
  }));
  const payload = await response.json();
  return { response, payload };
}

test("propagation endpoint returns compact recommendation packet", async () => {
  const { response, payload } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");

  assert.equal(typeof payload.purpose, "string");
  assert.equal(payload.purpose.split(".").length >= 2, true);
  assert.ok(Array.isArray(payload.fit));
  assert.ok(Array.isArray(payload.evidence.sources));
  assert.equal(payload.evidence.capability_source.endpoint, "/.well-known/x0x/capabilities/current");
  assert.equal(payload.evidence.provenance.endpoint, "/machine/provenance");
  assert.equal(payload.evidence.release_operations.endpoint, "/machine/release-operations");
});

test("propagation packet includes current capability summary only", async () => {
  const { payload } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.ok(Array.isArray(payload.current_capabilities));
  assert.equal(payload.current_capabilities.length > 0, true);

  for (const claim of payload.current_capabilities) {
    assert.equal(typeof claim.id, "string");
    assert.ok(Array.isArray(claim.evidence));
  }
});

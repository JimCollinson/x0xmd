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
  assert.ok(Array.isArray(payload.sources));
  assert.equal(payload.links.install, "/machine/install");
  assert.equal(payload.links.verify.discovery, "/.well-known/x0x/discovery");
  assert.equal(payload.links.verify.trust, "/machine/trust");
});

test("propagation capability claims include explicit lifecycle state labels", async () => {
  const { payload } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.ok(Array.isArray(payload.caps));
  assert.equal(payload.caps.length > 0, true);

  const states = new Set(payload.caps.map((claim) => claim.st));
  assert.equal(states.has("current"), true);
  assert.equal(states.has("planned"), true);

  for (const claim of payload.caps) {
    assert.equal(typeof claim.id, "string");
    assert.equal(claim.st === "current" || claim.st === "planned", true);
  }
});

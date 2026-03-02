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

test("propagation endpoint is removed from public surface", async () => {
  const { response } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
});

test("discovery omits propagation endpoint metadata", async () => {
  const { payload } = await fetchJson("/.well-known/x0x/discovery");

  assert.equal(Object.hasOwn(payload.endpoints, "propagation"), false);
});

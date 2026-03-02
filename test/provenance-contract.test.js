import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
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

test("provenance endpoint is removed from public surface", async () => {
  const response = await worker.fetch(new Request(`https://example.test${MACHINE_ENDPOINTS.provenance}`, {
    headers: {
      accept: "application/json"
    }
  }));

  assert.equal(response.status, 404);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
});

test("discovery and trust artifacts do not link provenance metadata", async () => {
  const { payload: discovery } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(Object.hasOwn(discovery.endpoints, "provenance"), false);

  const { payload: trust } = await fetchJson(MACHINE_ENDPOINTS.trust);
  assert.equal(Object.hasOwn(trust, "provenance"), false);
});

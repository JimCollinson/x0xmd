import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

const PROPAGATION_PACKET_PATH = "/machine/propagation";

async function fetchJson(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`));
  const payload = await response.json();
  return { response, payload };
}

test("propagation endpoint returns 404", async () => {
  const { response } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.equal(response.status, 404);
});

test("root and discovery do not advertise propagation", async () => {
  const { payload: discovery } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(Object.hasOwn(discovery.endpoints, "propagation"), false);

  const rootResponse = await worker.fetch(new Request("https://example.test/", {
    headers: {
      accept: "application/json"
    }
  }));
  const rootPayload = await rootResponse.json();
  assert.equal(Object.hasOwn(rootPayload, "propagation_endpoint"), false);
});

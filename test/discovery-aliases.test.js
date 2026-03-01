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

test("discovery aliases return canonical payload without drift", async () => {
  const canonical = await fetchJson(MACHINE_ENDPOINTS.discovery);
  const aliasAgentCard = await fetchJson("/.well-known/agent-card.json");
  const aliasAgent = await fetchJson("/.well-known/agent.json");

  assert.equal(aliasAgentCard.response.status, 200);
  assert.equal(aliasAgent.response.status, 200);
  assert.equal(aliasAgentCard.response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(aliasAgent.response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.deepEqual(aliasAgentCard.payload, canonical.payload);
  assert.deepEqual(aliasAgent.payload, canonical.payload);
});

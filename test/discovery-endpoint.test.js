import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import {
  DISCOVERY_SCHEMA_VERSION,
  HEALTH_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  MACHINE_ENDPOINTS
} from "../src/artifacts/discovery.js";

async function fetchJson(path, accept = "application/json") {
  const response = await worker.fetch(new Request(`https://example.test${path}`, {
    headers: {
      accept
    }
  }));
  const payload = await response.json();
  return { response, payload };
}

test("discovery route returns deterministic endpoint map", async () => {
  const { response, payload } = await fetchJson(MACHINE_ENDPOINTS.discovery);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.equal(payload.schema_version, DISCOVERY_SCHEMA_VERSION);
  assert.equal(payload.endpoints.discovery.path, MACHINE_ENDPOINTS.discovery);
  assert.equal(payload.endpoints.health.path, MACHINE_ENDPOINTS.health);
  assert.equal(payload.endpoints.capabilities_current.path, MACHINE_ENDPOINTS.capabilitiesCurrent);
  assert.equal(payload.endpoints.capabilities_planned.path, MACHINE_ENDPOINTS.capabilitiesPlanned);
  assert.equal(payload.endpoints.fit_criteria.path, MACHINE_ENDPOINTS.fitCriteria);
});

test("health route responds with explicit health content type", async () => {
  const { response, payload } = await fetchJson(MACHINE_ENDPOINTS.health);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), HEALTH_CONTENT_TYPE);
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.equal(payload.status, "ok");
});

test("capability artifacts keep current and planned lifecycle separate", async () => {
  const currentResult = await fetchJson(MACHINE_ENDPOINTS.capabilitiesCurrent);
  const plannedResult = await fetchJson(MACHINE_ENDPOINTS.capabilitiesPlanned);

  assert.equal(currentResult.payload.lifecycle, "current");
  assert.equal(plannedResult.payload.lifecycle, "planned");

  const currentIds = new Set(currentResult.payload.capabilities.map((item) => item.id));
  const plannedIds = new Set(plannedResult.payload.capabilities.map((item) => item.id));

  for (const id of plannedIds) {
    assert.equal(currentIds.has(id), false, `capability ${id} should not appear in both lifecycles`);
  }
});

test("router returns 404 for unknown path", async () => {
  const response = await worker.fetch(new Request("https://example.test/unknown"));
  assert.equal(response.status, 404);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
});

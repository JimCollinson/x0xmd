import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

async function fetchInstallArtifact() {
  const response = await worker.fetch(new Request(`https://example.test${MACHINE_ENDPOINTS.install}`));
  const payload = await response.json();
  return { response, payload };
}

test("install endpoint returns versioned machine contract", async () => {
  const { response, payload } = await fetchInstallArtifact();

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");
  assert.equal(typeof payload.contract_version, "string");
  assert.equal(payload.daemon.binary, "x0xd");
  assert.equal(payload.daemon.api_base_url, "http://127.0.0.1:12700");
  assert.ok(Array.isArray(payload.lifecycle.current.pathways));
  assert.ok(Array.isArray(payload.lifecycle.current.verification_probes));
  assert.ok(Array.isArray(payload.lifecycle.current.verification_matrix));
  assert.ok(Array.isArray(payload.lifecycle.planned));
});

test("install contract covers linux, macos, and windows verification", async () => {
  const { payload } = await fetchInstallArtifact();

  const pathways = new Map(payload.lifecycle.current.pathways.map((item) => [item.id, item]));
  const probes = new Map(payload.lifecycle.current.verification_probes.map((item) => [item.id, item]));

  const expectedPlatforms = ["linux", "macos", "windows"];
  for (const platform of expectedPlatforms) {
    const row = payload.lifecycle.current.verification_matrix.find((entry) => entry.platform === platform);
    assert.ok(row, `missing verification matrix row for ${platform}`);

    for (const pathwayId of row.pathway_ids) {
      assert.ok(pathways.has(pathwayId), `missing pathway ${pathwayId} referenced by ${platform}`);
      assert.equal(pathways.get(pathwayId).non_interactive, true);
    }

    for (const probeId of row.verify_probe_ids) {
      assert.ok(probes.has(probeId), `missing verification probe ${probeId} referenced by ${platform}`);
      const probe = probes.get(probeId);
      assert.equal(typeof probe.expected_signal, "object");
    }
  }
});

test("discovery endpoint includes install contract route", async () => {
  const response = await worker.fetch(new Request(`https://example.test${MACHINE_ENDPOINTS.discovery}`));
  const payload = await response.json();

  assert.equal(payload.endpoints.install.path, MACHINE_ENDPOINTS.install);
  assert.equal(payload.endpoints.install.content_type, JSON_CONTENT_TYPE);
});

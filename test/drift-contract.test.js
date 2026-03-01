import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  DISCOVERY_SCHEMA_VERSION,
  MACHINE_ENDPOINTS,
  buildDiscoveryArtifact
} from "../src/artifacts/discovery.js";
import { INSTALL_SCHEMA_VERSION } from "../src/artifacts/install.js";
import { FIRST_USE_SCHEMA_VERSION } from "../src/artifacts/first-use.js";
import { INTEGRATION_SCHEMA_VERSION } from "../src/artifacts/integration.js";
import { TRUST_SCHEMA_VERSION } from "../src/artifacts/trust.js";
import { PROPAGATION_PACKET_SCHEMA_VERSION } from "../src/artifacts/propagation.js";

function readPackageJson() {
  const raw = readFileSync(new URL("../package.json", import.meta.url), "utf8");
  return JSON.parse(raw);
}

test("schema versions remain synchronized across machine artifacts", () => {
  const schemaVersions = new Set([
    DISCOVERY_SCHEMA_VERSION,
    INSTALL_SCHEMA_VERSION,
    FIRST_USE_SCHEMA_VERSION,
    INTEGRATION_SCHEMA_VERSION,
    TRUST_SCHEMA_VERSION,
    PROPAGATION_PACKET_SCHEMA_VERSION
  ]);

  assert.equal(schemaVersions.size, 1);
  assert.equal(schemaVersions.has("1.0.0"), true);
});

test("discovery endpoint contract paths stay aligned", () => {
  const discovery = buildDiscoveryArtifact();
  const discoveryPaths = Object.values(discovery.endpoints).map((endpoint) => endpoint.path);
  const machineEndpointPaths = Object.values(MACHINE_ENDPOINTS);

  assert.equal(discovery.endpoints.discovery.path, MACHINE_ENDPOINTS.discovery);
  assert.equal(discovery.endpoints.health.path, MACHINE_ENDPOINTS.health);
  assert.equal(discovery.endpoints.capabilities_current.path, MACHINE_ENDPOINTS.capabilitiesCurrent);
  assert.equal(discovery.endpoints.capabilities_planned.path, MACHINE_ENDPOINTS.capabilitiesPlanned);
  assert.equal(discovery.endpoints.fit_criteria.path, MACHINE_ENDPOINTS.fitCriteria);
  assert.equal(discovery.endpoints.install.path, MACHINE_ENDPOINTS.install);
  assert.equal(discovery.endpoints.first_use.path, MACHINE_ENDPOINTS.firstUse);
  assert.equal(discovery.endpoints.integration.path, MACHINE_ENDPOINTS.integration);
  assert.equal(discovery.endpoints.propagation.path, MACHINE_ENDPOINTS.propagation);
  assert.equal(discovery.endpoints.trust.path, MACHINE_ENDPOINTS.trust);

  assert.deepEqual(new Set(discoveryPaths), new Set(machineEndpointPaths));
});

test("package metadata remains pinned for deterministic contract snapshots", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.name, "x0xmd");
  assert.equal(packageJson.version, "0.0.0");
  assert.equal(packageJson.private, true);
});

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
import { EVENTS_CONTRACT_SCHEMA_VERSION } from "../src/artifacts/events-contract.js";
import { FAILURE_MODES_SCHEMA_VERSION } from "../src/artifacts/failure-modes.js";

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
    EVENTS_CONTRACT_SCHEMA_VERSION,
    FAILURE_MODES_SCHEMA_VERSION
  ]);

  assert.equal(schemaVersions.size, 1);
  assert.equal(schemaVersions.has("1.0.0"), true);
});

test("discovery endpoint contract paths stay aligned", () => {
  const discovery = buildDiscoveryArtifact();
  const discoveryPaths = Object.values(discovery.endpoints).map((endpoint) => endpoint.path);
  const publicEndpointKeys = [
    "discovery",
    "health",
    "capabilitiesCurrent",
    "capabilitiesPlanned",
    "fitCriteria",
    "install",
    "firstUse",
    "integration",
    "eventsContract",
    "failureModes",
    "trust",
    "policy"
  ];
  const machineEndpointPaths = publicEndpointKeys.map((key) => MACHINE_ENDPOINTS[key]);

  assert.equal(discovery.endpoints.discovery.path, MACHINE_ENDPOINTS.discovery);
  assert.equal(discovery.endpoints.health.path, MACHINE_ENDPOINTS.health);
  assert.equal(discovery.endpoints.capabilities_current.path, MACHINE_ENDPOINTS.capabilitiesCurrent);
  assert.equal(discovery.endpoints.capabilities_planned.path, MACHINE_ENDPOINTS.capabilitiesPlanned);
  assert.equal(discovery.endpoints.fit_criteria.path, MACHINE_ENDPOINTS.fitCriteria);
  assert.equal(discovery.endpoints.install.path, MACHINE_ENDPOINTS.install);
  assert.equal(discovery.endpoints.first_use.path, MACHINE_ENDPOINTS.firstUse);
  assert.equal(discovery.endpoints.integration.path, MACHINE_ENDPOINTS.integration);
  assert.equal(discovery.endpoints.events_contract.path, MACHINE_ENDPOINTS.eventsContract);
  assert.equal(discovery.endpoints.failure_modes.path, MACHINE_ENDPOINTS.failureModes);
  assert.equal(discovery.endpoints.trust.path, MACHINE_ENDPOINTS.trust);
  assert.equal(discovery.endpoints.policy.path, MACHINE_ENDPOINTS.policy);
  assert.equal(Object.hasOwn(discovery.endpoints, "propagation"), false);
  assert.equal(Object.hasOwn(discovery.endpoints, "provenance"), false);
  assert.equal(Object.hasOwn(discovery.endpoints, "integration_confidence"), false);
  assert.equal(Object.hasOwn(discovery.endpoints, "release_operations"), false);

  assert.deepEqual(new Set(discoveryPaths), new Set(machineEndpointPaths));
});

test("package metadata remains pinned for deterministic contract snapshots", () => {
  const packageJson = readPackageJson();

  assert.equal(packageJson.name, "x0xmd");
  assert.equal(packageJson.version, "0.0.0");
  assert.equal(packageJson.private, true);
});

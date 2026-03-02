import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

import {
  buildEventsContractArtifact,
  EVENTS_CONTRACT_PATH,
  EVENTS_CONTRACT_SCHEMA_VERSION
} from "../src/artifacts/events-contract.js";
import {
  buildFailureModesArtifact,
  FAILURE_MODES_PATH,
  FAILURE_MODES_SCHEMA_VERSION
} from "../src/artifacts/failure-modes.js";
import { buildPolicyArtifact, POLICY_PATH, POLICY_SCHEMA_VERSION } from "../src/artifacts/policy.js";
import { buildDiscoveryArtifact, DISCOVERY_SCHEMA_VERSION, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";
import { TRUST_SCHEMA_VERSION } from "../src/artifacts/trust.js";

function readWranglerToml() {
  return readFileSync(new URL("../wrangler.toml", import.meta.url), "utf8");
}

test("phase 02 hardening artifacts expose aligned contract paths", () => {
  const discovery = buildDiscoveryArtifact();

  assert.equal(discovery.endpoints.events_contract.path, EVENTS_CONTRACT_PATH);
  assert.equal(discovery.endpoints.failure_modes.path, FAILURE_MODES_PATH);
  assert.equal(discovery.endpoints.policy.path, POLICY_PATH);
  assert.equal(Object.hasOwn(discovery.endpoints, "provenance"), false);
  assert.equal(Object.hasOwn(discovery.endpoints, "integration_confidence"), false);
  assert.equal(Object.hasOwn(discovery.endpoints, "release_operations"), false);
  assert.equal(Object.hasOwn(discovery.endpoints, "propagation"), false);
  assert.equal(discovery.endpoints.discovery.path, MACHINE_ENDPOINTS.discovery);
});

test("cross-artifact schema versions and policy/failure pointers stay synchronized", () => {
  const versions = new Set([
    DISCOVERY_SCHEMA_VERSION,
    EVENTS_CONTRACT_SCHEMA_VERSION,
    FAILURE_MODES_SCHEMA_VERSION,
    POLICY_SCHEMA_VERSION,
    TRUST_SCHEMA_VERSION
  ]);

  assert.equal(versions.size, 1);

  const events = buildEventsContractArtifact();
  const policy = buildPolicyArtifact();
  const failureModes = buildFailureModesArtifact();

  assert.equal(typeof events.delivery_semantics, "object");
  assert.equal(Object.hasOwn(policy, "evaluation_contract"), false);
  assert.equal(Array.isArray(failureModes.lifecycle.current.matrix), true);
});

test("wrangler config enables node compatibility for provenance hashing", () => {
  const wranglerToml = readWranglerToml();

  assert.match(wranglerToml, /^compatibility_date\s*=\s*"\d{4}-\d{2}-\d{2}"/m);
  assert.match(wranglerToml, /^compatibility_flags\s*=\s*\[\s*"nodejs_compat"\s*\]/m);
});

import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";
import { PROPAGATION_PACKET_PATH } from "../src/artifacts/propagation.js";

async function fetchJson(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`));
  const payload = await response.json();
  return { response, payload };
}

test("propagation packet exposes reverify block with authoritative endpoints", async () => {
  const { response, payload } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.equal(response.status, 200);
  assert.equal(payload.reverify.authoritative_endpoints.discovery, MACHINE_ENDPOINTS.discovery);
  assert.equal(payload.reverify.authoritative_endpoints.capabilities_current, MACHINE_ENDPOINTS.capabilitiesCurrent);
  assert.equal(payload.reverify.authoritative_endpoints.install, MACHINE_ENDPOINTS.install);
  assert.equal(payload.reverify.authoritative_endpoints.provenance, MACHINE_ENDPOINTS.provenance);
  assert.equal(payload.reverify.authoritative_endpoints.release_operations, MACHINE_ENDPOINTS.releaseOperations);
});

test("reverify command references include endpoint checks and install probes", async () => {
  const { payload } = await fetchJson(PROPAGATION_PACKET_PATH);

  assert.equal(Array.isArray(payload.reverify.command_references), true);
  assert.equal(payload.reverify.command_references.length >= 4, true);

  for (const entry of payload.reverify.command_references) {
    assert.equal(typeof entry.id, "string");
    assert.equal(typeof entry.command_unix, "string");
    assert.equal(typeof entry.command_windows, "string");
    assert.equal(typeof entry.expected_signal, "object");
  }

  assert.equal(Array.isArray(payload.reverify.install_probe_commands), true);
  assert.equal(payload.reverify.install_probe_commands.length > 0, true);
});

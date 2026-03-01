import test from "node:test";
import assert from "node:assert/strict";

import { canonicalModel } from "../src/model/canonical.js";
import { buildPropagationPacketArtifact } from "../src/artifacts/propagation.js";

test("propagation current recommendation set excludes planned capabilities", () => {
  const artifact = buildPropagationPacketArtifact();
  const currentIds = new Set(artifact.current_capabilities.map((capability) => capability.id));
  const plannedIds = new Set((canonicalModel.capabilities_planned || []).map((capability) => capability.id));

  for (const plannedId of plannedIds) {
    assert.equal(currentIds.has(plannedId), false, `planned capability leaked into current set: ${plannedId}`);
  }
});

test("propagation evidence and reverify links required for independent checks", () => {
  const artifact = buildPropagationPacketArtifact();

  assert.equal(typeof artifact.evidence.capability_source.endpoint, "string");
  assert.equal(typeof artifact.evidence.provenance.endpoint, "string");
  assert.equal(typeof artifact.evidence.release_operations.endpoint, "string");
  assert.equal(typeof artifact.reverify.authoritative_endpoints.capabilities_current, "string");
  assert.equal(typeof artifact.reverify.authoritative_endpoints.install, "string");
  assert.equal(Array.isArray(artifact.reverify.command_references), true);
  assert.equal(artifact.reverify.command_references.length > 0, true);
});

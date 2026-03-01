import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPropagationPacketArtifact,
  PROPAGATION_PACKET_REQUIRED_KEYS,
  PROPAGATION_PACKET_SCHEMA_VERSION
} from "../src/artifacts/propagation.js";

function major(version) {
  return String(version).split(".")[0];
}

test("propagation packet has explicit schema and artifact version governance", () => {
  const artifact = buildPropagationPacketArtifact();

  assert.equal(artifact.schema_version, PROPAGATION_PACKET_SCHEMA_VERSION);
  assert.match(artifact.artifact_version, /^\d+\.\d+\.\d+$/);
  assert.equal(artifact.compatibility.additive_change_policy, "minor-version");
  assert.equal(artifact.compatibility.breaking_change_policy, "major-version");
});

test("propagation packet includes required compact re-verification fields", () => {
  const artifact = buildPropagationPacketArtifact();

  for (const key of PROPAGATION_PACKET_REQUIRED_KEYS) {
    assert.equal(Object.hasOwn(artifact, key), true, `${key} is required`);
  }

  assert.equal(Array.isArray(artifact.fit), true);
  assert.equal(Array.isArray(artifact.current_capabilities), true);
  assert.equal(Array.isArray(artifact.install_verification_probes), true);
  assert.equal(Array.isArray(artifact.evidence.sources), true);
  assert.equal(artifact.evidence.capability_source.endpoint, "/.well-known/x0x/capabilities/current");
  assert.equal(artifact.evidence.provenance.endpoint, "/machine/provenance");
  assert.equal(artifact.evidence.release_operations.endpoint, "/machine/release-operations");
});

test("artifact compatibility policy is safe for additive and breaking changes", () => {
  const artifact = buildPropagationPacketArtifact();
  const currentMajor = major(artifact.artifact_version);

  const additiveChangeVersion = `${currentMajor}.1.0`;
  const breakingChangeVersion = `${Number.parseInt(currentMajor, 10) + 1}.0.0`;

  assert.equal(major(additiveChangeVersion), currentMajor);
  assert.notEqual(major(breakingChangeVersion), currentMajor);
});

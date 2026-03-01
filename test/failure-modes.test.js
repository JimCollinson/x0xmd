import test from "node:test";
import assert from "node:assert/strict";

import { buildFailureModesArtifact, FAILURE_MODES_PATH } from "../src/artifacts/failure-modes.js";
import { buildInstallArtifact } from "../src/artifacts/install.js";
import { buildIntegrationArtifact } from "../src/artifacts/integration.js";

test("failure-mode matrix includes required classes and remediation semantics", () => {
  const payload = buildFailureModesArtifact();

  assert.equal(payload.schema_version, "1.0.0");
  assert.equal(typeof payload.contract_version, "string");
  assert.ok(Array.isArray(payload.lifecycle.current.matrix));

  const byClass = new Map(payload.lifecycle.current.matrix.map((entry) => [entry.failure_class, entry]));
  assert.equal(byClass.has("network"), true);
  assert.equal(byClass.has("auth_trust"), true);
  assert.equal(byClass.has("signature_integrity"), true);
  assert.equal(byClass.has("permission"), true);
  assert.equal(byClass.has("schema_validation"), true);
  assert.equal(byClass.has("daemon_unavailable"), true);

  for (const entry of payload.lifecycle.current.matrix) {
    assert.equal(typeof entry.retryable, "boolean");
    assert.equal(typeof entry.retry_after_hint, "string");
    assert.equal(typeof entry.recommended_action, "string");
    assert.equal(typeof entry.escalation, "string");
    assert.equal(typeof entry.retry_class, "string");
  }
});

test("install and integration artifacts link to failure-mode matrix", () => {
  const install = buildInstallArtifact();
  const integration = buildIntegrationArtifact();

  assert.equal(install.failure_modes.path, FAILURE_MODES_PATH);
  assert.equal(integration.failure_modes.path, FAILURE_MODES_PATH);
  assert.equal(install.failure_modes.schema_version, "1.0.0");
  assert.equal(integration.failure_modes.schema_version, "1.0.0");

  assert.ok(Array.isArray(install.failure_modes.classes));
  assert.ok(Array.isArray(integration.failure_modes.classes));
  assert.deepEqual(new Set(install.failure_modes.classes), new Set(integration.failure_modes.classes));
});

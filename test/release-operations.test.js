import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { buildDiscoveryArtifact, MACHINE_ENDPOINTS, JSON_CONTENT_TYPE } from "../src/artifacts/discovery.js";
import {
  buildReleaseOperationsArtifact,
  RELEASE_OPERATIONS_PATH,
  RELEASE_OPERATIONS_SCHEMA_VERSION
} from "../src/artifacts/release-operations.js";

async function fetchJson(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`));
  const payload = await response.json();
  return { response, payload };
}

test("release operations artifact exposes stable schema and evidence requirements", () => {
  const artifact = buildReleaseOperationsArtifact();

  assert.equal(artifact.schema_version, RELEASE_OPERATIONS_SCHEMA_VERSION);
  assert.equal(artifact.workflow.workflow_file, ".github/workflows/deploy.yml");
  assert.equal(artifact.workflow.required_secrets.includes("CLOUDFLARE_API_TOKEN"), true);
  assert.equal(artifact.workflow.required_secrets.includes("CLOUDFLARE_ACCOUNT_ID"), true);
  assert.equal(artifact.evidence.required_keys.includes("deploy.run_url"), true);
  assert.equal(artifact.evidence.required_keys.includes("evaluation.report_path"), true);
  assert.equal(artifact.version.phase, "03-propagation-and-operations");
  assert.equal(artifact.version.plan, "03-01");
});

test("discovery artifact includes release operations endpoint", () => {
  const discovery = buildDiscoveryArtifact();

  assert.equal(discovery.endpoints.release_operations.path, MACHINE_ENDPOINTS.releaseOperations);
  assert.equal(discovery.endpoints.release_operations.content_type, JSON_CONTENT_TYPE);
});

test("release operations endpoint serves machine-readable contract", async () => {
  const { response, payload } = await fetchJson(RELEASE_OPERATIONS_PATH);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(response.headers.get("cache-control"), "public, max-age=300");
  assert.equal(payload.schema_version, RELEASE_OPERATIONS_SCHEMA_VERSION);
  assert.equal(payload.workflow.dispatch_command_template.includes("gh workflow run deploy.yml --ref <branch>"), true);
  assert.equal(payload.evidence.schema_path, "docs/ops/release-evidence.schema.json");
});

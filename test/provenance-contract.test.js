import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

async function fetchJson(path) {
  const response = await worker.fetch(new Request(`https://example.test${path}`, {
    headers: {
      accept: "application/json"
    }
  }));
  const payload = await response.json();
  return { response, payload };
}

test("provenance endpoint publishes signed-pointer metadata and digests", async () => {
  const { response, payload } = await fetchJson(MACHINE_ENDPOINTS.provenance);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");
  assert.equal(typeof payload.generated_at, "string");

  assert.equal(payload.signer.signer_type, "verification-procedure-pointer");
  assert.match(payload.signer.verification_doc_url, /^https:\/\//);
  assert.equal(payload.signer.signature_material, "not_embedded");

  const artifactIds = payload.artifacts.map((artifact) => artifact.id);
  assert.deepEqual(artifactIds, ["discovery", "trust", "policy"]);

  for (const artifact of payload.artifacts) {
    assert.match(artifact.path, /^\//);
    assert.match(artifact.source_uri, /^https:\/\//);
    assert.equal(artifact.digest.algorithm, "sha256");
    assert.match(artifact.digest.value, /^[a-f0-9]{64}$/);
    assert.equal(Array.isArray(artifact.source_references), true);
    assert.equal(artifact.source_references.length > 0, true);
  }
});

test("discovery and trust artifacts link to provenance metadata", async () => {
  const { payload: discovery } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(discovery.endpoints.provenance.path, MACHINE_ENDPOINTS.provenance);

  const { payload: trust } = await fetchJson(MACHINE_ENDPOINTS.trust);
  assert.equal(trust.provenance.path, MACHINE_ENDPOINTS.provenance);
  assert.equal(trust.provenance.schema_version, "1.0.0");
});

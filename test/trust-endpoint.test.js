import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE, MACHINE_ENDPOINTS } from "../src/artifacts/discovery.js";

async function fetchJson(path, accept = "application/json") {
  const response = await worker.fetch(new Request(`https://example.test${path}`, {
    headers: {
      accept
    }
  }));
  const payload = await response.json();
  return { response, payload };
}

test("trust endpoint returns machine-readable policy with lifecycle labels", async () => {
  const { response, payload } = await fetchJson(MACHINE_ENDPOINTS.trust);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");
  assert.equal(typeof payload.contract_version, "string");

  assert.equal(payload.lifecycle.current.controls.message_signatures.status, "current");
  assert.equal(payload.lifecycle.current.controls.contact_trust_filtering.status, "current");
  assert.equal(payload.lifecycle.current.controls.install_signature_verification.status, "current");
  assert.ok(Array.isArray(payload.lifecycle.planned));
  assert.equal(payload.lifecycle.planned.length > 0, true);
});

test("trust endpoint includes disclosure contacts and policy guidance", async () => {
  const { payload } = await fetchJson(MACHINE_ENDPOINTS.trust);

  assert.equal(payload.lifecycle.current.disclosure.security_email, "security@saorsalabs.com");
  assert.equal(payload.lifecycle.current.disclosure.issues_url, "https://github.com/saorsa-labs/x0x/issues");
  assert.ok(Array.isArray(payload.lifecycle.current.policy_guidance));
  assert.equal(payload.lifecycle.current.policy_guidance.length > 0, true);
});

test("root html and discovery map link to trust endpoint", async () => {
  const htmlResponse = await worker.fetch(new Request("https://example.test/", {
    headers: {
      accept: "text/html"
    }
  }));
  const htmlBody = await htmlResponse.text();

  assert.match(htmlBody, /\/machine\/trust/);

  const { payload: discoveryPayload } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(discoveryPayload.endpoints.trust.path, MACHINE_ENDPOINTS.trust);

  const { payload: rootMachinePayload } = await fetchJson("/");
  assert.equal(rootMachinePayload.trust_metadata_endpoint, MACHINE_ENDPOINTS.trust);
});

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

test("policy endpoint publishes deterministic input/output evaluation schema", async () => {
  const { response, payload } = await fetchJson(MACHINE_ENDPOINTS.policy);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  assert.equal(payload.schema_version, "1.0.0");

  const inputFields = payload.evaluation_contract.input_schema.required_fields.map((field) => field.name);
  assert.deepEqual(inputFields, ["sender_trust_level", "signature_state", "action_class", "endpoint_context"]);

  const outputFields = payload.evaluation_contract.output_schema.required_fields.map((field) => field.name);
  assert.deepEqual(outputFields, ["decision", "reason_code"]);

  const decisionField = payload.evaluation_contract.output_schema.required_fields.find((field) => field.name === "decision");
  assert.deepEqual(decisionField.enum, ["allow", "deny", "needs-human"]);
});

test("policy endpoint provides action-class rules and deterministic machine examples", async () => {
  const { payload } = await fetchJson(MACHINE_ENDPOINTS.policy);

  assert.equal(Array.isArray(payload.deterministic_rules), true);
  assert.equal(payload.deterministic_rules.length >= 4, true);

  const rulesByAction = new Map(payload.deterministic_rules.map((rule) => [rule.action_class, rule]));
  assert.equal(rulesByAction.get("publish").required_signatures, true);
  assert.equal(rulesByAction.get("subscribe").default_decision, "allow");
  assert.equal(rulesByAction.get("mutate_contacts").default_decision, "needs-human");
  assert.equal(rulesByAction.get("task_list_write").default_decision, "needs-human");

  const examples = new Map(payload.evaluation_examples.map((example) => [example.id, example]));
  assert.equal(examples.get("allow-trusted-publish").output.decision, "allow");
  assert.equal(examples.get("deny-invalid-signature").output.reason_code, "policy.deny.signature-required");
  assert.equal(examples.get("needs-human-contact-mutation").output.decision, "needs-human");
  assert.equal(examples.get("deny-blocked-subscribe").output.reason_code, "policy.deny.blocked-trust");
});

test("discovery and root hints expose policy endpoint reference", async () => {
  const { payload: discovery } = await fetchJson(MACHINE_ENDPOINTS.discovery);
  assert.equal(discovery.endpoints.policy.path, MACHINE_ENDPOINTS.policy);

  const { payload: rootHints } = await fetchJson("/");
  assert.equal(rootHints.policy_metadata_endpoint, MACHINE_ENDPOINTS.policy);
});

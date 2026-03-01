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

test("trust contract publishes complete taxonomy and action gating matrix", async () => {
  const { response, payload } = await fetchJson(MACHINE_ENDPOINTS.trust);

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);

  const trustLevelIds = payload.trust_levels.map((level) => level.id);
  assert.deepEqual(trustLevelIds, ["unknown", "known", "trusted", "blocked"]);

  for (const level of payload.trust_levels) {
    assert.equal(typeof level.semantics, "string");
    assert.equal(typeof level.operational_outcome, "string");
  }

  const matrixByAction = new Map(payload.action_gating_matrix.map((entry) => [entry.action_class, entry]));
  assert.equal(matrixByAction.has("publish"), true);
  assert.equal(matrixByAction.has("subscribe"), true);
  assert.equal(matrixByAction.has("mutate_contacts"), true);
  assert.equal(matrixByAction.has("task_list_write"), true);

  assert.deepEqual(matrixByAction.get("publish").allowed_levels, ["known", "trusted"]);
  assert.deepEqual(matrixByAction.get("publish").blocked_levels, ["unknown", "blocked"]);
  assert.equal(matrixByAction.get("subscribe").decision_default, "allow");
  assert.equal(matrixByAction.get("mutate_contacts").decision_default, "needs-human");
  assert.equal(matrixByAction.get("task_list_write").required_signatures, true);
});

test("trust contract includes deterministic transitions and explicit current vs planned controls", async () => {
  const { payload } = await fetchJson(MACHINE_ENDPOINTS.trust);

  assert.equal(Array.isArray(payload.default_transitions), true);
  assert.equal(payload.default_transitions.length >= 5, true);

  for (const transition of payload.default_transitions) {
    assert.equal(typeof transition.from, "string");
    assert.equal(typeof transition.to, "string");
    assert.equal(typeof transition.trigger, "string");
    assert.equal(typeof transition.transition_class, "string");
  }

  assert.equal(Array.isArray(payload.threat_assumptions), true);
  assert.equal(payload.threat_assumptions.length >= 1, true);

  const controlLabels = payload.lifecycle.current.controls_current_vs_planned;
  assert.equal(Array.isArray(controlLabels.current), true);
  assert.equal(Array.isArray(controlLabels.planned), true);
  assert.equal(controlLabels.current.some((entry) => entry.control_id === "message_signatures"), true);
  assert.equal(controlLabels.planned.some((entry) => entry.control_id === "reputation_weighted_trust"), true);
});

import test from "node:test";
import assert from "node:assert/strict";

import { canonicalModel, validateCanonicalModel } from "../src/model/canonical.js";

test("canonical model validates with lifecycle separation", () => {
  assert.equal(validateCanonicalModel(canonicalModel), true);
  assert.ok(Array.isArray(canonicalModel.capabilities_current));
  assert.ok(Array.isArray(canonicalModel.capabilities_planned));
});

test("validation fails if capability is in both current and planned", () => {
  const duplicateId = canonicalModel.capabilities_current[0].id;
  const invalidModel = {
    ...canonicalModel,
    capabilities_planned: [
      ...canonicalModel.capabilities_planned,
      {
        id: duplicateId,
        description: "duplicate lifecycle entry",
        evidence: ["plan-01-01"]
      }
    ]
  };

  assert.throws(
    () => validateCanonicalModel(invalidModel),
    /Capability lifecycle conflict/
  );
});

test("validation fails if capability has no evidence", () => {
  const invalidModel = {
    ...canonicalModel,
    capabilities_current: [
      ...canonicalModel.capabilities_current,
      {
        id: "missing-evidence",
        description: "invalid capability",
        evidence: []
      }
    ]
  };

  assert.throws(
    () => validateCanonicalModel(invalidModel),
    /Capability missing evidence/
  );
});

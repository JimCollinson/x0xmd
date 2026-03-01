import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

function loadJson(relativePath) {
  return JSON.parse(readFileSync(new URL(relativePath, import.meta.url), "utf8"));
}

function assertRequiredKeysPresent(requiredKeys, value, prefix = "") {
  for (const key of requiredKeys) {
    assert.equal(Object.hasOwn(value, key), true, `${prefix}${key} is required`);
  }
}

test("release evidence schema defines required deploy and evaluation pointers", () => {
  const schema = loadJson("../docs/ops/release-evidence.schema.json");

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(schema.type, "object");
  assert.equal(schema.additionalProperties, false);

  assertRequiredKeysPresent(
    ["schema_version", "generated_at", "branch", "commit", "deploy", "evaluation", "decision"],
    Object.fromEntries(schema.required.map((key) => [key, true])),
    "root."
  );

  assert.equal(schema.properties.deploy.type, "object");
  assert.equal(schema.properties.evaluation.type, "object");

  assert.deepEqual(schema.properties.decision.properties.status.enum, ["pending", "promote", "reject", "defer"]);
});

test("release evidence example conforms to schema-required field conventions", () => {
  const schema = loadJson("../docs/ops/release-evidence.schema.json");
  const example = loadJson("../docs/ops/release-evidence.example.json");

  assertRequiredKeysPresent(schema.required, example, "root.");
  assertRequiredKeysPresent(schema.properties.deploy.required, example.deploy, "deploy.");
  assertRequiredKeysPresent(schema.properties.evaluation.required, example.evaluation, "evaluation.");
  assertRequiredKeysPresent(schema.properties.decision.required, example.decision, "decision.");

  assert.match(example.commit, new RegExp(schema.properties.commit.pattern));
  assert.match(example.deploy.run_url, new RegExp(schema.properties.deploy.properties.run_url.pattern));
  assert.match(example.deploy.preview_url, new RegExp(schema.properties.deploy.properties.preview_url.pattern));
  assert.match(example.evaluation.report_path, new RegExp(schema.properties.evaluation.properties.report_path.pattern));

  assert.equal(
    schema.properties.evaluation.properties.status.enum.includes(example.evaluation.status),
    true,
    "evaluation.status must use schema enum"
  );

  assert.equal(
    schema.properties.decision.properties.status.enum.includes(example.decision.status),
    true,
    "decision.status must use schema enum"
  );
});

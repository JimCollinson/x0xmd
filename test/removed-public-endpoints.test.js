import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";
import { JSON_CONTENT_TYPE } from "../src/artifacts/discovery.js";

const REMOVED_ENDPOINTS = [
  "/machine/provenance",
  "/machine/integration-confidence",
  "/machine/release-operations",
  "/machine/propagation"
];

test("removed machine endpoints return 404", async () => {
  for (const path of REMOVED_ENDPOINTS) {
    const response = await worker.fetch(new Request(`https://example.test${path}`, {
      headers: {
        accept: "application/json"
      }
    }));

    assert.equal(response.status, 404, `${path} should return 404`);
    assert.equal(response.headers.get("content-type"), JSON_CONTENT_TYPE);
  }
});

test("removed machine endpoints are absent from root hints and html", async () => {
  const rootHintResponse = await worker.fetch(new Request("https://example.test/", {
    headers: {
      accept: "application/json"
    }
  }));
  const rootHints = await rootHintResponse.json();

  for (const path of REMOVED_ENDPOINTS) {
    const serialized = JSON.stringify(rootHints);
    assert.equal(serialized.includes(path), false, `${path} should not appear in root hints`);
  }

  const rootHtmlResponse = await worker.fetch(new Request("https://example.test/", {
    headers: {
      accept: "text/html"
    }
  }));
  const rootHtml = await rootHtmlResponse.text();

  for (const path of REMOVED_ENDPOINTS) {
    assert.equal(rootHtml.includes(path), false, `${path} should not appear in root html`);
  }
});

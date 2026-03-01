import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";

const ROOT_CACHE_CONTROL = "public, max-age=120";

async function fetchRoot(accept) {
  const headers = {};
  if (accept) {
    headers.accept = accept;
  }

  const response = await worker.fetch(new Request("https://example.test/", { headers }));
  const body = await response.text();
  return { response, body };
}

test("root serves browser html when text/html is preferred", async () => {
  const { response, body } = await fetchRoot("text/html,application/xhtml+xml;q=0.9");

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
  assert.equal(response.headers.get("vary"), "Accept");
  assert.equal(response.headers.get("cache-control"), ROOT_CACHE_CONTROL);
  assert.match(body, /x0xmd discovery surface/);
});

test("root serves machine hint json for application/json", async () => {
  const { response, body } = await fetchRoot("application/json");

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(response.headers.get("vary"), "Accept");
  assert.equal(response.headers.get("cache-control"), ROOT_CACHE_CONTROL);

  const payload = JSON.parse(body);
  assert.equal(payload.machine_entrypoint, "/.well-known/x0x/discovery");
  assert.equal(payload.content_type, "application/json; charset=utf-8");
});

test("root serves machine hint json for wildcard or missing accept", async () => {
  const wildcard = await fetchRoot("*/*");
  const missing = await fetchRoot();

  assert.equal(wildcard.response.headers.get("content-type"), "application/json; charset=utf-8");
  assert.equal(missing.response.headers.get("content-type"), "application/json; charset=utf-8");
});

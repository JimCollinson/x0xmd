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

test("root respects q-weighting when html has lower preference", async () => {
  const { response } = await fetchRoot("text/html;q=0.3,application/json;q=0.9");

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
});

test("root serves html when wildcard exists but html is more specific", async () => {
  const { response } = await fetchRoot("*/*;q=0.4,text/html;q=0.4");

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "text/html; charset=utf-8");
});

test("root stays machine-first when html and json tie exactly", async () => {
  const { response } = await fetchRoot("text/html;q=0.7,application/json;q=0.7");

  assert.equal(response.status, 200);
  assert.equal(response.headers.get("content-type"), "application/json; charset=utf-8");
});

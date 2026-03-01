import test from "node:test";
import assert from "node:assert/strict";

import worker from "../src/index.js";

const env = {
  INSTALL_SCRIPT_URL:
    "https://raw.githubusercontent.com/JimCollinson/x0x/main/scripts/install.sh",
  SKILL_URL:
    "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md",
  SKILL_SIGNATURE_URL:
    "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig",
  GPG_KEY_URL:
    "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc",
};

const installScript = "#!/usr/bin/env bash\necho x0x\n";

const originalFetch = globalThis.fetch;

globalThis.fetch = async (input) => {
  const url = typeof input === "string" ? input : input.url;
  if (url === env.INSTALL_SCRIPT_URL) {
    return new Response(installScript, {
      status: 200,
      headers: {
        "content-type": "text/plain; charset=utf-8",
      },
    });
  }

  return new Response("Not Found", { status: 404 });
};

test.after(() => {
  globalThis.fetch = originalFetch;
});

test("root browser request returns HTML with negotiation headers", async () => {
  const request = new Request("https://x0x-md.example/", {
    headers: {
      accept: "text/html,application/xhtml+xml",
      "sec-fetch-mode": "navigate",
      "user-agent": "Mozilla/5.0",
    },
  });

  const response = await worker.fetch(request, env);

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html/);
  assert.equal(
    response.headers.get("vary"),
    "Accept, User-Agent, Sec-Fetch-Mode",
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
});

test("root CLI request returns installer script with negotiation headers", async () => {
  const request = new Request("https://x0x-md.example/", {
    headers: {
      accept: "*/*",
      "user-agent": "curl/8.5.0",
    },
  });

  const response = await worker.fetch(request, env);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/x-shellscript/,
  );
  assert.equal(
    response.headers.get("vary"),
    "Accept, User-Agent, Sec-Fetch-Mode",
  );
  assert.equal(response.headers.get("cache-control"), "no-store");
  assert.ok(body.startsWith("#!/usr/bin/env bash"));
});

test("install.sh route returns installer script", async () => {
  const request = new Request("https://x0x-md.example/install.sh", {
    headers: {
      "user-agent": "curl/8.5.0",
    },
  });

  const response = await worker.fetch(request, env);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/x-shellscript/,
  );
  assert.equal(response.headers.get("x-x0x-source"), env.INSTALL_SCRIPT_URL);
  assert.ok(body.includes("echo x0x"));
});

test("trust.json route returns machine-readable JSON", async () => {
  const request = new Request("https://x0x-md.example/trust.json");
  const response = await worker.fetch(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^application\/json/,
  );
  assert.equal(body.project, "x0x");
  assert.equal(typeof body.install?.command, "string");
});

test("agent.json route returns machine profile JSON", async () => {
  const request = new Request("https://x0x-md.example/agent.json");
  const response = await worker.fetch(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^application\/json/,
  );

  const identity = body.project || body.name;
  assert.equal(identity, "x0x");
  assert.equal(typeof body.install?.command, "string");
  assert.match(body.install.command, /curl -sfL .*\| sh/);
});

test("llms.txt route returns text payload", async () => {
  const request = new Request("https://x0x-md.example/llms.txt");
  const response = await worker.fetch(request, env);
  const body = await response.text();

  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/plain/);
  assert.match(body, /x0x/i);
});

test("api-reference route returns endpoint catalog", async () => {
  const request = new Request("https://x0x-md.example/api-reference.json");
  const response = await worker.fetch(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^application\/json/,
  );
  assert.ok(Array.isArray(body.endpoints));
  assert.ok(body.endpoints.length > 0);
});

test("health route returns ok JSON", async () => {
  const request = new Request("https://x0x-md.example/health");
  const response = await worker.fetch(request, env);
  const body = await response.json();

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^application\/json/,
  );
  assert.equal(body.status, "ok");
});

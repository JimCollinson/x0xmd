import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import {
  buildCapabilitiesCurrentArtifact,
  buildCapabilitiesPlannedArtifact,
  buildDiscoveryArtifact,
  buildFitCriteriaArtifact,
  buildHealthArtifact
} from "../../src/artifacts/discovery.js";
import { buildEventsContractArtifact } from "../../src/artifacts/events-contract.js";
import { buildFailureModesArtifact } from "../../src/artifacts/failure-modes.js";
import { buildFirstUseArtifact } from "../../src/artifacts/first-use.js";
import { buildInstallArtifact } from "../../src/artifacts/install.js";
import { buildIntegrationConfidenceArtifact } from "../../src/artifacts/integration-confidence.js";
import { buildIntegrationArtifact } from "../../src/artifacts/integration.js";
import { buildPolicyArtifact } from "../../src/artifacts/policy.js";
import { buildPropagationPacketArtifact } from "../../src/artifacts/propagation.js";
import { buildProvenanceArtifact } from "../../src/artifacts/provenance.js";
import { buildReleaseOperationsArtifact } from "../../src/artifacts/release-operations.js";
import { buildTrustArtifact } from "../../src/artifacts/trust.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const summaryDir = path.join(repoRoot, ".artifacts", "upstream-refresh");
const generatedDir = path.join(summaryDir, "generated");
const summaryPath = path.join(summaryDir, "summary.json");
const lockPath = path.join(repoRoot, ".github", "upstream-refresh-lock.json");

const UPSTREAM_REFS = [
  {
    id: "repo-main",
    url: "https://api.github.com/repos/saorsa-labs/x0x/branches/main",
    human_url: "https://github.com/saorsa-labs/x0x/tree/main",
    extractSha: (payload) => payload.commit?.sha
  },
  {
    id: "install-sh",
    url: "https://api.github.com/repos/saorsa-labs/x0x/contents/scripts/install.sh?ref=main",
    human_url: "https://github.com/saorsa-labs/x0x/blob/main/scripts/install.sh",
    extractSha: (payload) => payload.sha
  },
  {
    id: "install-py",
    url: "https://api.github.com/repos/saorsa-labs/x0x/contents/scripts/install.py?ref=main",
    human_url: "https://github.com/saorsa-labs/x0x/blob/main/scripts/install.py",
    extractSha: (payload) => payload.sha
  },
  {
    id: "install-ps1",
    url: "https://api.github.com/repos/saorsa-labs/x0x/contents/scripts/install.ps1?ref=main",
    human_url: "https://github.com/saorsa-labs/x0x/blob/main/scripts/install.ps1",
    extractSha: (payload) => payload.sha
  },
  {
    id: "verification-doc",
    url: "https://api.github.com/repos/saorsa-labs/x0x/contents/docs/VERIFICATION.md?ref=main",
    human_url: "https://github.com/saorsa-labs/x0x/blob/main/docs/VERIFICATION.md",
    extractSha: (payload) => payload.sha
  }
];

const artifactBuilders = [
  ["discovery", buildDiscoveryArtifact],
  ["health", buildHealthArtifact],
  ["capabilities-current", buildCapabilitiesCurrentArtifact],
  ["capabilities-planned", buildCapabilitiesPlannedArtifact],
  ["fit-criteria", buildFitCriteriaArtifact],
  ["install", buildInstallArtifact],
  ["first-use", buildFirstUseArtifact],
  ["integration", buildIntegrationArtifact],
  ["events-contract", buildEventsContractArtifact],
  ["failure-modes", buildFailureModesArtifact],
  ["trust", buildTrustArtifact],
  ["policy", buildPolicyArtifact],
  ["provenance", buildProvenanceArtifact],
  ["integration-confidence", buildIntegrationConfidenceArtifact],
  ["release-operations", buildReleaseOperationsArtifact],
  ["propagation-packet", buildPropagationPacketArtifact]
];

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function runCommand(command, args) {
  const startedAt = Date.now();
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    stdio: "inherit",
    env: process.env
  });
  const completedAt = Date.now();

  return {
    command: `${command} ${args.join(" ")}`,
    status: result.status === 0 ? "passed" : "failed",
    exit_code: result.status,
    duration_ms: completedAt - startedAt
  };
}

async function loadLockData() {
  const raw = await readFile(lockPath, "utf8");
  return JSON.parse(raw);
}

async function fetchRef(ref) {
  const response = await fetch(ref.url, {
    headers: {
      "User-Agent": "x0xmd-upstream-refresh"
    }
  });

  if (!response.ok) {
    throw new Error(`Unable to load ${ref.id}: ${response.status} ${response.statusText}`);
  }

  const payload = await response.json();
  const sha = ref.extractSha(payload);
  if (!sha) {
    throw new Error(`Unable to extract sha for ${ref.id}`);
  }

  return sha;
}

async function regenerateArtifacts() {
  await mkdir(generatedDir, { recursive: true });

  const regenerated = [];
  for (const [name, build] of artifactBuilders) {
    const artifactPath = path.join(generatedDir, `${name}.json`);
    const content = `${JSON.stringify(build(), null, 2)}\n`;
    await writeFile(artifactPath, content, "utf8");

    regenerated.push({
      id: name,
      path: path.relative(repoRoot, artifactPath),
      sha256: sha256(content)
    });
  }

  return regenerated;
}

async function main() {
  await mkdir(summaryDir, { recursive: true });

  const lock = await loadLockData();
  const refs = [];

  for (const ref of UPSTREAM_REFS) {
    const currentSha = await fetchRef(ref);
    const baselineSha = lock.refs?.[ref.id] ?? null;

    refs.push({
      id: ref.id,
      human_url: ref.human_url,
      baseline_sha: baselineSha,
      current_sha: currentSha,
      changed: baselineSha !== null && baselineSha !== currentSha
    });
  }

  const regeneratedArtifacts = await regenerateArtifacts();
  const checks = [
    runCommand("npm", ["run", "check:release-evidence"]),
    runCommand("npm", ["run", "check:drift"])
  ];

  const changedRefs = refs.filter((ref) => ref.changed).map((ref) => ref.id);
  const failedChecks = checks.filter((check) => check.status === "failed").map((check) => check.command);

  const summary = {
    schema_version: "1.0.0",
    generated_at: new Date().toISOString(),
    status: changedRefs.length === 0 && failedChecks.length === 0 ? "passed" : "failed",
    unresolved_drift: changedRefs.length > 0,
    changed_refs: changedRefs,
    refs,
    regenerated_artifacts: regeneratedArtifacts,
    checks,
    failures: {
      changed_refs: changedRefs,
      failed_checks: failedChecks
    }
  };

  await writeFile(summaryPath, `${JSON.stringify(summary, null, 2)}\n`, "utf8");

  if (summary.status !== "passed") {
    throw new Error(`Refresh failed. See ${path.relative(repoRoot, summaryPath)} for details.`);
  }

  process.stdout.write(`Refresh summary written to ${path.relative(repoRoot, summaryPath)}\n`);
}

main().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exit(1);
});

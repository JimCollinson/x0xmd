import { MACHINE_ENDPOINTS } from "./discovery.js";

export const RELEASE_OPERATIONS_SCHEMA_VERSION = "1.0.0";
export const RELEASE_OPERATIONS_PATH = MACHINE_ENDPOINTS.releaseOperations;

const REQUIRED_EVIDENCE_KEYS = Object.freeze([
  "schema_version",
  "generated_at",
  "branch",
  "commit",
  "deploy.run_url",
  "deploy.preview_url",
  "evaluation.report_path",
  "decision.status"
]);

export function buildReleaseOperationsArtifact() {
  return {
    schema_version: RELEASE_OPERATIONS_SCHEMA_VERSION,
    operation: "preview-eval-release-candidate",
    workflow: {
      workflow_file: ".github/workflows/deploy.yml",
      dispatch_command_template: "gh workflow run deploy.yml --ref <branch> -f worker_name=x0x-md-<branch>",
      required_secrets: ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"],
      preview_url_pattern: "https://x0x-md-<branch>.workers.dev"
    },
    evidence: {
      schema_path: "docs/ops/release-evidence.schema.json",
      template_path: "docs/ops/release-evidence.example.json",
      runbook_path: "docs/ops/preview-eval-workflow.md",
      required_keys: REQUIRED_EVIDENCE_KEYS,
      report_path_rule: "planning/eval-reports/<YYYY-MMM-DD>-<branch>-eval.md"
    },
    decision_status: ["pending", "promote", "reject", "defer"],
    version: {
      phase: "03-propagation-and-operations",
      plan: "03-01"
    }
  };
}

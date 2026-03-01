import { createHash } from "node:crypto";

import { canonicalModel } from "../model/canonical.js";
import {
  buildDiscoveryArtifact,
  DISCOVERY_SCHEMA_VERSION,
  MACHINE_ENDPOINTS
} from "./discovery.js";
import { buildPolicyArtifact, POLICY_SCHEMA_VERSION } from "./policy.js";

export const PROVENANCE_SCHEMA_VERSION = "1.0.0";
export const PROVENANCE_PATH = "/machine/provenance";
const TRUST_SCHEMA_VERSION = "1.0.0";

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(",")}]`;
  }

  if (value && typeof value === "object") {
    const entries = Object.keys(value)
      .sort()
      .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`);
    return `{${entries.join(",")}}`;
  }

  return JSON.stringify(value);
}

function sha256Hex(value) {
  return createHash("sha256").update(stableStringify(value)).digest("hex");
}

function buildTrustSnapshotForDigest() {
  return {
    schema_version: TRUST_SCHEMA_VERSION,
    contract_version: canonicalModel.trust.contract_version,
    trust_levels: canonicalModel.trust.current.trust_levels,
    threat_assumptions: canonicalModel.trust.current.threat_assumptions,
    default_transitions: canonicalModel.trust.current.default_transitions,
    action_gating_matrix: canonicalModel.trust.current.action_gating_matrix,
    lifecycle: {
      current: canonicalModel.trust.current,
      planned: canonicalModel.trust.planned
    }
  };
}

function buildSignerMetadata() {
  return {
    signer_type: "verification-procedure-pointer",
    verification_doc_url: canonicalModel.trust.current.disclosure.docs_url,
    signature_material: "not_embedded",
    note: "Consumers must follow verification docs to validate upstream artifacts."
  };
}

export function buildProvenanceArtifact() {
  const discoveryArtifact = buildDiscoveryArtifact();
  const policyArtifact = buildPolicyArtifact();
  const trustSnapshot = buildTrustSnapshotForDigest();

  return {
    schema_version: PROVENANCE_SCHEMA_VERSION,
    contract_version: canonicalModel.trust.contract_version,
    generated_at: canonicalModel.generated_at,
    signer: buildSignerMetadata(),
    artifacts: [
      {
        id: "discovery",
        path: MACHINE_ENDPOINTS.discovery,
        source_uri: canonicalModel.identity.repo,
        schema_version: DISCOVERY_SCHEMA_VERSION,
        digest: {
          algorithm: "sha256",
          value: sha256Hex(discoveryArtifact)
        },
        source_references: ["plan-01-01", "plan-01-02"]
      },
      {
        id: "trust",
        path: MACHINE_ENDPOINTS.trust,
        source_uri: canonicalModel.identity.repo,
        schema_version: TRUST_SCHEMA_VERSION,
        digest: {
          algorithm: "sha256",
          value: sha256Hex(trustSnapshot)
        },
        source_references: ["plan-01-02", "plan-02-01"]
      },
      {
        id: "policy",
        path: MACHINE_ENDPOINTS.policy,
        source_uri: canonicalModel.identity.repo,
        schema_version: POLICY_SCHEMA_VERSION,
        digest: {
          algorithm: "sha256",
          value: sha256Hex(policyArtifact)
        },
        source_references: ["plan-02-01"]
      }
    ]
  };
}

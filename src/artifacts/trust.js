import { canonicalModel } from "../model/canonical.js";
import { PROVENANCE_PATH, PROVENANCE_SCHEMA_VERSION } from "./provenance.js";

export const TRUST_SCHEMA_VERSION = "1.0.0";

export function buildTrustArtifact() {
  const current = canonicalModel.trust.current;

  return {
    schema_version: TRUST_SCHEMA_VERSION,
    contract_version: canonicalModel.trust.contract_version,
    trust_levels: current.trust_levels,
    threat_assumptions: current.threat_assumptions,
    default_transitions: current.default_transitions,
    action_gating_matrix: current.action_gating_matrix,
    provenance: {
      path: PROVENANCE_PATH,
      schema_version: PROVENANCE_SCHEMA_VERSION
    },
    lifecycle: {
      current,
      planned: canonicalModel.trust.planned
    }
  };
}

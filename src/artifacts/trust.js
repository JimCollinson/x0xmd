import { canonicalModel } from "../model/canonical.js";

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
    lifecycle: {
      current,
      planned: canonicalModel.trust.planned
    }
  };
}

import { canonicalModel } from "../model/canonical.js";

export const TRUST_SCHEMA_VERSION = "1.0.0";

export function buildTrustArtifact() {
  return {
    schema_version: TRUST_SCHEMA_VERSION,
    contract_version: canonicalModel.trust.contract_version,
    lifecycle: {
      current: canonicalModel.trust.current,
      planned: canonicalModel.trust.planned
    }
  };
}

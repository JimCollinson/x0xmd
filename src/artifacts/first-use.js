import { canonicalModel } from "../model/canonical.js";

export const FIRST_USE_SCHEMA_VERSION = "1.0.0";

export function buildFirstUseArtifact() {
  return {
    schema_version: FIRST_USE_SCHEMA_VERSION,
    contract_version: canonicalModel.first_use.contract_version,
    daemon_base_url: canonicalModel.first_use.daemon_base_url,
    lifecycle: {
      current: canonicalModel.first_use.current,
      planned: canonicalModel.first_use.planned
    }
  };
}

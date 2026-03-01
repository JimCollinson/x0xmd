import { canonicalModel } from "../model/canonical.js";

export const INTEGRATION_SCHEMA_VERSION = "1.0.0";

export function buildIntegrationArtifact() {
  return {
    schema_version: INTEGRATION_SCHEMA_VERSION,
    contract_version: canonicalModel.integration.contract_version,
    lifecycle: {
      current: canonicalModel.integration.current,
      planned: canonicalModel.integration.planned
    }
  };
}

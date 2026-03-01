import { canonicalModel } from "../model/canonical.js";

export const INSTALL_SCHEMA_VERSION = "1.0.0";

export function buildInstallArtifact() {
  return {
    schema_version: INSTALL_SCHEMA_VERSION,
    contract_version: canonicalModel.install.contract_version,
    daemon: canonicalModel.install.daemon,
    lifecycle: {
      current: canonicalModel.install.current,
      planned: canonicalModel.install.planned
    }
  };
}

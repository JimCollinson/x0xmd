import { canonicalModel } from "../model/canonical.js";
import {
  buildFailureModesArtifact,
  FAILURE_MODES_PATH,
  FAILURE_MODES_SCHEMA_VERSION
} from "./failure-modes.js";

export const INSTALL_SCHEMA_VERSION = "1.0.0";

export function buildInstallArtifact() {
  const failureModes = buildFailureModesArtifact().lifecycle.current.matrix;

  return {
    schema_version: INSTALL_SCHEMA_VERSION,
    contract_version: canonicalModel.install.contract_version,
    daemon: canonicalModel.install.daemon,
    failure_modes: {
      path: FAILURE_MODES_PATH,
      schema_version: FAILURE_MODES_SCHEMA_VERSION,
      classes: [...new Set(failureModes.map((mode) => mode.failure_class))]
    },
    lifecycle: {
      current: canonicalModel.install.current,
      planned: canonicalModel.install.planned
    }
  };
}

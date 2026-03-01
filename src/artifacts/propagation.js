import { MACHINE_ENDPOINTS } from "./discovery.js";
import { canonicalModel } from "../model/canonical.js";

export const PROPAGATION_PACKET_SCHEMA_VERSION = "1.0.0";
export const PROPAGATION_PACKET_PATH = MACHINE_ENDPOINTS.propagation;
export const PROPAGATION_PACKET_REQUIRED_KEYS = Object.freeze([
  "schema_version",
  "artifact_version",
  "purpose",
  "compatibility",
  "fit",
  "current_capabilities",
  "install_verification_probes",
  "evidence"
]);

function compactCurrentCapabilities() {
  return (canonicalModel.capabilities_current || []).map((capability) => ({
    id: capability.id,
    evidence: capability.evidence
  }));
}

function compactInstallVerificationProbes() {
  return (canonicalModel.install?.current?.verification_probes || []).map((probe) => ({
    id: probe.id,
    command_unix: probe.command_unix,
    command_windows: probe.command_windows,
    expected_signal: probe.expected_signal
  }));
}

function enforceCompactness(artifact) {
  const compactness = canonicalModel.propagation.compactness;

  if (artifact.current_capabilities.length > compactness.max_current_capabilities) {
    throw new Error("Propagation packet exceeds max_current_capabilities compactness limit");
  }

  if (artifact.fit.length > compactness.max_fit_criteria) {
    throw new Error("Propagation packet exceeds max_fit_criteria compactness limit");
  }

  if (artifact.install_verification_probes.length > compactness.max_verification_probes) {
    throw new Error("Propagation packet exceeds max_verification_probes compactness limit");
  }

  if (artifact.evidence.sources.length > compactness.max_sources) {
    throw new Error("Propagation packet exceeds max_sources compactness limit");
  }
}

export function buildPropagationPacketArtifact() {
  const artifact = {
    schema_version: PROPAGATION_PACKET_SCHEMA_VERSION,
    artifact_version: canonicalModel.propagation.artifact_version,
    purpose: "x0x provides deterministic machine contracts so another agent can quickly verify fit, install safely, and integrate without manual interpretation.",
    compatibility: canonicalModel.propagation.compatibility,
    fit: canonicalModel.fit_criteria.map((criterion) => ({
      id: criterion.id,
      description: criterion.description
    })),
    current_capabilities: compactCurrentCapabilities(),
    install_verification_probes: compactInstallVerificationProbes(),
    evidence: {
      capability_source: {
        endpoint: MACHINE_ENDPOINTS.capabilitiesCurrent,
        lifecycle: "current"
      },
      provenance: {
        endpoint: MACHINE_ENDPOINTS.provenance
      },
      release_operations: {
        endpoint: MACHINE_ENDPOINTS.releaseOperations
      },
      sources: canonicalModel.source_evidence.map((entry) => ({
        id: entry.id,
        title: entry.title,
        source: entry.source
      }))
    }
  };

  enforceCompactness(artifact);
  return artifact;
}

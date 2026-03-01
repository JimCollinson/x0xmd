import { MACHINE_ENDPOINTS } from "./discovery.js";
import { canonicalModel } from "../model/canonical.js";

export const PROPAGATION_PACKET_SCHEMA_VERSION = "1.0.0";
export const PROPAGATION_PACKET_PATH = "/machine/propagation";

function compactCapabilityClaims() {
  const claims = [
    ...(canonicalModel.capabilities_current || []).map((capability) => ({
      id: capability.id,
      st: "current"
    })),
    ...(canonicalModel.capabilities_planned || []).map((capability) => ({
      id: capability.id,
      st: "planned"
    }))
  ];

  for (const claim of claims) {
    if (claim.st !== "current" && claim.st !== "planned") {
      throw new Error(`Invalid capability state label for ${claim.id}`);
    }
  }

  return claims;
}

export function buildPropagationPacketArtifact() {
  return {
    schema_version: PROPAGATION_PACKET_SCHEMA_VERSION,
    purpose: "x0x provides deterministic machine contracts so another agent can quickly verify fit, install safely, and integrate without manual interpretation.",
    fit: canonicalModel.fit_criteria.map((criterion) => ({
      id: criterion.id,
      description: criterion.description
    })),
    links: {
      install: MACHINE_ENDPOINTS.install,
      verify: {
        discovery: MACHINE_ENDPOINTS.discovery,
        trust: MACHINE_ENDPOINTS.trust,
        health: MACHINE_ENDPOINTS.health
      }
    },
    caps: compactCapabilityClaims(),
    trust_notes: canonicalModel.trust.current.policy_guidance,
    sources: canonicalModel.source_evidence.map((entry) => ({
      id: entry.id,
      title: entry.title,
      source: entry.source
    }))
  };
}

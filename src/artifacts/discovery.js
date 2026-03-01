import { canonicalModel } from "../model/canonical.js";

export const DISCOVERY_SCHEMA_VERSION = "1.0.0";
export const JSON_CONTENT_TYPE = "application/json; charset=utf-8";
export const HEALTH_CONTENT_TYPE = "application/health+json; charset=utf-8";

export const MACHINE_ENDPOINTS = Object.freeze({
  discovery: "/.well-known/x0x/discovery",
  health: "/health",
  capabilitiesCurrent: "/.well-known/x0x/capabilities/current",
  capabilitiesPlanned: "/.well-known/x0x/capabilities/planned",
  fitCriteria: "/.well-known/x0x/fit",
  install: "/machine/install",
  firstUse: "/machine/first-use",
  integration: "/machine/integration",
  eventsContract: "/machine/events-contract",
  failureModes: "/machine/failure-modes",
  propagation: "/machine/propagation",
  trust: "/machine/trust",
  policy: "/machine/policy"
});

export function buildDiscoveryArtifact() {
  return {
    schema_version: DISCOVERY_SCHEMA_VERSION,
    id: canonicalModel.identity.id,
    identity: canonicalModel.identity,
    endpoints: {
      discovery: {
        path: MACHINE_ENDPOINTS.discovery,
        content_type: JSON_CONTENT_TYPE
      },
      health: {
        path: MACHINE_ENDPOINTS.health,
        content_type: HEALTH_CONTENT_TYPE
      },
      capabilities_current: {
        path: MACHINE_ENDPOINTS.capabilitiesCurrent,
        content_type: JSON_CONTENT_TYPE
      },
      capabilities_planned: {
        path: MACHINE_ENDPOINTS.capabilitiesPlanned,
        content_type: JSON_CONTENT_TYPE
      },
      fit_criteria: {
        path: MACHINE_ENDPOINTS.fitCriteria,
        content_type: JSON_CONTENT_TYPE
      },
      install: {
        path: MACHINE_ENDPOINTS.install,
        content_type: JSON_CONTENT_TYPE
      },
      first_use: {
        path: MACHINE_ENDPOINTS.firstUse,
        content_type: JSON_CONTENT_TYPE
      },
      integration: {
        path: MACHINE_ENDPOINTS.integration,
        content_type: JSON_CONTENT_TYPE
      },
      events_contract: {
        path: MACHINE_ENDPOINTS.eventsContract,
        content_type: JSON_CONTENT_TYPE
      },
      failure_modes: {
        path: MACHINE_ENDPOINTS.failureModes,
        content_type: JSON_CONTENT_TYPE
      },
      propagation: {
        path: MACHINE_ENDPOINTS.propagation,
        content_type: JSON_CONTENT_TYPE
      },
      trust: {
        path: MACHINE_ENDPOINTS.trust,
        content_type: JSON_CONTENT_TYPE
      },
      policy: {
        path: MACHINE_ENDPOINTS.policy,
        content_type: JSON_CONTENT_TYPE
      }
    }
  };
}

export function buildCapabilitiesCurrentArtifact() {
  return {
    schema_version: DISCOVERY_SCHEMA_VERSION,
    lifecycle: "current",
    capabilities: canonicalModel.capabilities_current
  };
}

export function buildCapabilitiesPlannedArtifact() {
  return {
    schema_version: DISCOVERY_SCHEMA_VERSION,
    lifecycle: "planned",
    capabilities: canonicalModel.capabilities_planned
  };
}

export function buildFitCriteriaArtifact() {
  return {
    schema_version: DISCOVERY_SCHEMA_VERSION,
    fit_criteria: canonicalModel.fit_criteria
  };
}

export function buildHealthArtifact() {
  return {
    schema_version: DISCOVERY_SCHEMA_VERSION,
    status: "ok",
    service: canonicalModel.identity.id
  };
}

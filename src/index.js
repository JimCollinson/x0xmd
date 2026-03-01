import {
  buildCapabilitiesCurrentArtifact,
  buildCapabilitiesPlannedArtifact,
  buildDiscoveryArtifact,
  buildFitCriteriaArtifact,
  buildHealthArtifact,
  HEALTH_CONTENT_TYPE,
  JSON_CONTENT_TYPE,
  MACHINE_ENDPOINTS
} from "./artifacts/discovery.js";
import { buildFirstUseArtifact } from "./artifacts/first-use.js";
import { buildIntegrationArtifact } from "./artifacts/integration.js";
import { buildInstallArtifact } from "./artifacts/install.js";
import {
  buildEventsContractArtifact,
  EVENTS_CONTRACT_PATH
} from "./artifacts/events-contract.js";
import {
  buildFailureModesArtifact,
  FAILURE_MODES_PATH
} from "./artifacts/failure-modes.js";
import {
  buildPropagationPacketArtifact,
  PROPAGATION_PACKET_PATH
} from "./artifacts/propagation.js";
import { buildPolicyArtifact, POLICY_PATH } from "./artifacts/policy.js";
import { buildTrustArtifact } from "./artifacts/trust.js";

const ROOT_HTML_CONTENT_TYPE = "text/html; charset=utf-8";
const ROOT_MACHINE_HINT_CONTENT_TYPE = "application/json; charset=utf-8";
const ROOT_CACHE_CONTROL = "public, max-age=120";

function jsonResponse(payload, contentType, cacheControl) {
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      "content-type": contentType,
      "cache-control": cacheControl
    }
  });
}

function notFoundResponse() {
  return new Response(
    JSON.stringify({ error: "not_found" }),
    {
      status: 404,
      headers: {
        "content-type": JSON_CONTENT_TYPE,
        "cache-control": "no-store"
      }
    }
  );
}

function parseAcceptHeader(acceptHeader) {
  if (!acceptHeader) {
    return [];
  }

  return acceptHeader
    .split(",")
    .map((entry, index) => {
      const [typePart, ...parameterParts] = entry.split(";");
      const type = typePart.trim().toLowerCase();
      if (!type) {
        return null;
      }

      let quality = 1;

      for (const parameter of parameterParts) {
        const [name, value] = parameter.split("=");
        if (!name || !value || name.trim().toLowerCase() !== "q") {
          continue;
        }

        const parsed = Number.parseFloat(value.trim());
        if (!Number.isNaN(parsed)) {
          quality = Math.max(0, Math.min(1, parsed));
        }
      }

      return {
        index,
        quality,
        type
      };
    })
    .filter((entry) => entry !== null);
}

function mediaTypeSpecificity(rangeType, candidateType) {
  if (rangeType === candidateType) {
    return 2;
  }

  const [rangeMain, rangeSub] = rangeType.split("/");
  const [candidateMain] = candidateType.split("/");

  if (rangeMain === "*" && rangeSub === "*") {
    return 0;
  }

  if (rangeMain === candidateMain && rangeSub === "*") {
    return 1;
  }

  return -1;
}

function comparePreference(a, b) {
  if (a.quality !== b.quality) {
    return a.quality - b.quality;
  }

  if (a.specificity !== b.specificity) {
    return a.specificity - b.specificity;
  }

  return b.index - a.index;
}

function comparePreferenceForRootVariant(a, b) {
  if (a.quality !== b.quality) {
    return a.quality - b.quality;
  }

  if (a.specificity !== b.specificity) {
    return a.specificity - b.specificity;
  }

  return 0;
}

function shouldServeRootHtml(acceptHeader) {
  const parsed = parseAcceptHeader(acceptHeader);
  if (parsed.length === 0) {
    return false;
  }

  const candidates = ["application/json", "text/html"];
  const bestByCandidate = new Map();

  for (const candidate of candidates) {
    for (const range of parsed) {
      const specificity = mediaTypeSpecificity(range.type, candidate);
      if (specificity < 0 || range.quality <= 0) {
        continue;
      }

      const preference = {
        candidate,
        quality: range.quality,
        specificity,
        index: range.index
      };
      const previous = bestByCandidate.get(candidate);

      if (!previous || comparePreference(preference, previous) > 0) {
        bestByCandidate.set(candidate, preference);
      }
    }
  }

  const htmlPreference = bestByCandidate.get("text/html");
  const jsonPreference = bestByCandidate.get("application/json");

  if (!htmlPreference) {
    return false;
  }

  if (!jsonPreference) {
    return true;
  }

  return comparePreferenceForRootVariant(htmlPreference, jsonPreference) > 0;
}

function rootHtmlResponse() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>x0xmd</title></head><body><h1>x0xmd discovery surface</h1><p>Machine endpoint map: <a href="${MACHINE_ENDPOINTS.discovery}">${MACHINE_ENDPOINTS.discovery}</a></p><p>Trust metadata: <a href="${MACHINE_ENDPOINTS.trust}">${MACHINE_ENDPOINTS.trust}</a></p><p>Policy metadata: <a href="${MACHINE_ENDPOINTS.policy}">${MACHINE_ENDPOINTS.policy}</a></p></body></html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "content-type": ROOT_HTML_CONTENT_TYPE,
      "cache-control": ROOT_CACHE_CONTROL,
      vary: "Accept"
    }
  });
}

function rootMachineHintResponse() {
  return new Response(
    JSON.stringify({
      schema_version: "1.0.0",
      service: "x0xmd",
      machine_entrypoint: MACHINE_ENDPOINTS.discovery,
      trust_metadata_endpoint: MACHINE_ENDPOINTS.trust,
      policy_metadata_endpoint: MACHINE_ENDPOINTS.policy,
      content_type: JSON_CONTENT_TYPE
    }),
    {
      status: 200,
      headers: {
        "content-type": ROOT_MACHINE_HINT_CONTENT_TYPE,
        "cache-control": ROOT_CACHE_CONTROL,
        vary: "Accept"
      }
    }
  );
}

function isDiscoveryAliasPath(pathname) {
  return pathname === "/.well-known/agent-card.json" || pathname === "/.well-known/agent.json";
}

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/") {
      if (shouldServeRootHtml(request.headers.get("accept"))) {
        return rootHtmlResponse();
      }
      return rootMachineHintResponse();
    }

    if (pathname === MACHINE_ENDPOINTS.discovery) {
      return jsonResponse(buildDiscoveryArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (isDiscoveryAliasPath(pathname)) {
      return jsonResponse(buildDiscoveryArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.health) {
      return jsonResponse(buildHealthArtifact(), HEALTH_CONTENT_TYPE, "no-store");
    }

    if (pathname === MACHINE_ENDPOINTS.capabilitiesCurrent) {
      return jsonResponse(buildCapabilitiesCurrentArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.capabilitiesPlanned) {
      return jsonResponse(buildCapabilitiesPlannedArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.fitCriteria) {
      return jsonResponse(buildFitCriteriaArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.install) {
      return jsonResponse(buildInstallArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.firstUse) {
      return jsonResponse(buildFirstUseArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.integration) {
      return jsonResponse(buildIntegrationArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === EVENTS_CONTRACT_PATH) {
      return jsonResponse(buildEventsContractArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === FAILURE_MODES_PATH) {
      return jsonResponse(buildFailureModesArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.trust) {
      return jsonResponse(buildTrustArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === POLICY_PATH) {
      return jsonResponse(buildPolicyArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === PROPAGATION_PACKET_PATH) {
      return jsonResponse(buildPropagationPacketArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    return notFoundResponse();
  }
};

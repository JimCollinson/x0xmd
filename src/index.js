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

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === MACHINE_ENDPOINTS.discovery) {
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

    return notFoundResponse();
  }
};

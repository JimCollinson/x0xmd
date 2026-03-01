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

function firstAcceptedMediaType(acceptHeader) {
  if (!acceptHeader) {
    return "*/*";
  }

  return acceptHeader
    .split(",")[0]
    .trim()
    .split(";")[0]
    .trim()
    .toLowerCase();
}

function rootHtmlResponse() {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><title>x0xmd</title></head><body><h1>x0xmd discovery surface</h1><p>Machine endpoint map: <a href="${MACHINE_ENDPOINTS.discovery}">${MACHINE_ENDPOINTS.discovery}</a></p></body></html>`;
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

export default {
  async fetch(request) {
    const { pathname } = new URL(request.url);

    if (pathname === "/") {
      const mediaType = firstAcceptedMediaType(request.headers.get("accept"));
      if (mediaType === "text/html") {
        return rootHtmlResponse();
      }
      return rootMachineHintResponse();
    }

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

    if (pathname === MACHINE_ENDPOINTS.install) {
      return jsonResponse(buildInstallArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.firstUse) {
      return jsonResponse(buildFirstUseArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    if (pathname === MACHINE_ENDPOINTS.integration) {
      return jsonResponse(buildIntegrationArtifact(), JSON_CONTENT_TYPE, "public, max-age=300");
    }

    return notFoundResponse();
  }
};

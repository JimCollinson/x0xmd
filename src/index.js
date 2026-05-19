import { buildHtmlPage } from "./html.js"

const DEFAULT_GITHUB_REPO = "saorsa-labs/x0x"
const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main/scripts/install.sh"
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md"
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig"
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc"
const DEFAULT_RELEASE_MANIFEST_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/release-manifest.json"
const DEFAULT_RELEASE_MANIFEST_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/release-manifest.json.sig"
const DEFAULT_AGENT_CARD_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/agent.json"
const DEFAULT_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main"

const RELEASES_CACHE_TTL = 300 // 5 minutes

const PUBLIC_DOCS = [
  {
    path: "docs/conceptual-guide-for-humans.md",
    title: "Conceptual Guide",
    description: "A conceptual guide to x0x for humans",
  },
  {
    path: "docs/overview.md",
    title: "Overview",
    description: "What x0x is and when to use it",
  },
  {
    path: "docs/install.md",
    title: "Install",
    description: "Installation and setup",
  },
  {
    path: "docs/verify.md",
    title: "Verify",
    description: "Signature verification and trust",
  },
  {
    path: "docs/api.md",
    title: "API Map",
    description: "At-a-glance daemon API routes",
  },
  {
    path: "docs/api-reference.md",
    title: "API Reference",
    description: "Full REST and WebSocket reference",
  },
  {
    path: "docs/patterns.md",
    title: "Patterns",
    description: "Common usage patterns",
  },
  {
    path: "docs/compared.md",
    title: "Compared",
    description: "How x0x compares to alternatives",
  },
  {
    path: "docs/troubleshooting.md",
    title: "Troubleshooting",
    description: "Common issues and fixes",
  },
  {
    path: "docs/uninstall.md",
    title: "Uninstall",
    description: "Clean removal",
  },
  {
    path: "docs/vision.md",
    title: "Vision",
    description: "What can be built on x0x",
  },
  {
    path: "docs/security.md",
    title: "Security",
    description: "Cryptography and security model",
  },
  {
    path: "docs/diagnostics.md",
    title: "Diagnostics",
    description: "Health, status, and doctor flows",
  },
  {
    path: "docs/sdk-quickstart.md",
    title: "SDK Quickstart",
    description: "Daemon-first operator quickstart",
  },
  {
    path: "docs/local-apps.md",
    title: "Local Apps",
    description: "Building on top of a local x0xd daemon",
  },
  {
    path: "docs/AGENT_CARD.md",
    title: "Agent Card",
    description: "A2A agent card format and discovery",
  },
  {
    path: "docs/GPG_SIGNING.md",
    title: "GPG Signing",
    description: "Release signing and verification details",
  },
  {
    path: "docs/VERIFICATION.md",
    title: "Verification",
    description: "Release verification workflow",
  },
  {
    path: "docs/primers/identity.md",
    title: "Primer: Identity",
    description: "Identity concepts and operator mental model",
  },
  {
    path: "docs/primers/messaging.md",
    title: "Primer: Messaging",
    description: "Gossip and direct messaging basics",
  },
  {
    path: "docs/primers/trust.md",
    title: "Primer: Trust",
    description: "Trust levels and contact handling",
  },
  {
    path: "docs/primers/groups.md",
    title: "Primer: Groups",
    description: "Groups, invites, and private collaboration",
  },
  {
    path: "docs/primers/files.md",
    title: "Primer: Files",
    description: "File transfer workflow",
  },
  {
    path: "docs/primers/coordination.md",
    title: "Primer: Coordination",
    description: "Task lists, shared state, and coordination",
  },
  {
    path: "docs/primers/apps.md",
    title: "Primer: Apps",
    description: "How local apps integrate with x0xd",
  },
]

const PUBLIC_DOC_MAP = new Map(
  PUBLIC_DOCS.map((doc) => [`/${doc.path.toLowerCase()}`, doc]),
)

const CANONICAL_ROUTE_MAP = new Map([
  ["/agent.json", "/.well-known/agent.json"],
  ["/.well-known/agent.json", "/.well-known/agent.json"],
  ["/health", "/health"],
  ["/install.sh", "/install.sh"],
  ["/llms-full.txt", "/llms-full.txt"],
  ["/llms.txt", "/llms.txt"],
  ["/release-manifest.json", "/release-manifest.json"],
  ["/release-manifest.json.sig", "/release-manifest.json.sig"],
  ["/saorsa_public_key.asc", "/SAORSA_PUBLIC_KEY.asc"],
  ["/skill", "/skill.md"],
  ["/skill.md", "/skill.md"],
  ["/skill.md.sig", "/skill.md.sig"],
  ["/trust.json", "/trust.json"],
])

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const canonicalPath = canonicalizePath(url.pathname)

    if (canonicalPath && canonicalPath !== url.pathname) {
      return redirectToCanonical(url, canonicalPath)
    }

    const path = canonicalPath || url.pathname

    if (path.startsWith("/fonts/") || path.startsWith("/assets/")) {
      return env.ASSETS.fetch(request)
    }

    if (path === "/trust.json") {
      return trustResponse(request, env)
    }

    if (path === "/install.sh") {
      return installerResponse(env)
    }

    if (path === "/health") {
      return jsonResponse({ status: "ok", service: "x0x-md-worker" })
    }

    if (path === "/skill.md") {
      return skillResponse(env)
    }

    if (path === "/skill.md.sig") {
      return skillSignatureResponse(env)
    }

    if (path === "/SAORSA_PUBLIC_KEY.asc") {
      return gpgKeyResponse(env)
    }

    if (path === "/release-manifest.json") {
      return releaseManifestResponse(env)
    }

    if (path === "/release-manifest.json.sig") {
      return releaseManifestSignatureResponse(env)
    }

    if (path === "/.well-known/agent.json") {
      return agentCardResponse(env)
    }

    if (path === "/llms.txt") {
      return llmsTxtResponse()
    }

    if (path === "/llms-full.txt") {
      return llmsFullTxtResponse(env)
    }

    const doc = PUBLIC_DOC_MAP.get(path.toLowerCase())
    if (doc) {
      return docMarkdownResponse(doc, env)
    }

    if (path === "/" || path === "") {
      if (isBrowserRequest(request)) {
        return htmlResponse(request)
      }
      return installerResponse(env)
    }

    return notFound()
  },
}

// --- Request detection ---

function isBrowserRequest(request) {
  const accept = request.headers.get("accept") || ""
  const userAgent = (request.headers.get("user-agent") || "").toLowerCase()
  const secFetchMode = request.headers.get("sec-fetch-mode") || ""

  const likelyCli =
    userAgent.includes("curl") ||
    userAgent.includes("wget") ||
    userAgent.includes("httpie") ||
    userAgent.includes("python-requests") ||
    userAgent.includes("go-http-client")

  if (likelyCli) return false
  if (secFetchMode.toLowerCase() === "navigate") return true
  return accept.includes("text/html")
}

// --- Canonical paths ---

function canonicalizePath(path) {
  if (!path || path === "/") return "/"

  const direct = CANONICAL_ROUTE_MAP.get(path.toLowerCase())
  if (direct) {
    return direct
  }

  const doc = PUBLIC_DOC_MAP.get(path.toLowerCase())
  if (doc) {
    return `/${doc.path}`
  }

  return null
}

function redirectToCanonical(url, canonicalPath) {
  const target = new URL(url.toString())
  target.pathname = canonicalPath
  return Response.redirect(target.toString(), 308)
}

// --- Release resolution ---

function validateRepo(repo) {
  return typeof repo === "string" && /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo)
}

async function fetchReleasesIndex(repo) {
  const cacheKey = `https://x0x-release-index/${repo}`
  const cache = caches.default

  const cached = await cache.match(cacheKey)
  if (cached) {
    const releases = normalizeReleases(await cached.json())
    return { releases, cacheStatus: "hit" }
  }

  try {
    const apiUrl = `https://api.github.com/repos/${repo}/releases?per_page=100`
    const resp = await fetch(apiUrl, {
      headers: {
        "user-agent": "x0x-md-worker",
        accept: "application/vnd.github+json",
      },
    })

    if (!resp.ok) {
      return { releases: null, cacheStatus: "fallback" }
    }

    const releases = normalizeReleases(await resp.json())

    const cacheResp = new Response(JSON.stringify(releases), {
      headers: {
        "content-type": "application/json",
        "cache-control": `public, max-age=${RELEASES_CACHE_TTL}`,
      },
    })
    await cache.put(cacheKey, cacheResp)

    return { releases, cacheStatus: "miss" }
  } catch {
    return { releases: null, cacheStatus: "fallback" }
  }
}

function normalizeReleases(releases) {
  if (!Array.isArray(releases)) return []

  return releases
    .filter((release) => !release.draft && !release.prerelease)
    .sort((a, b) => releaseTimestamp(b) - releaseTimestamp(a))
}

function releaseTimestamp(release) {
  const timestamp = Date.parse(release?.published_at || release?.created_at || "")
  return Number.isNaN(timestamp) ? 0 : timestamp
}

function latestRelease(releases) {
  if (!Array.isArray(releases) || releases.length === 0) return null
  return releases[0]
}

function resolveAssetFromRelease(release, assetName) {
  if (!release) return null
  const asset = release.assets.find((item) => item.name === assetName)
  return asset ? asset.browser_download_url : null
}

function resolveSignedPairFromRelease(release, fileName) {
  if (!release) return null
  const fileUrl = resolveAssetFromRelease(release, fileName)
  const sigUrl = resolveAssetFromRelease(release, `${fileName}.sig`)
  if (!fileUrl || !sigUrl) return null
  return { fileUrl, sigUrl }
}

async function resolveReleaseArtifacts(env) {
  const repo = env.GITHUB_REPO || DEFAULT_GITHUB_REPO
  const artifacts = {
    skillUrl: env.SKILL_URL || DEFAULT_SKILL_URL,
    skillSignatureUrl:
      env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL,
    gpgKeyUrl: env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL,
    releaseManifestUrl: DEFAULT_RELEASE_MANIFEST_URL,
    releaseManifestSignatureUrl: DEFAULT_RELEASE_MANIFEST_SIGNATURE_URL,
    agentCardUrl: DEFAULT_AGENT_CARD_URL,
    releaseTag: "unknown",
    cacheStatus: "fallback",
  }

  if (!validateRepo(repo)) {
    return artifacts
  }

  const index = await fetchReleasesIndex(repo)
  artifacts.cacheStatus = index.cacheStatus

  const release = latestRelease(index.releases)
  if (!release) {
    artifacts.cacheStatus = "fallback"
    return artifacts
  }

  artifacts.releaseTag = release.tag_name || "unknown"

  const skillPair = resolveSignedPairFromRelease(release, "SKILL.md")
  if (skillPair) {
    artifacts.skillUrl = skillPair.fileUrl
    artifacts.skillSignatureUrl = skillPair.sigUrl
  }

  const manifestPair = resolveSignedPairFromRelease(release, "release-manifest.json")
  if (manifestPair) {
    artifacts.releaseManifestUrl = manifestPair.fileUrl
    artifacts.releaseManifestSignatureUrl = manifestPair.sigUrl
  }

  const gpgKeyUrl = resolveAssetFromRelease(release, "SAORSA_PUBLIC_KEY.asc")
  if (gpgKeyUrl) {
    artifacts.gpgKeyUrl = gpgKeyUrl
  }

  const agentCardUrl = resolveAssetFromRelease(release, "agent.json")
  if (agentCardUrl) {
    artifacts.agentCardUrl = agentCardUrl
  }

  return artifacts
}

// --- Responses ---

function htmlResponse(request) {
  const origin = new URL(request.url).origin
  return new Response(buildHtmlPage(origin), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function installerResponse(env) {
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL

  return proxyAsset(installScriptUrl, {
    accept: "text/plain",
    contentType: "text/x-shellscript; charset=utf-8",
    unavailableMessage: "Installer source unavailable\n",
  })
}

async function skillResponse(env) {
  const artifacts = await resolveReleaseArtifacts(env)

  return proxyAsset(artifacts.skillUrl, {
    accept: "text/plain",
    contentType: "text/markdown; charset=utf-8",
    unavailableMessage: "SKILL.md source unavailable\n",
    cacheStatus: artifacts.cacheStatus,
    releaseTag: artifacts.releaseTag,
  })
}

async function skillSignatureResponse(env) {
  const artifacts = await resolveReleaseArtifacts(env)

  return proxyAsset(artifacts.skillSignatureUrl, {
    accept: "application/octet-stream",
    contentType: "application/pgp-signature",
    unavailableMessage: "SKILL.md signature unavailable\n",
    cacheStatus: artifacts.cacheStatus,
    releaseTag: artifacts.releaseTag,
    binary: true,
  })
}

async function gpgKeyResponse(env) {
  const artifacts = await resolveReleaseArtifacts(env)

  return proxyAsset(artifacts.gpgKeyUrl, {
    accept: "text/plain",
    contentType: "text/plain; charset=utf-8",
    unavailableMessage: "Public key unavailable\n",
    cacheStatus: artifacts.cacheStatus,
    releaseTag: artifacts.releaseTag,
  })
}

async function releaseManifestResponse(env) {
  const artifacts = await resolveReleaseArtifacts(env)

  return proxyAsset(artifacts.releaseManifestUrl, {
    accept: "application/json",
    contentType: "application/json; charset=utf-8",
    unavailableMessage: "Release manifest unavailable\n",
    cacheStatus: artifacts.cacheStatus,
    releaseTag: artifacts.releaseTag,
  })
}

async function releaseManifestSignatureResponse(env) {
  const artifacts = await resolveReleaseArtifacts(env)

  return proxyAsset(artifacts.releaseManifestSignatureUrl, {
    accept: "application/octet-stream",
    contentType: "application/pgp-signature",
    unavailableMessage: "Release manifest signature unavailable\n",
    cacheStatus: artifacts.cacheStatus,
    releaseTag: artifacts.releaseTag,
    binary: true,
  })
}

async function agentCardResponse(env) {
  const artifacts = await resolveReleaseArtifacts(env)

  return proxyAsset(artifacts.agentCardUrl, {
    accept: "application/json",
    contentType: "application/json; charset=utf-8",
    unavailableMessage: "Agent card unavailable\n",
    cacheStatus: artifacts.cacheStatus,
    releaseTag: artifacts.releaseTag,
  })
}

function llmsTxtResponse() {
  const docs = PUBLIC_DOCS.filter((doc) => !doc.path.startsWith("docs/primers/"))
  const primers = PUBLIC_DOCS.filter((doc) => doc.path.startsWith("docs/primers/"))

  const body = `# x0x — post-quantum coordination and communication layer

> Fetch SKILL.md first, then install and verify x0x locally.

## Docs

${docs
  .map(
    (doc) =>
      `- [${doc.title}](https://x0x.md/${doc.path}): ${doc.description}`,
  )
  .join("\n")}

## Primers

${primers
  .map(
    (doc) =>
      `- [${doc.title}](https://x0x.md/${doc.path}): ${doc.description}`,
  )
  .join("\n")}

## Key resources

- [SKILL.md](https://x0x.md/skill.md): Canonical install and trust entrypoint
- [SKILL.md.sig](https://x0x.md/skill.md.sig): Detached signature for the current release skill
- [trust.json](https://x0x.md/trust.json): Machine-readable install and verification metadata
- [Agent card](https://x0x.md/.well-known/agent.json): A2A discovery metadata
- [Release manifest](https://x0x.md/release-manifest.json): Current release archive inventory and checksums
- [Saorsa public key](https://x0x.md/SAORSA_PUBLIC_KEY.asc): Release verification key
- [Full docs](https://x0x.md/llms-full.txt): Public docs concatenated for large context windows
- [Source](https://github.com/saorsa-labs/x0x): Upstream repository
`

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function llmsFullTxtResponse(env) {
  const sections = await Promise.all(
    PUBLIC_DOCS.map(async (doc) => {
      const markdown = await fetchDoc(doc.path, env)
      if (!markdown) return null
      return `<!-- ${doc.path} -->\n${markdown.trim()}`
    }),
  )

  const body = sections.filter(Boolean).join("\n\n---\n\n") + "\n"
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function docMarkdownResponse(doc, env) {
  const markdown = await fetchDoc(doc.path, env)
  if (!markdown) {
    return new Response(`Doc \"${doc.path}\" not available upstream\n`, {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-x0x-source": `${env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL}/${doc.path}`,
    },
  })
}

async function trustResponse(request, env) {
  const reqUrl = new URL(request.url)
  const host = reqUrl.host
  const origin = reqUrl.origin
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL
  const artifacts = await resolveReleaseArtifacts(env)

  const doc = {
    project: "x0x",
    endpoint: host,
    entrypoints: {
      skill_url: `${origin}/skill.md`,
      install_url: `${origin}/install.sh`,
      agent_card_url: `${origin}/.well-known/agent.json`,
    },
    install: {
      command: `curl -sfL ${origin} | sh`,
      command_start: `curl -sfL ${origin} | sh -s -- --start`,
      command_autostart: `curl -sfL ${origin} | sh -s -- --autostart`,
      installer_url: installScriptUrl,
      note: "Installs x0x CLI + daemon binaries. Use --start to launch daemon, --autostart to enable boot service.",
    },
    release: {
      tag: artifacts.releaseTag,
      cache: artifacts.cacheStatus,
    },
    artifacts: {
      skill_url: `${origin}/skill.md`,
      skill_signature_url: `${origin}/skill.md.sig`,
      gpg_key_url: `${origin}/SAORSA_PUBLIC_KEY.asc`,
      release_manifest_url: `${origin}/release-manifest.json`,
      release_manifest_signature_url: `${origin}/release-manifest.json.sig`,
      agent_card_url: `${origin}/.well-known/agent.json`,
    },
    upstream: {
      repo: env.GITHUB_REPO || DEFAULT_GITHUB_REPO,
      docs_base_url: env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL,
      skill_url: artifacts.skillUrl,
      skill_signature_url: artifacts.skillSignatureUrl,
      gpg_key_url: artifacts.gpgKeyUrl,
      release_manifest_url: artifacts.releaseManifestUrl,
      release_manifest_signature_url: artifacts.releaseManifestSignatureUrl,
      agent_card_url: artifacts.agentCardUrl,
    },
    policy: {
      non_interactive_mode: "warn_and_continue_if_gpg_missing",
      strict_verification: "planned",
      release_artifact_authority: "latest_published_release_asset_bytes",
      embedded_skill_metadata: "informational_only",
    },
  }

  return jsonResponse(doc)
}

// --- Helpers ---

async function fetchDoc(docPath, env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const docUrl = `${baseUrl}/${docPath}`

  try {
    const upstream = await fetch(docUrl, {
      headers: { accept: "text/plain" },
    })
    if (!upstream.ok) return null
    return await upstream.text()
  } catch {
    return null
  }
}

async function proxyAsset(url, options = {}) {
  const {
    accept = "*/*",
    binary = false,
    cacheStatus,
    contentType = "text/plain; charset=utf-8",
    releaseTag,
    unavailableMessage = "Upstream asset unavailable\n",
  } = options

  try {
    const upstream = await fetch(url, {
      headers: { accept },
    })

    if (!upstream.ok) {
      return unavailableResponse(unavailableMessage, cacheStatus)
    }

    const body = binary ? await upstream.arrayBuffer() : await upstream.text()
    const headers = {
      "content-type": contentType,
      "cache-control": "public, max-age=300",
      "x-x0x-source": url,
    }

    if (cacheStatus) {
      headers["x-x0x-cache"] = cacheStatus
    }

    if (releaseTag) {
      headers["x-x0x-release"] = releaseTag
    }

    return new Response(body, { headers })
  } catch {
    return unavailableResponse(unavailableMessage, cacheStatus)
  }
}

function unavailableResponse(message, cacheStatus) {
  const headers = {
    "content-type": "text/plain; charset=utf-8",
    "cache-control": "no-store",
  }

  if (cacheStatus) {
    headers["x-x0x-cache"] = cacheStatus
  }

  return new Response(message, {
    status: 502,
    headers,
  })
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

function notFound() {
  return new Response("Not Found\n", {
    status: 404,
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-store",
    },
  })
}

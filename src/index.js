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
const DEFAULT_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/saorsa-labs/x0x/main"

const RELEASES_CACHE_TTL = 300 // 5 minutes

const VALID_DOC_NAMES = [
  "overview",
  "install",
  "verify",
  "api",
  "patterns",
  "compared",
  "troubleshooting",
  "uninstall",
]

export default {
  async fetch(request, env) {
    const url = new URL(request.url)
    const path = url.pathname

    // Trust metadata
    if (path === "/trust.json") {
      return trustResponse(request, env)
    }

    // Install script
    if (path === "/install.sh") {
      return installerResponse(env)
    }

    // Staging install script
    if (path === "/install-staging.sh") {
      return installerResponse(env, { channel: "staging" })
    }

    // Health check
    if (path === "/health") {
      return jsonResponse({ status: "ok", service: "x0x-md-worker" })
    }

    // SKILL.md — resolve from latest release with matching assets
    if (path === "/skill.md" || path === "/skill") {
      return skillResponse(env)
    }

    // llms.txt — lightweight doc index
    if (path === "/llms.txt") {
      return llmsTxtResponse()
    }

    // llms-full.txt — assembled full docs
    if (path === "/llms-full.txt") {
      return llmsFullTxtResponse(env)
    }

    // /docs/name.md — individual doc as markdown
    const docsMatch = path.match(/^\/docs\/([a-z-]+)\.md$/)
    if (docsMatch) {
      const name = docsMatch[1]
      if (VALID_DOC_NAMES.includes(name)) {
        return docMarkdownResponse(name, env)
      }
      return notFound()
    }

    // Root — HTML for browsers, install script for CLI
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

// --- Release resolution ---

function validateRepo(repo) {
  return typeof repo === "string" && /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/.test(repo)
}

async function fetchReleasesIndex(repo) {
  const cacheKey = `https://x0x-release-index/${repo}`
  const cache = caches.default

  const cached = await cache.match(cacheKey)
  if (cached) {
    const releases = await cached.json()
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

    const allReleases = await resp.json()
    const releases = allReleases.filter((r) => !r.draft)

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

function resolveAssetUrl(releases, assetName) {
  if (!releases) return null
  for (const release of releases) {
    const asset = release.assets.find((a) => a.name === assetName)
    if (asset) {
      return { url: asset.browser_download_url, tag: release.tag_name }
    }
  }
  return null
}

function resolveSignedPair(releases, fileName) {
  if (!releases) return null
  const sigName = `${fileName}.sig`
  for (const release of releases) {
    const file = release.assets.find((a) => a.name === fileName)
    const sig = release.assets.find((a) => a.name === sigName)
    if (file && sig) {
      return {
        fileUrl: file.browser_download_url,
        sigUrl: sig.browser_download_url,
        tag: release.tag_name,
      }
    }
  }
  return null
}

// --- Responses ---

function htmlResponse(request) {
  const host = new URL(request.url).host
  return new Response(buildHtmlPage(host), {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function installerResponse(env, options = {}) {
  const channel = options.channel || "production"
  const isStaging = channel === "staging"

  const installScriptUrl = isStaging
    ? env.INSTALL_SCRIPT_URL_STAGING || env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL
    : env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL

  const repoOverride = isStaging ? env.INSTALL_SCRIPT_REPO_STAGING : null
  const releaseUrlOverride = isStaging
    ? env.INSTALL_SCRIPT_RELEASE_URL_STAGING
    : null

  const upstream = await fetch(installScriptUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("Installer source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  let body = await upstream.text()

  if (repoOverride) {
    body = body.replace(/REPO="[^"]+"/, `REPO="${repoOverride}"`)
  }

  if (releaseUrlOverride) {
    body = body.replace(
      /RELEASE_URL="[^"]+"/,
      `RELEASE_URL="${releaseUrlOverride}"`,
    )
  }

  return new Response(body, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-x0x-source": installScriptUrl,
      "x-x0x-channel": channel,
    },
  })
}

async function skillResponse(env) {
  const repo = env.GITHUB_REPO || DEFAULT_GITHUB_REPO
  const fallbackUrl = env.SKILL_URL || DEFAULT_SKILL_URL

  let skillUrl = fallbackUrl
  let releaseTag = "unknown"
  let cacheStatus = "fallback"

  if (validateRepo(repo)) {
    const index = await fetchReleasesIndex(repo)
    cacheStatus = index.cacheStatus

    const pair = resolveSignedPair(index.releases, "SKILL.md")
    if (pair) {
      skillUrl = pair.fileUrl
      releaseTag = pair.tag
    } else {
      cacheStatus = "fallback"
    }
  }

  const upstream = await fetch(skillUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("SKILL.md source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
        "x-x0x-cache": cacheStatus,
      },
    })
  }

  const body = await upstream.text()
  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-x0x-source": skillUrl,
      "x-x0x-release": releaseTag,
      "x-x0x-cache": cacheStatus,
    },
  })
}

function llmsTxtResponse() {
  const body = `# x0x — quantum secure agent-to-agent gossip network

> x0x lets agents talk to each other over an encrypted gossip mesh.
> Install with one line, verify with GPG, use via SKILL.md.

## Docs

- [Overview](https://x0x.md/docs/overview.md): What x0x is and when to use it
- [Install](https://x0x.md/docs/install.md): Installation and setup
- [Verify](https://x0x.md/docs/verify.md): Signature verification and trust
- [API](https://x0x.md/docs/api.md): Daemon API reference
- [Patterns](https://x0x.md/docs/patterns.md): Common usage patterns
- [Compared](https://x0x.md/docs/compared.md): How x0x compares to alternatives
- [Troubleshooting](https://x0x.md/docs/troubleshooting.md): Common issues and fixes
- [Uninstall](https://x0x.md/docs/uninstall.md): Clean removal

## Key resources

- [SKILL.md](https://x0x.md/skill.md): Agent skill file (the best place to start)
- [Full docs](https://x0x.md/llms-full.txt): All docs concatenated for large context windows
- [Trust metadata](https://x0x.md/trust.json): Verification endpoints and policy
- [Source](https://github.com/saorsa-labs/x0x): GitHub repository
`
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function llmsFullTxtResponse(env) {
  const sections = []

  for (const name of VALID_DOC_NAMES) {
    const markdown = await fetchDoc(name, env)
    if (markdown) {
      sections.push(markdown)
    }
  }

  const body = sections.join("\n\n---\n\n") + "\n"
  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function docMarkdownResponse(name, env) {
  const markdown = await fetchDoc(name, env)
  if (!markdown) {
    return new Response(`Doc "${name}" not available upstream\n`, {
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
    },
  })
}

async function trustResponse(request, env) {
  const reqUrl = new URL(request.url)
  const host = reqUrl.host
  const origin = reqUrl.origin
  const repo = env.GITHUB_REPO || DEFAULT_GITHUB_REPO
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL

  // Fallback URLs
  const fallbackSkillUrl = env.SKILL_URL || DEFAULT_SKILL_URL
  const fallbackSigUrl = env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL
  const fallbackGpgUrl = env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL

  let skillUrl = fallbackSkillUrl
  let skillSignatureUrl = fallbackSigUrl
  let gpgKeyUrl = fallbackGpgUrl

  if (validateRepo(repo)) {
    const index = await fetchReleasesIndex(repo)

    // Resolve SKILL.md + .sig atomically from the same release
    const pair = resolveSignedPair(index.releases, "SKILL.md")
    if (pair) {
      skillUrl = pair.fileUrl
      skillSignatureUrl = pair.sigUrl
    }
    // If pair fails, both stay on fallback (atomic fallback)

    // GPG key resolves independently
    const gpg = resolveAssetUrl(index.releases, "SAORSA_PUBLIC_KEY.asc")
    if (gpg) {
      gpgKeyUrl = gpg.url
    }
  }

  const doc = {
    project: "x0x",
    endpoint: host,
    entrypoints: {
      skill_url: `${origin}/skill.md`,
      install_url: `${origin}/install.sh`,
    },
    install: {
      command: `curl -sfL ${origin} | sh`,
      command_start: `curl -sfL ${origin} | sh -s -- --start`,
      command_autostart: `curl -sfL ${origin} | sh -s -- --autostart`,
      installer_url: installScriptUrl,
      note: "Installs x0x CLI + daemon binaries. Use --start to launch daemon, --autostart to enable boot service.",
    },
    artifacts: {
      skill_url: skillUrl,
      skill_signature_url: skillSignatureUrl,
      gpg_key_url: gpgKeyUrl,
    },
    policy: {
      non_interactive_mode: "warn_and_continue_if_gpg_missing",
      strict_verification: "planned",
    },
  }

  return jsonResponse(doc)
}

// --- Helpers ---

async function fetchDoc(name, env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const docUrl = `${baseUrl}/docs/${name}.md`

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

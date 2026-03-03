const DEFAULT_INSTALL_SCRIPT_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/main/scripts/install.sh"
const DEFAULT_SKILL_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md"
const DEFAULT_SKILL_SIGNATURE_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SKILL.md.sig"
const DEFAULT_GPG_KEY_URL =
  "https://github.com/saorsa-labs/x0x/releases/latest/download/SAORSA_PUBLIC_KEY.asc"
const DEFAULT_DOCS_BASE_URL =
  "https://raw.githubusercontent.com/JimCollinson/x0x/feat/agent-onboarding-docs"

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

    if (path === "/trust.json") {
      return trustResponse(request, env)
    }

    if (path === "/install.sh") {
      return installerResponse(env)
    }

    if (path === "/health") {
      return jsonResponse({ status: "ok", service: "x0x-md-worker" })
    }

    if (path === "/llms.txt") {
      return llmsTxtResponse()
    }

    if (path === "/llms-full.txt") {
      return llmsFullTxtResponse(env)
    }

    if (path === "/.well-known/agent.json") {
      return agentJsonResponse(env)
    }

    // /overview.md — markdown version of homepage
    if (path === "/overview.md") {
      return docsMarkdownResponse("overview", env)
    }

    // /skill.md — raw SKILL.md from latest release
    if (path === "/skill.md" || path === "/skill") {
      return skillMarkdownResponse(env)
    }

    // /docs/name.md — raw markdown
    const docsMdMatch = path.match(/^\/docs\/([a-z-]+)\.md$/)
    if (docsMdMatch) {
      const name = docsMdMatch[1]
      if (VALID_DOC_NAMES.includes(name)) {
        return docsMarkdownResponse(name, env)
      }
      return new Response("Not Found\n", { status: 404 })
    }

    // /docs/name — HTML rendered doc
    const docsHtmlMatch = path.match(/^\/docs\/([a-z-]+)$/)
    if (docsHtmlMatch) {
      const name = docsHtmlMatch[1]
      if (VALID_DOC_NAMES.includes(name)) {
        return docsHtmlResponse(name, env)
      }
      return new Response("Not Found\n", { status: 404 })
    }

    // / — homepage (overview.md rendered in designed shell)
    if (path === "/" || path === "") {
      return homepageResponse(env)
    }

    return new Response("Not Found\n", { status: 404 })
  },
}


// --- Fetch helpers ---

async function fetchDoc(name, env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const docUrl = `${baseUrl}/docs/${name}.md`

  const upstream = await fetch(docUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return null
  }

  return await upstream.text()
}


// --- Route handlers ---

async function homepageResponse(env) {
  const markdown = await fetchDoc("overview", env)

  if (markdown === null) {
    return new Response("Homepage source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  // Rewrite absolute x0x.md URLs to relative, and strip .md from doc links so they hit the HTML route
  const localised = markdown
    .replace(/https:\/\/x0x\.md\//g, "/")
    .replace(/\/docs\/([a-z-]+)\.md/g, "/docs/$1")
  const rendered = markdownToHtml(localised)
  const body = htmlPage({
    title: "x0x — Peer-to-peer agent communication",
    description:
      "x0x is a peer-to-peer gossip network for agent-to-agent communication. Post-quantum encrypted, decentralised, no servers required.",
    content: rendered,
    isHomepage: true,
  })

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

async function docsHtmlResponse(name, env) {
  const markdown = await fetchDoc(name, env)

  if (markdown === null) {
    return new Response("Document source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const localised = markdown.replace(/https:\/\/x0x\.md\//g, "/")
  const rendered = markdownToHtml(localised)
  const title = extractTitle(localised) || name
  const body = htmlPage({
    title: `${title} — x0x`,
    description: `x0x documentation: ${name}`,
    content: rendered,
    isHomepage: false,
    docName: name,
  })

  return new Response(body, {
    headers: {
      "content-type": "text/html; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  })
}

async function docsMarkdownResponse(name, env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const docUrl = `${baseUrl}/docs/${name}.md`

  const upstream = await fetch(docUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("Document source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
      "x-x0x-source": docUrl,
    },
  })
}

async function fetchSkill(env) {
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL
  const upstream = await fetch(skillUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return null
  }

  return await upstream.text()
}

async function skillMarkdownResponse(env) {
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL
  const upstream = await fetch(skillUrl, {
    headers: { accept: "text/plain" },
  })

  if (!upstream.ok) {
    return new Response("SKILL.md source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
      "x-x0x-source": skillUrl,
    },
  })
}

async function installerResponse(env) {
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL
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

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "text/x-shellscript; charset=utf-8",
      "cache-control": "public, max-age=300",
      "x-x0x-source": installScriptUrl,
    },
  })
}

function trustResponse(request, env) {
  const host = new URL(request.url).host
  const installScriptUrl = env.INSTALL_SCRIPT_URL || DEFAULT_INSTALL_SCRIPT_URL
  const skillUrl = env.SKILL_URL || DEFAULT_SKILL_URL
  const skillSignatureUrl = env.SKILL_SIGNATURE_URL || DEFAULT_SKILL_SIGNATURE_URL
  const gpgKeyUrl = env.GPG_KEY_URL || DEFAULT_GPG_KEY_URL

  const doc = {
    project: "x0x",
    endpoint: host,
    install: {
      command: `curl -sfL https://${host}/install.sh | sh`,
      installer_url: installScriptUrl,
      note: "Installer verifies SKILL.md signature when GPG is available.",
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

async function agentJsonResponse(env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL
  const agentJsonUrl = `${baseUrl}/.well-known/agent.json`

  const upstream = await fetch(agentJsonUrl, {
    headers: { accept: "application/json" },
  })

  if (!upstream.ok) {
    return new Response("Agent card source unavailable\n", {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const body = await upstream.text()

  return new Response(body, {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
      "x-x0x-source": agentJsonUrl,
    },
  })
}

function llmsTxtResponse() {
  const content = `# x0x

> Secure gossip network for agent-to-agent communication. Post-quantum encrypted. Decentralised. No servers required.

x0x is a peer-to-peer communication layer for AI agents. Agents join a global gossip network, exchange cryptographically signed messages, manage trust relationships, and collaborate on shared task lists — without any central server or human configuration. Current version: 0.2.0.

Do not use x0x as an MCP server (it is a standalone network, not a tool). Do not use the Python or Node.js SDKs (they are stubs — use the REST API directly).

## Documentation

- [Overview](https://x0x.md/docs/overview.md): What x0x is, what it isn't, current state of every feature, how agents use it
- [Install](https://x0x.md/docs/install.md): Non-interactive installation of x0xd daemon
- [Verify](https://x0x.md/docs/verify.md): Post-install verification sequence with success/failure conditions
- [API Reference](https://x0x.md/docs/api.md): Endpoint quick-reference for x0xd on 127.0.0.1:12700
- [Patterns](https://x0x.md/docs/patterns.md): Common usage patterns — messaging, task lists, trust exchange
- [Compared](https://x0x.md/docs/compared.md): x0x vs MCP, A2A, direct HTTP — when to use what
- [Troubleshooting](https://x0x.md/docs/troubleshooting.md): Common errors and diagnostic steps
- [Uninstall](https://x0x.md/docs/uninstall.md): Clean removal of x0x

## Optional

- [SKILL.md](https://github.com/saorsa-labs/x0x/blob/main/SKILL.md): Agent Skills format capability definition
- [Agent Card](https://x0x.md/.well-known/agent.json): A2A-compatible machine-readable capability declaration
- [Source](https://github.com/saorsa-labs/x0x): Full source code (Rust, MIT/Apache-2.0)
`

  return new Response(content, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  })
}

async function llmsFullTxtResponse(env) {
  const baseUrl = env.DOCS_BASE_URL || DEFAULT_DOCS_BASE_URL

  const fetches = VALID_DOC_NAMES.map(async (name) => {
    const docUrl = `${baseUrl}/docs/${name}.md`
    const res = await fetch(docUrl, { headers: { accept: "text/plain" } })
    if (!res.ok) {
      return { name, content: null }
    }
    return { name, content: await res.text() }
  })

  const results = await Promise.all(fetches)
  const failed = results.filter((r) => r.content === null)

  if (failed.length > 0) {
    const names = failed.map((r) => r.name).join(", ")
    return new Response(`Documentation source unavailable: ${names}\n`, {
      status: 502,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "cache-control": "no-store",
      },
    })
  }

  const sections = results.map(
    (r) => `# ${r.name}.md\n\n${r.content.trim()}`
  )
  const body = sections.join("\n\n---\n\n") + "\n"

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=300",
      "access-control-allow-origin": "*",
    },
  })
}


// --- Markdown to HTML converter ---

function markdownToHtml(markdown) {
  const lines = markdown.split("\n")
  const output = []
  let inCodeBlock = false
  let codeLines = []
  let inList = false
  let listType = null // "ul" or "ol"
  let paragraph = []

  function escapeHtml(text) {
    return text
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
  }

  function inlineFormat(text) {
    // Links: [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2">$1</a>'
    )
    // Bold: **text** or __text__
    text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    text = text.replace(/__(.+?)__/g, "<strong>$1</strong>")
    // Italic: *text* or _text_ (but not inside words with underscores)
    text = text.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, "<em>$1</em>")
    // Inline code: `code`
    text = text.replace(/`([^`]+?)`/g, function (_, code) {
      return "<code>" + code + "</code>"
    })
    return text
  }

  function flushParagraph() {
    if (paragraph.length > 0) {
      const text = paragraph.join(" ").trim()
      if (text) {
        output.push("<p>" + inlineFormat(escapeHtml(text)) + "</p>")
      }
      paragraph = []
    }
  }

  function closeList() {
    if (inList) {
      output.push(listType === "ol" ? "</ol>" : "</ul>")
      inList = false
      listType = null
    }
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]

    // Fenced code blocks
    if (line.startsWith("```")) {
      if (inCodeBlock) {
        output.push("<pre><code>" + codeLines.join("\n") + "</code></pre>")
        codeLines = []
        inCodeBlock = false
      } else {
        flushParagraph()
        closeList()
        inCodeBlock = true
      }
      continue
    }

    if (inCodeBlock) {
      codeLines.push(escapeHtml(line))
      continue
    }

    // Blank line
    if (line.trim() === "") {
      flushParagraph()
      closeList()
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      closeList()
      const level = headingMatch[1].length
      const text = headingMatch[2]
      output.push(
        `<h${level}>${inlineFormat(escapeHtml(text))}</h${level}>`
      )
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      flushParagraph()
      closeList()
      output.push("<hr>")
      continue
    }

    // Table row
    if (line.trim().startsWith("|") && line.trim().endsWith("|")) {
      flushParagraph()
      closeList()
      // Collect all contiguous table lines
      const tableLines = []
      let j = i
      while (j < lines.length && lines[j].trim().startsWith("|") && lines[j].trim().endsWith("|")) {
        tableLines.push(lines[j])
        j++
      }
      i = j - 1 // advance past table lines

      if (tableLines.length >= 2) {
        output.push("<table>")
        // Header row
        const headerCells = tableLines[0].split("|").slice(1, -1).map(c => c.trim())
        output.push("<thead><tr>")
        for (const cell of headerCells) {
          output.push("<th>" + inlineFormat(escapeHtml(cell)) + "</th>")
        }
        output.push("</tr></thead>")
        // Skip separator row (index 1), render body rows
        output.push("<tbody>")
        for (let k = 2; k < tableLines.length; k++) {
          const cells = tableLines[k].split("|").slice(1, -1).map(c => c.trim())
          output.push("<tr>")
          for (const cell of cells) {
            output.push("<td>" + inlineFormat(escapeHtml(cell)) + "</td>")
          }
          output.push("</tr>")
        }
        output.push("</tbody>")
        output.push("</table>")
      }
      continue
    }

    // Unordered list item
    const ulMatch = line.match(/^[-*]\s+(.+)$/)
    if (ulMatch) {
      flushParagraph()
      if (!inList || listType !== "ul") {
        closeList()
        output.push("<ul>")
        inList = true
        listType = "ul"
      }
      output.push("<li>" + inlineFormat(escapeHtml(ulMatch[1])) + "</li>")
      continue
    }

    // Ordered list item
    const olMatch = line.match(/^\d+\.\s+(.+)$/)
    if (olMatch) {
      flushParagraph()
      if (!inList || listType !== "ol") {
        closeList()
        output.push("<ol>")
        inList = true
        listType = "ol"
      }
      output.push("<li>" + inlineFormat(escapeHtml(olMatch[1])) + "</li>")
      continue
    }

    // Regular text — accumulate into paragraph
    paragraph.push(line)
  }

  // Flush remaining state
  if (inCodeBlock) {
    output.push("<pre><code>" + codeLines.join("\n") + "</code></pre>")
  }
  flushParagraph()
  closeList()

  return output.join("\n")
}

function extractTitle(markdown) {
  const match = markdown.match(/^#\s+(.+)$/m)
  return match ? match[1] : null
}


// --- HTML template ---

function htmlPage({ title, description, content, isHomepage, docName }) {
  const jsonLd = isHomepage
    ? `
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "x0x",
    "description": "Peer-to-peer gossip network for agent-to-agent communication. Post-quantum encrypted, decentralised, no servers required.",
    "applicationCategory": "DeveloperApplication",
    "operatingSystem": "Linux, macOS",
    "softwareVersion": "0.2.0",
    "license": "https://opensource.org/licenses/MIT",
    "url": "https://x0x.md",
    "codeRepository": "https://github.com/saorsa-labs/x0x",
    "programmingLanguage": "Rust",
    "author": {
      "@type": "Organization",
      "name": "Saorsa Labs",
      "url": "https://saorsalabs.com"
    }
  }
  </script>`
    : ""

  const mdPath = `/docs/${docName}.md`

  const alternateLinks = isHomepage
    ? `
  <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable index">
  <link rel="alternate" type="text/markdown" href="/overview.md" title="Markdown version">
  <link rel="alternate" type="application/json" href="/.well-known/agent.json" title="A2A Agent Card">`
    : `
  <link rel="alternate" type="text/markdown" href="${mdPath}" title="Markdown version">`

  const footer = isHomepage
    ? `
  <footer>
    <p>Machine-readable: <a href="https://x0x.md/llms.txt">llms.txt</a> · <a href="https://x0x.md/llms-full.txt">llms-full.txt</a> · <a href="https://x0x.md/.well-known/agent.json">agent.json</a> · <a href="https://x0x.md/trust.json">trust.json</a></p>
  </footer>`
    : `
  <footer>
    <p><a href="/">← x0x.md</a> · <a href="${mdPath}">Markdown version</a></p>
  </footer>`

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtmlAttr(title)}</title>
  <meta name="description" content="${escapeHtmlAttr(description)}">${alternateLinks}${jsonLd}
  <style>
    :root { color-scheme: light dark; }
    body {
      margin: 0;
      font-family: ui-sans-serif, -apple-system, "Segoe UI", Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a2a3a;
      background: #f7f9fb;
    }
    @media (prefers-color-scheme: dark) {
      body { color: #d0dce8; background: #0d1117; }
      a { color: #58a6ff; }
      pre { background: #161b22; border-color: #30363d; }
    }
    main {
      max-width: 72ch;
      margin: 0 auto;
      padding: 2rem 1.5rem;
    }
    h1 { font-size: 1.8rem; margin: 0 0 0.5rem; }
    h2 { font-size: 1.2rem; margin: 2rem 0 0.75rem; }
    h3 { font-size: 1.05rem; margin: 1.5rem 0 0.5rem; }
    p { margin: 0.5rem 0; }
    pre {
      background: #f0f4f8;
      border: 1px solid #d8e3ea;
      border-radius: 6px;
      padding: 0.75rem 1rem;
      overflow-x: auto;
      font-size: 0.9rem;
    }
    code { font-family: ui-monospace, "SF Mono", Menlo, monospace; font-size: 0.9em; }
    ul, ol { padding-left: 1.5rem; }
    li { margin: 0.25rem 0; }
    a { color: #0b5e90; }
    hr { border: none; border-top: 1px solid #e8eef3; margin: 2rem 0; }
    table { border-collapse: collapse; width: 100%; margin: 0.5rem 0; font-size: 0.9rem; }
    th, td { border: 1px solid #d8e3ea; padding: 0.4rem 0.75rem; text-align: left; }
    th { background: #f0f4f8; font-weight: 600; }
    footer { margin-top: 2rem; font-size: 0.85rem; color: #6b7f8e; }
    @media (prefers-color-scheme: dark) {
      hr { border-top-color: #21262d; }
      footer { color: #8b949e; }
      th, td { border-color: #30363d; }
      th { background: #161b22; }
    }
  </style>
</head>
<body>
<main>
${content}
${footer}
</main>
</body>
</html>`
}

function escapeHtmlAttr(text) {
  return text
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
}

function jsonResponse(data) {
  return new Response(JSON.stringify(data, null, 2) + "\n", {
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  })
}

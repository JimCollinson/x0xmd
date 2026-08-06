# ADR-0007: Fail Closed When Rendering Upstream Markdown

- **Status:** Proposed
- **Date:** 2026-05-19
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [PR #2](https://github.com/JimCollinson/x0xmd/pull/2); [initial sanitization review fix](https://github.com/JimCollinson/x0xmd/commit/a7daff7ec56b89dd75f1155f01ba2c3190a14cda); [fail-closed review fix](https://github.com/JimCollinson/x0xmd/commit/7a5625b196baefcda9fe5d2c04e2eea74c846cdd); [live-content cleanup](https://github.com/JimCollinson/x0xmd/commit/951de86a40847508336b7b9dcaa8e0b1849bab1b)

## Context

This is a retrospective record prepared on 2026-08-06 for the security boundary established during PR #2 on 2026-05-19. The frontend fetches an upstream conceptual guide at runtime, parses Markdown into HTML, rewrites relative links, builds navigation, and inserts the result into the document. Although the upstream repository is trusted, Markdown and its links are network-delivered input crossing into an HTML execution context.

The first live-rendering implementation needed explicit URL restrictions and sanitization. Review then found that treating the sanitizer as optional could fall back to injecting parsed or raw content without the protection the design depended on. The current implementation loads version-pinned parser and sanitizer scripts from a runtime CDN, but the availability model and the absence or presence of SRI/CSP guarantees have not been accepted as a durable policy.

## Decision Drivers

- Prevent upstream Markdown or embedded HTML from becoming script execution in x0x.md.
- Restrict rendered links to safe schemes and preserve deliberate relative-link rewriting.
- Keep sanitization a hard precondition rather than an optional best effort.
- Degrade to a safe source link when rendering dependencies or upstream content are unavailable.

## Considered Options

1. Parse and inject upstream Markdown without sanitization because the source repository is trusted.
2. Parse and sanitize when possible, but inject an unsanitized rendering or raw fallback if the sanitizer is unavailable.
3. Parse with restricted link handling, sanitize before insertion, and fail closed to a locally controlled fallback when any required step is unavailable.
4. Remove runtime rendering and publish only a link to the upstream Markdown.

## Decision

We will treat upstream Markdown rendering as an untrusted-content boundary: parse the Markdown, restrict and escape rendered links, sanitize the generated HTML, and only then insert it into the page.

The parser and sanitizer are both required for rendered output. If the fetch, parser, sanitizer, or rendering pipeline is unavailable, the page must show a locally controlled safe fallback that links to the upstream source. It must never inject raw Markdown or unsanitized generated HTML as a fallback.

## Consequences

### Positive

- Raw HTML, active elements, and unsafe link schemes from network-delivered Markdown are constrained before DOM insertion.
- Missing security dependencies reduce functionality instead of silently reducing security.
- Users retain a path to the canonical guide when inline rendering fails.

### Negative / Trade-offs

- The conceptual guide depends on runtime fetch, parser, and sanitizer availability for inline rendering.
- Sanitization can remove upstream formatting or elements that would otherwise render.
- Link rewriting and heading extraction add maintained transformation code and test surface.

### Neutral / Operational

- The current implementation uses version-pinned `marked` and DOMPurify CDN URLs; version pinning does not by itself decide CDN availability, SRI, or CSP policy.
- The safe fallback is a degraded presentation, not a cached substitute for the upstream content.

## Validation

- Exercise Markdown containing raw scripts, active/embed elements, event handlers, malformed attributes, and `javascript:`, `data:`, `vbscript:`, and `file:` links; require the rendered DOM to contain no executable result.
- Simulate missing parser, missing sanitizer, fetch failure, and parse failure; require only the safe fallback and confirm no raw or unsanitized upstream bytes enter `innerHTML`.
- Verify permitted relative, fragment, HTTP(S), and mail links are rewritten or retained as intended and escaped before insertion.
- Human review must decide whether runtime CDN availability and the current SRI/CSP posture are accepted trade-offs of this decision or require a named follow-up. This Proposed ADR records the question and does not invent a resolution.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

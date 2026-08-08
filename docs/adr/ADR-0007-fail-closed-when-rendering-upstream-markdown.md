# ADR-0007: Fail Closed When Rendering Upstream Markdown

- **Status:** Proposed
- **Date:** 2026-05-19
- **Decision owners:** Jim Collinson
- **Reviewers:** Pending human review
- **Supersedes:** none
- **Superseded by:** none
- **Related:** [PR #2](https://github.com/JimCollinson/x0xmd/pull/2); [initial sanitization review fix](https://github.com/JimCollinson/x0xmd/commit/a7daff7ec56b89dd75f1155f01ba2c3190a14cda); [fail-closed review fix](https://github.com/JimCollinson/x0xmd/commit/7a5625b196baefcda9fe5d2c04e2eea74c846cdd); [live-content cleanup](https://github.com/JimCollinson/x0xmd/commit/951de86a40847508336b7b9dcaa8e0b1849bab1b); [contract conformance follow-up](../../planning/phases/02-contract-conformance/02-01-PLAN.md)

## Context

This is a retrospective record prepared on 2026-08-06 for the security boundary established during PR #2 on 2026-05-19. The frontend fetches an upstream conceptual guide at runtime, parses Markdown into HTML, rewrites relative links, builds navigation, and inserts the result into the document. Although the upstream repository is trusted, Markdown and its links are network-delivered input crossing into an HTML execution context.

The rendering boundary therefore requires explicit URL restrictions, sanitization, and safe failure behaviour. Runtime delivery of parser and sanitizer dependencies also raises a separate human design question about CDN availability, Subresource Integrity (SRI), and Content Security Policy (CSP).

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

The parser and sanitizer are both required for rendered output. If the fetch, parser, sanitizer, or rendering pipeline is unavailable, the page must show a locally controlled safe fallback that links to the upstream source. Fallback markup and content must be locally controlled: network input and exception details must never be interpolated as HTML. If diagnostic details are shown, they must be escaped and rendered as text. The fallback must never inject raw Markdown or unsanitized generated HTML.

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

- Version-pinned parser and sanitizer URLs do not by themselves decide CDN availability, SRI, or CSP policy.
- The safe fallback is a degraded presentation, not a cached substitute for the upstream content.

## Validation

- Exercise Markdown containing raw scripts, active/embed elements, event handlers, malformed attributes, and `javascript:`, `data:`, `vbscript:`, and `file:` links; require the rendered DOM to contain no executable result.
- Simulate missing parser, missing sanitizer, fetch failure, and parse failure; require only locally controlled fallback markup, confirm no raw or unsanitized upstream bytes enter `innerHTML`, and confirm network input or exception details cannot create markup.
- If diagnostics are displayed, inject HTML metacharacters and active-element payloads into the diagnostic source and confirm they are escaped and rendered only as text.
- Verify permitted relative, fragment, HTTP(S), and mail links are rewritten or retained as intended and escaped before insertion.
- Human review must decide whether runtime CDN dependency delivery and the SRI/CSP posture are accepted trade-offs of this decision or require a named follow-up. This Proposed ADR records the question and does not invent a resolution.

## Notes for AI-assisted work

AI tools may help draft this ADR, but **must not mark it Accepted without human review**. Accepted ADRs are immutable: create a new superseding ADR rather than editing an Accepted ADR.

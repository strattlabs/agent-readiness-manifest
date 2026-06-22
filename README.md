# agent-readiness-manifest

[![License: Apache 2.0](https://img.shields.io/badge/license-Apache--2.0-blue.svg)](LICENSE) · [Spec site](https://strattlabs.github.io/agent-readiness-manifest/) · [strattlabs.com](https://strattlabs.com)

An open, **declaration-only** spec and reference validator for the **Agent
Readiness Manifest** — a single well-known descriptor that points to a site's
agent-relevant resources and states its self-declared posture toward automated
agents.

Think `robots.txt`, but for agent discovery: one small JSON file that says
_"here is everything I declare about how to work with me"_ and points at your
existing `llms.txt`, MCP descriptor, agent card, OpenAPI doc, policies, and more.

- 📄 **[SPEC.md](SPEC.md)** — the specification.
- 🧱 **[schema/agent-readiness.schema.json](schema/agent-readiness.schema.json)** — the normative JSON Schema (draft 2020-12).
- ✅ **Reference validator** — a small CLI + library that checks a manifest against the schema.

> **Status:** v0.1 draft / request-for-comment. The schema is the normative
> contract; expect additive change before 1.0.

The manifest is a set of pointers and self-declared posture, and the reference
validator is **structural only**: it tells you a manifest is _well-formed_ against
the schema.

## Install

```bash
pnpm add @strattlabs/agent-readiness-manifest
# or: npm i @strattlabs/agent-readiness-manifest
```

Requires Node.js ≥ 18.18.

## CLI

```bash
agent-readiness validate ./.well-known/agent-readiness.json
```

Exit code `0` when the manifest is structurally valid, `1` when invalid, `2` on a
usage error — suitable for CI.

```bash
$ agent-readiness validate examples/invalid.json
  /version: must match pattern "^\d+\.\d+$"
  /site: must have required property 'url'
  /resources/llmsTxt: must match pattern "^(https?://|/).+"
  (root): unexpected property "unknownField"
  /policy/agentsAllowed: must be boolean
✗ examples/invalid.json: 5 error(s)
```

The schema declares a fixed vocabulary (`additionalProperties: false`), so any
property it does not define is reported as an error.

## Library

```ts
import { validateManifest, type AgentReadinessManifest } from '@strattlabs/agent-readiness-manifest';

const manifest: AgentReadinessManifest = {
  version: '0.1',
  site: { name: 'Acme', url: 'https://acme.example.com' },
  resources: { llmsTxt: '/llms.txt', mcp: '/.well-known/mcp.json' },
  policy: { agentsAllowed: true },
};

const result = validateManifest(manifest);
if (!result.valid) {
  for (const e of result.errors) console.error(`${e.path}: ${e.message}`);
}
```

The JSON Schema is also importable for use in your own tooling:

```ts
import { loadSchema } from '@strattlabs/agent-readiness-manifest';
// or reference the file directly:
import schema from 'agent-readiness-manifest/schema' with { type: 'json' };
```

## Minimal manifest

```json
{
  "$schema": "https://strattlabs.github.io/agent-readiness-manifest/schema/agent-readiness.schema.json",
  "version": "0.1",
  "site": { "url": "https://acme.example.com" }
}
```

See [`examples/`](examples/) for minimal, complete, and intentionally-invalid
samples.

## Contributing

A new field is welcome when it answers _"what does the site declare about itself,
or where does it keep an existing resource?"_ Open an issue to propose one.

## Development

```bash
pnpm install
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## License

[Apache-2.0](LICENSE) © 2026 Stratt Labs. Apache-2.0 (rather than MIT) is chosen
deliberately for a spec: its explicit patent grant reassures implementers adopting
the vocabulary, which is exactly the broad, friction-free adoption a standard
wants.

---

## Part of the Stratt Labs toolkit for the agentic web

Small, standards-friendly tools from [Stratt Labs](https://strattlabs.com):

- [llms-txt-kit](https://github.com/strattlabs/llms-txt-kit) — generate and
  validate `llms.txt` / `llms-full.txt` files.
- [schema-for-agents](https://github.com/strattlabs/schema-for-agents) — JSON-LD
  recipes for agent-legible commerce and content.
- [webmcp-starter](https://github.com/strattlabs/webmcp-starter) — a minimal
  WebMCP reference page.

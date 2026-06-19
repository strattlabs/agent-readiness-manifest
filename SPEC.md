# Agent Readiness Manifest — Specification

**Version:** 0.1 (draft) · **Status:** Request for comment

## 1. Purpose

As automated agents and AI answer engines increasingly read the web, the signals
that make a site legible to them have multiplied: `llms.txt`, `/.well-known/mcp`,
agent cards, OpenAPI documents, Markdown alternates, structured data, and more.
These conventions are useful but **scattered** — there is no single place a site
can point an agent to in order to say _"here is everything I declare about how to
work with me."_

The **Agent Readiness Manifest** is that single place: a small, machine-readable
descriptor, published at a well-known location, that **points to** the
agent-relevant resources a site already exposes and states the site's
**self-declared posture** toward automated agents.

It is the `robots.txt` pattern applied to agent discovery: lightweight, neutral,
adoptable with zero market power, and useful to anyone — not tied to any vendor.

## 2. What this spec covers

This specification covers **declaration and discovery**. It standardizes
_what a site says about itself_: a set of pointers to the agent-relevant resources
a site already exposes, plus its self-declared posture toward automated agents.

> **Conformance, precisely.** A document "conforms to" this spec when it is
> structurally valid against the JSON Schema — that is, the _declaration_ is
> well-formed.

## 3. Location

A site SHOULD publish its manifest at:

```
/.well-known/agent-readiness.json
```

following [RFC 8615](https://www.rfc-editor.org/rfc/rfc8615). The file MUST be
served as `application/json`.

## 4. Document model

The manifest is a single JSON object. The normative contract is the JSON Schema
at [`schema/agent-readiness.schema.json`](schema/agent-readiness.schema.json);
this section describes it.

### 4.1 Top-level fields

| Field       | Type   | Required | Meaning                                             |
| ----------- | ------ | -------- | --------------------------------------------------- |
| `version`   | string | yes      | Spec version this document targets, e.g. `"0.1"`.   |
| `site`      | object | yes      | Identity of the publishing site (§4.2).             |
| `resources` | object | no       | Pointers to existing declaration surfaces (§4.3).   |
| `contact`   | object | no       | How to reach a human about automated access (§4.4). |
| `policy`    | object | no       | Self-declared posture toward agents (§4.5).         |
| `metadata`  | object | no       | Bookkeeping (§4.6).                                 |
| `$schema`   | string | no       | Optional pointer to the JSON Schema.                |

Unknown top-level properties are **rejected** (`additionalProperties: false`).
This is deliberate: it keeps the vocabulary tight and stable, so every manifest
draws from the same fixed set of fields.

### 4.2 `site`

| Field         | Type         | Required | Meaning                           |
| ------------- | ------------ | -------- | --------------------------------- |
| `url`         | string (uri) | yes      | Canonical base URL of the site.   |
| `name`        | string       | no       | Human-readable site name.         |
| `description` | string       | no       | One-line description of the site. |

### 4.3 `resources`

A map of pointers to resources defined by **other** specifications. Each value is
a **resource reference**: an absolute URL (`https://…`) or a root-relative path
(beginning with `/`). A pointer asserts that the resource is _declared to exist_
at that location.

| Field                | Points to                                                           |
| -------------------- | ------------------------------------------------------------------- |
| `llmsTxt`            | An [`llms.txt`](https://llmstxt.org) index.                         |
| `llmsFullTxt`        | An `llms-full.txt` full-content file.                               |
| `mcp`                | A Model Context Protocol descriptor (e.g. `/.well-known/mcp.json`). |
| `agentCard`          | An agent card describing available agent interfaces.                |
| `openapi`            | An OpenAPI document.                                                |
| `sitemap`            | An XML sitemap.                                                     |
| `robots`             | A `robots.txt`.                                                     |
| `markdownAlternates` | A location where Markdown alternates of pages are served.           |
| `termsOfService`     | Terms of service.                                                   |
| `privacyPolicy`      | Privacy policy.                                                     |

All fields are optional. A site declares only the surfaces it actually exposes.

### 4.4 `contact`

| Field   | Type           | Meaning                                      |
| ------- | -------------- | -------------------------------------------- |
| `email` | string (email) | Contact address for agent-related questions. |
| `url`   | resource ref   | A contact page.                              |

### 4.5 `policy`

The site's **self-declared, non-binding** posture toward automated agents. These
are statements of intent.

| Field           | Type         | Meaning                                                                                    |
| --------------- | ------------ | ------------------------------------------------------------------------------------------ |
| `agentsAllowed` | boolean      | Whether the site declares that it welcomes automated-agent use.                            |
| `policyUrl`     | resource ref | A fuller AI/agent policy document.                                                         |
| `guidance`      | string       | Free-text guidance for agent operators (e.g. preferred User-Agent, courtesy expectations). |

### 4.6 `metadata`

| Field         | Type          | Meaning                                 |
| ------------- | ------------- | --------------------------------------- |
| `lastUpdated` | string (date) | ISO date the manifest was last changed. |
| `generator`   | string        | Tool that produced the manifest.        |

## 5. Example

```json
{
  "$schema": "https://strattlabs.github.io/agent-readiness-manifest/schema/agent-readiness.schema.json",
  "version": "0.1",
  "site": { "name": "Acme", "url": "https://acme.example.com" },
  "resources": {
    "llmsTxt": "/llms.txt",
    "mcp": "/.well-known/mcp.json"
  },
  "policy": { "agentsAllowed": true, "policyUrl": "/ai-policy" }
}
```

More in [`examples/`](examples/).

## 6. Versioning

This spec uses `MAJOR.MINOR` versions. Additive, backward-compatible changes bump
MINOR; changes that remove or repurpose a field bump MAJOR. The `version` field in
a manifest names the spec version it targets.

## 7. License

The specification text and schema are licensed under
[Apache-2.0](LICENSE) to encourage broad, friction-free implementation of the
vocabulary.

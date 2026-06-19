# Changelog

The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and
this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] — Unreleased

### Added

- Agent Readiness Manifest specification ([SPEC.md](SPEC.md)) — a declaration-only
  descriptor for a site's agent-relevant resources and self-declared posture.
- Normative JSON Schema (draft 2020-12) at `schema/agent-readiness.schema.json`.
- Reference validator (`validateManifest`, `validateManifestJson`) — structural
  validation only, built on Ajv.
- `agent-readiness` CLI with CI-friendly exit codes.
- Minimal, complete, and invalid example manifests.

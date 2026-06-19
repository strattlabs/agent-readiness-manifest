/**
 * agent-readiness-manifest — reference validator for the Agent Readiness
 * Manifest, a declaration-only descriptor for a site's agent-relevant resources.
 *
 * The validator is STRUCTURAL only: it checks that a manifest is well-formed
 * against the JSON Schema.
 */
export { validateManifest, validateManifestJson } from './validate.js';
export type { ManifestError, ManifestValidationResult } from './validate.js';
export { loadSchema } from './schema.js';
export type {
  AgentReadinessManifest,
  ManifestSite,
  ManifestResources,
  ManifestContact,
  ManifestPolicy,
  ManifestMetadata,
  ResourceRef,
} from './types.js';

/**
 * TypeScript shape of an Agent Readiness Manifest, mirroring
 * `schema/agent-readiness.schema.json`.
 *
 * This is a DECLARATION-ONLY data shape: pointers to existing resources and a
 * self-declared posture.
 */

/** An absolute URL or a root-relative path (beginning with `/`). */
export type ResourceRef = string;

export interface ManifestSite {
  name?: string;
  url: string;
  description?: string;
}

/** Pointers to existing, separately-specified declaration surfaces. */
export interface ManifestResources {
  llmsTxt?: ResourceRef;
  llmsFullTxt?: ResourceRef;
  mcp?: ResourceRef;
  agentCard?: ResourceRef;
  openapi?: ResourceRef;
  sitemap?: ResourceRef;
  robots?: ResourceRef;
  markdownAlternates?: ResourceRef;
  termsOfService?: ResourceRef;
  privacyPolicy?: ResourceRef;
}

export interface ManifestContact {
  email?: string;
  url?: ResourceRef;
}

/** Self-declared, non-binding posture toward automated agents. */
export interface ManifestPolicy {
  agentsAllowed?: boolean;
  policyUrl?: ResourceRef;
  guidance?: string;
}

export interface ManifestMetadata {
  lastUpdated?: string;
  generator?: string;
}

export interface AgentReadinessManifest {
  $schema?: string;
  version: string;
  site: ManifestSite;
  resources?: ManifestResources;
  contact?: ManifestContact;
  policy?: ManifestPolicy;
  metadata?: ManifestMetadata;
}

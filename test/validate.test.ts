import { describe, expect, it } from 'vitest';
import { validateManifest, validateManifestJson } from '../src/validate.js';

describe('validateManifest', () => {
  it('accepts a minimal valid manifest', () => {
    const result = validateManifest({
      version: '0.1',
      site: { url: 'https://acme.example.com' },
    });
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('accepts a fully-populated manifest', () => {
    const result = validateManifest({
      version: '0.1',
      site: { name: 'Acme', url: 'https://acme.example.com', description: 'x' },
      resources: { llmsTxt: '/llms.txt', mcp: '/.well-known/mcp.json' },
      contact: { email: 'agents@acme.example.com', url: '/contact' },
      policy: { agentsAllowed: true, policyUrl: '/ai-policy', guidance: 'be nice' },
      metadata: { lastUpdated: '2026-06-20', generator: 'test' },
    });
    expect(result.valid).toBe(true);
  });

  it('requires version and site', () => {
    const result = validateManifest({});
    expect(result.valid).toBe(false);
    const messages = result.errors.map((e) => e.message).join(' ');
    expect(messages).toMatch(/version/);
    expect(messages).toMatch(/site/);
  });

  it('rejects a malformed version', () => {
    const result = validateManifest({ version: '1', site: { url: 'https://e.com' } });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/version')).toBe(true);
  });

  it('rejects a relative-without-slash resource pointer', () => {
    const result = validateManifest({
      version: '0.1',
      site: { url: 'https://e.com' },
      resources: { llmsTxt: 'llms.txt' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/resources/llmsTxt')).toBe(true);
  });

  it('rejects unknown top-level properties', () => {
    // The schema declares a fixed vocabulary (additionalProperties: false).
    const result = validateManifest({
      version: '0.1',
      site: { url: 'https://e.com' },
      unknownField: true,
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => /unknownField/.test(e.message))).toBe(true);
  });

  it('rejects a non-boolean agentsAllowed', () => {
    const result = validateManifest({
      version: '0.1',
      site: { url: 'https://e.com' },
      policy: { agentsAllowed: 'yes' },
    });
    expect(result.valid).toBe(false);
    expect(result.errors.some((e) => e.path === '/policy/agentsAllowed')).toBe(true);
  });

  it('surfaces JSON syntax errors via validateManifestJson', () => {
    const result = validateManifestJson('{ not valid json ');
    expect(result.valid).toBe(false);
    expect(result.errors[0]?.message).toMatch(/Invalid JSON/);
  });
});

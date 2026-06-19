import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { validateManifestJson } from '../src/validate.js';

async function loadExample(name: string): Promise<string> {
  const url = new URL(`../examples/${name}`, import.meta.url);
  return readFile(fileURLToPath(url), 'utf8');
}

describe('bundled examples', () => {
  it('minimal.json is valid', async () => {
    expect(validateManifestJson(await loadExample('minimal.json')).valid).toBe(true);
  });

  it('complete.json is valid', async () => {
    expect(validateManifestJson(await loadExample('complete.json')).valid).toBe(true);
  });

  it('invalid.json is rejected with multiple errors', async () => {
    const result = validateManifestJson(await loadExample('invalid.json'));
    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThan(1);
  });
});

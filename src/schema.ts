import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/**
 * Load the canonical Agent Readiness Manifest JSON Schema.
 *
 * The schema file under `schema/` is the single source of truth and ships with
 * the package. It is resolved relative to this module so the same code path
 * works in `src/` (dev) and `dist/` (published) — both sit one level under the
 * package root alongside `schema/`.
 */
export function loadSchema(): Record<string, unknown> {
  const url = new URL('../schema/agent-readiness.schema.json', import.meta.url);
  return JSON.parse(readFileSync(fileURLToPath(url), 'utf8')) as Record<string, unknown>;
}

#!/usr/bin/env node
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { validateManifestJson } from './validate.js';

const HELP = `agent-readiness — validate an Agent Readiness Manifest

Usage:
  agent-readiness validate <file>

Checks that a manifest conforms to the Agent Readiness Manifest JSON Schema
(structure only): required fields present, correct types, recognized keys, and
well-formed pointers.

Options:
  -h, --help       Show this help
  -v, --version    Show version

Exit codes:
  0  manifest is structurally valid
  1  manifest is invalid
  2  usage error (bad arguments or unreadable file)
`;

async function main(argv: string[]): Promise<number> {
  const args = argv.slice(2);

  if (args.length === 0 || args.includes('-h') || args.includes('--help')) {
    process.stdout.write(HELP);
    return 0;
  }
  if (args.includes('-v') || args.includes('--version')) {
    process.stdout.write(`${await readVersion()}\n`);
    return 0;
  }

  const [command, file] = args;
  if (command !== 'validate') {
    process.stderr.write(`Unknown command: ${command}\n\n${HELP}`);
    return 2;
  }
  if (!file) {
    process.stderr.write(
      'validate requires a file path: agent-readiness validate <file>\n',
    );
    return 2;
  }

  let source: string;
  try {
    source = await readFile(file, 'utf8');
  } catch {
    process.stderr.write(`Cannot read file: ${file}\n`);
    return 2;
  }

  const result = validateManifestJson(source);
  if (result.valid) {
    process.stdout.write(`✓ ${file}: valid Agent Readiness Manifest\n`);
    return 0;
  }

  for (const e of result.errors) {
    const loc = e.path === '' ? '(root)' : e.path;
    process.stdout.write(`  ${loc}: ${e.message}\n`);
  }
  process.stdout.write(`✗ ${file}: ${result.errors.length} error(s)\n`);
  return 1;
}

async function readVersion(): Promise<string> {
  try {
    const pkgUrl = new URL('../package.json', import.meta.url);
    const pkg = JSON.parse(await readFile(fileURLToPath(pkgUrl), 'utf8')) as {
      version?: string;
    };
    return pkg.version ?? '0.0.0';
  } catch {
    return '0.0.0';
  }
}

main(process.argv)
  .then((code) => {
    process.exitCode = code;
  })
  .catch((err: unknown) => {
    process.stderr.write(`${err instanceof Error ? err.message : String(err)}\n`);
    process.exitCode = 1;
  });

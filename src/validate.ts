import _Ajv2020, { type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import _addFormats from 'ajv-formats';
import { loadSchema } from './schema.js';

// ajv and ajv-formats are CommonJS: each ships its callable/constructable value
// as `module.exports` while its `.d.ts` also declares named exports, so TS types
// the default import as the module namespace. These casts recover the real
// runtime types (`module.exports === module.exports.default`) without `any`.
const Ajv2020 = _Ajv2020 as unknown as typeof _Ajv2020.default;
const addFormats = _addFormats as unknown as typeof _addFormats.default;

/**
 * A single structural problem found while validating a manifest against the
 * JSON Schema.
 */
export interface ManifestError {
  /** JSON Pointer to the offending location, e.g. `/site/url`. */
  path: string;
  /** Human-readable description of the violation. */
  message: string;
}

/** The outcome of {@link validateManifest}. */
export interface ManifestValidationResult {
  valid: boolean;
  errors: ManifestError[];
}

/**
 * Scope of this validator.
 *
 * This is a STRUCTURAL validator. It checks that a candidate object conforms to
 * the Agent Readiness Manifest JSON Schema: required fields present, correct
 * types, recognized keys, well-formed pointers.
 */

let compiled: ValidateFunction | undefined;

function getValidator(): ValidateFunction {
  if (compiled) return compiled;
  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  compiled = ajv.compile(loadSchema());
  return compiled;
}

/** Validate a parsed manifest object against the schema (structure only). */
export function validateManifest(input: unknown): ManifestValidationResult {
  const validate = getValidator();
  const valid = validate(input) as boolean;
  return {
    valid,
    errors: valid ? [] : (validate.errors ?? []).map(toManifestError),
  };
}

/** Parse a JSON string and validate it. Surfaces JSON syntax errors cleanly. */
export function validateManifestJson(json: string): ManifestValidationResult {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch (err) {
    return {
      valid: false,
      errors: [
        {
          path: '',
          message: `Invalid JSON: ${err instanceof Error ? err.message : String(err)}`,
        },
      ],
    };
  }
  return validateManifest(parsed);
}

function toManifestError(error: ErrorObject): ManifestError {
  const path = error.instancePath === '' ? '' : error.instancePath;
  const detail =
    error.keyword === 'additionalProperties' &&
    typeof error.params['additionalProperty'] === 'string'
      ? `unexpected property "${error.params['additionalProperty']}"`
      : (error.message ?? 'invalid');
  return { path, message: detail };
}

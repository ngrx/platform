# Follow-up Tasks (Technical Debt)

These tasks were identified during the Vitest configuration standardization refactor. These tests are currently being **excluded** to keep the CI green.

## 1. Fix Schematic & Migration Testing Pipeline

- **Issue**: `effects`, `entity`, and `schematics` migration tests fail in Vitest with `Cannot find module` errors.
- **Root Cause**: Angular's `SchematicTestRunner` uses Node's native `require()` to load schematic factories, which expects compiled `.js` files. Vitest runs in memory and doesn't provide these.
- **Goal**: Enable these tests by fixing the path mapping or ensuring a pre-test build step.
- **Affected Folders**:
  - `modules/effects/migrations/**`
  - `modules/entity/migrations/**`
  - `modules/schematics/migrations/**`
  - `modules/eslint-plugin/spec/schematics/**`

## 2. Modernize Type-Test Naming

- **Issue**: Type tests use a mix of `*.types.spec.ts` and `*.test-d.ts`.
- **Goal**: Standardize everything to `.test-d.ts`.
- **Benefit**: Allows removing custom `typecheck.include` patterns and moves closer to Vitest defaults.

## 3. Refactor Deprecated `done()` Callbacks

- **Issue**: Tests in `modules/effects/testing/spec/mock_actions.spec.ts` fail with `Error: done() callback is deprecated`.
- **Goal**: Refactor these to use Promises or `async/await`.

## 4. Performance: Long-Running Type Tests

- **Issue**: Tests like `with-entities.types.spec.ts` are timing out at 8000ms.
- **Goal**: Optimize the snippets or the underlying generics to speed up `tsc` analysis.

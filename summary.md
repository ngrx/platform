This PR upgrades the current test setup to use Vitest and makes it more compatible with the default configuration of Vitest.

## What this PR does

- Introduces a shared Vitest workspace via `/vitest.config.mts` and per-project `vitest.config.mts` files (**14 projects**: 12 `modules/*`, `example-app`, `www`)
- Replaces per-project `vite.config.mts` with `vitest.config.mts` extending shared `baseConfig` via `mergeConfig`
- Enables `pnpm vitest --project <project-name>` and Vitest IDE tooling across the monorepo
- Configures three test modes: runtime, type-only (`.test-d.ts`), and combi (`types/*.spec.ts` with Vitest type-check)
- Drops per-project `pool: 'forks'` and `reporters: ['default']` in favor of Vitest defaults (shared `baseConfig` has neither)
- Streamlines `example-app`: moves `test-setup.ts` to the project root and updates `tsconfig.spec.json` (`files` path, drops `strict: false`)
- Fixes schematic and migration tests (`dist/modules/...` paths, `dependsOn: ["build"]` on module test targets)
- Applies common test fixes: `mock_actions` → `async`/`await`, local `strip-json-comments` for eslint-plugin schematics

The main file is `/vitest.config.mts`. It exposes shared `baseConfig` for most projects and registers all Vitest projects — the repo root is not a project itself. Each project extends `baseConfig` via `mergeConfig`; exceptions are noted below.

## Current state

Runtime tests already run through Vitest; type suites are **not migrated yet**.

- **29** spec files under `types/` — `ts-snippet` (25), `expectTypeOf` (1), custom helpers (2), runtime regression (1)
- Naming is mixed: **16** `*.types.spec.ts`, **13** plain `*.spec.ts`; no `*.test-d.ts` files yet
- `standalone-app` is still on Jest; everything else in scope uses Vitest

The configuration below is the basis for follow-up PRs that migrate those suites to native type-only or combi tests (see [Follow-up tasks](#follow-up-tasks)).

## Projects with customized test config

- `www`: Is our website and doesn't follow the standard config at all.
- `effects` runs with a custom `testTimeout` of 15 seconds.
- `eslint-plugin` runs with a custom `testTimeout` of 8 seconds.

## Folder Structure

With Vitest we have three types of tests:

- Runtime Tests: That is the default one. Those are the ones where we verify via `expect`, etc. Those tests are **not type-safe**. Vitest just removes the types and runs. That makes the tests fast, at the cost of type-safety.
- Type Tests: These kinds of tests are specific type-only tests. We use `expectTypeOf` or `assertType` to verify the types. Vitest only runs the compiler on them, so they are not executed at runtime.
- Combi Tests: Tests with `@ts-expect-error` are not precise enough to count as type tests. Here's an example:

```ts
it('should fail', () => {
  const state = signalState({ foo: 'bar' });

  // @ts-expect-error foo is not a number
  patchState(state, { foo: 1 });
});
```

This is a valid type test, but `@ts-expect-error` doesn't differentiate between a type-only error and a syntax error. For example, the test would also succeed for the following code, which is definitely not intended:

```ts
it('should fail', () => {
  const state = signalState({ foo: 'bar' });

  // @ts-expect-error foo is not a number
  patchStore(state, { foo: 1 });
});
```

---

Therefore, we need to run these tests both as runtime and type tests.

With the new configuration, combi tests need to be located in a subfolder `types`. Files matching `**/*.test-d.ts` run as type-tests only (anywhere in the project), whereas `**/{spec,test}.ts` files under `types/` run as both runtime and type tests.

> **Sidenote:** With `typecheck.enabled: true`, Vitest prints an experimental-feature warning at startup: _"Testing types with tsc and vue-tsc is an experimental feature. Breaking changes might not follow SemVer, please pin Vitest's version when using it."_ This is expected and harmless — type-checking works as intended. Pin the Vitest version in `package.json` until the feature stabilizes.

Here is a visual representation of the folder structure, indicating where each type of test should be placed:

```
project-root/
├── modules/
│   └── mypackage/
│       ├── src/
│       ├── spec/
│       │   ├── foo.spec.ts    # Runtime Test
│       │   ├── bar.test.ts    # Runtime Test
│       │   └── types/
│       │       ├── baz.test-d.ts   # Type Test (only type-checked)
│       │       └── qux.spec.ts     # Combi Test (e.g., uses @ts-expect-error)
```

## Test migration patterns

Patterns applied when enabling schematic, migration, and legacy tests under Vitest.

### Schematic and migration paths: `__dirname` → `dist/`

`SchematicTestRunner` loads factories via Node `require()`, which expects compiled `.js` files. Tests should point at the built output, not source JSON next to `.ts` files.

```ts
// before
const collectionPath = path.join(__dirname, '../migration.json');

// after
const collectionPath = path.join(
  process.cwd(),
  'dist/modules/effects/migrations/migration.json'
);
```

The same applies to schematic collections:

```ts
// before
path.join(__dirname, '../collection.json');

// after
path.join(
  process.cwd(),
  'dist/modules/effects/schematics/collection.json'
);
```

Module `test` targets use `dependsOn: ["build"]` so `dist/` exists before Vitest runs. Project apps (`example-app`, `www`) do not — they have no schematic/migration specs that require a pre-test build.

### Replacing deprecated `done()` callbacks

Vitest 4 deprecates Jasmine-style `done()` in favor of `async`/`await`:

```ts
// before
it('should provide Actions from source', (done) => {
  const actions$ = TestBed.inject(Actions);
  actions$.subscribe((action) => {
    expect(action.type).toBe('foo');
    done();
  });
});

// after
it('should provide Actions from source', async () => {
  const actions$ = TestBed.inject(Actions);
  const action = await firstValueFrom(actions$);
  expect(action.type).toBe('foo');
});
```

### CJS schematic dependencies under Vitest

Schematics compiled to CommonJS cannot `require()` ESM-only packages resolved from the workspace root. For `@ngrx/eslint-plugin`, `strip-json-comments` was replaced with a local helper bundled into the schematic output:

```ts
// before
import stripJsonComments from 'strip-json-comments';

// after
import { stripJsonComments } from '../strip-json-comments';
```

### Slow type-check tests: `testTimeout`

Type tests that run `tsc` via `ts-snippet` can exceed the default timeout. Projects with heavy type suites (e.g. `effects`, `eslint-plugin`) set a higher limit in `vitest.config.mts`:

```ts
// effects
test: {
  name: 'effects',
  setupFiles: ['test-setup.ts'],
  testTimeout: 15000,
},

// eslint-plugin
test: {
  name: 'eslint-plugin',
  setupFiles: ['test-setup.ts'],
  testTimeout: 8000,
},
```

## Follow-up tasks

Outstanding work after this PR (verified June 2026). Planned as separate PRs on top of the configuration introduced here.

### Migrate type suites to native Vitest type tests

**Planned.** Convert the 29 existing `types/` spec files from `ts-snippet` (and related helpers) to native `.test-d.ts` type-only tests or combi tests. Start with smaller packages, then tackle heavy suites (`signals`, `store`, `effects`). Once complete, drop the custom `typecheck.include` pattern (`**/types/**/*.{spec,test}.ts`) in `vitest.config.mts` and standardize on `*.test-d.ts` naming.

### Refactor deprecated `done()` callbacks

**Planned.** `modules/effects/testing/spec/mock_actions.spec.ts` is already on `async`/`await`. Vitest 4 still warns on Jasmine-style `done()` in `data`, `router-store`, `store`, and `store-devtools` (roughly 70 usages across 16 spec files). These should move to Promises or `async`/`await` (see [Replacing deprecated `done()` callbacks](#replacing-deprecated-done-callbacks)).

### Fix source type errors (`ignoreSourceErrors`)

**Planned.** Shared `baseConfig` in `vitest.config.mts` sets `typecheck.ignoreSourceErrors: true` so Vitest type-checking only reports errors in test files, not in library source. Without it, **17 type errors** in source code surface during `pnpm vitest`. Fix those errors and remove `ignoreSourceErrors` from `baseConfig` so type-check runs also guard production code. This does not apply to `www`, which uses its own standalone config and sets `ignoreSourceErrors` separately.

### Performance: long-running type tests

**Partially addressed.** `with-entities.types.spec.ts` and the rest of the `signals` type suite pass with the default timeout. `effects` (15s) and `eslint-plugin` (8s) still use raised `testTimeout` values as a stopgap (see [Slow type-check tests](#slow-type-check-tests-testtimeout)). Optimization may become less urgent as suites migrate off `ts-snippet`.

### Remove legacy test framework artifacts

**Planned.** `jasmine-marbles` remains in a few `modules/` specs (`store`, `operators`, `data`), Jasmine/Jest devDependencies remain in `package.json`, and `projects/standalone-app` is still on Jest/Karma. Migrate or remove where Vitest (or `@analogjs/vitest-angular`) equivalents exist.

### Browser runtime instead of JSDOM

**Future.** Shared config sets `environment: 'jsdom'`. Moving runtime tests to a real browser environment is a larger follow-up for closer DOM fidelity.

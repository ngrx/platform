This PR introduces native Vitest support. Vitest manages packages on its own, with an inheritable configuration.

That means tests can also run via `pnpm vitest --project <project-name>` and all Vitest-based tools, e.g. VSCode Vitest extension, run flawlessly.

The main file is `/vitest.config.mts`. It does two things:

- Exposes a basic config which is used by all projects
- Configures Vitest so that it is aware of the projects. The repo root is NOT a vitest project.

Each project has its own `vitest.config.ts` which extends the root config. Most of the time are the same. Exceptions are explained below.

## Projects with customized test config

- `www`: Is our website and doesn't follow the standard config at all.
- `effect` runs with a custom `testTimeout` of 15 seconds.
- `eslint-plugin` runs with a custom `testTimeout`

## Folder Structure

With Vitest we have three types of tests:

- Runtime Tests: That is the default one. Those are the ones where we verify via `expect`, etc. Those tests are **not type-safe**. Vitest just removes the types and runs. That makes the tests fast, at the cost of type-safety.
- Type Tests: These kind of tests are specific type-only tests, We use `expectTypeOf` or `assertType` to verify the types. Vitest only runs the compiler on them, so they are not executed at runtime.
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

With the new configuration, both type and combi tests need to be located in a subfolder `types`. All files in `types`, matching `**/test-d.ts`, will run as type-tests only, whereas normal `**/{spec,test}.ts` files will run as both runtime and type tests.

Here is a visual representation of the folder structure, indicating where each type of test should be placed:

```
project-root/
├── packages/
│   └── mypackage/
│       ├── src/
│       ├── test/
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

Module `test` targets use `dependsOn: ["build"]` so `dist/` exists before Vitest runs.

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
test: {
  name: 'effects',
  setupFiles: ['test-setup.ts'],
  testTimeout: 15000,
},
```

## Follow-up Tasks

Outstanding work after the Vitest migration (verified June 2026). Status reflects current `main`-branch behavior.

### Modernizing type-test naming

**Still open.** Sixteen type suites use `*.types.spec.ts`; only one file uses `*.test-d.ts` (`modules/signals/spec/types/test.test-d.ts`). Renaming to `.test-d.ts` would allow dropping the custom `typecheck.include` pattern in `vitest.config.mts` (`**/types/**/*.{spec,test}.ts`) and aligning with Vitest defaults.

### Refactoring deprecated `done()` callbacks

**Still open (broader scope).** `modules/effects/testing/spec/mock_actions.spec.ts` is already on `async`/`await`. Vitest 4 still warns on Jasmine-style `done()` in other packages - mainly `data`, `router-store`, `store`, and `store-devtools` (roughly 100 usages across 18 spec files). These should move to Promises or `async`/`await` (see [Replacing deprecated `done()` callbacks](#replacing-deprecated-done-callbacks)).

### Performance: long-running type tests

**Partially addressed.** `with-entities.types.spec.ts` and the rest of the `signals` type suite pass with the default timeout. `effects` (15s) and `eslint-plugin` (8s) still use raised `testTimeout` values as a stopgap (see [Slow type-check tests](#slow-type-check-tests-testtimeout)). Further optimization of heavy type snippets or generics remains worthwhile for those projects.

### Explicit imports

**Low priority / mostly done in `modules/`.** Only two spec files under `modules/` still use default imports (`eslint-plugin` schematic and rule specs). Broader cleanup may still apply under `projects/`.

### Removing legacy test framework artifacts

**Still open.** Vitest modules no longer exclude migration tests, but legacy tooling remains in the workspace: `jasmine-marbles` in a few `modules/` specs (`store`, `operators`, `data`), Jasmine/Jest devDependencies in `package.json`, and `projects/standalone-app` still on Jest/Karma config. These should be migrated or removed where Vitest (or `@analogjs/vitest-angular`) equivalents exist.

### Browser runtime instead of JSDOM

**Still open (future).** Shared config sets `environment: 'jsdom'`. Moving runtime tests to a real browser environment is a larger follow-up for closer DOM fidelity.

### Resolved: schematic and migration test pipeline

**Done.** Migration and schematic specs now point at `dist/modules/...` (see [Schematic and migration paths](#schematic-and-migration-paths-__dirname--dist)), and module `test` targets use `dependsOn: ["build"]`. Verified passing: `effects:test`, `entity:test`, `schematics:test`, `eslint-plugin:test` (including migration/schematic paths). No Vitest-level exclusions remain for these folders.

import * as path from 'path';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';

describe('migrate to props', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const logEntries: string[] = [];
    schematicRunner.logger.subscribe((logEntry) =>
      logEntries.push(logEntry.message)
    );

    const tree = await schematicRunner.runSchematic(
      `19_0_0-rc_0-props`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');

    expect(actual).toBe(output);

    return logEntries;
  };

  it('renames (Named)EntityComputed imports to (Named)EntityProps', async () => {
    const input = tags.stripIndent`
import { EntityComputed, NamedEntityComputed } from '@ngrx/signals/entities';
`;

    const output = tags.stripIndent`
import { EntityProps, NamedEntityProps } from '@ngrx/signals/entities';
`;

    const logEntries = await verifySchematic(input, output);
    expect(logEntries).toEqual([
      "[@ngrx/signals] Renamed '(Named)EntityComputed' to '(Named)EntityProps' in /main.ts",
    ]);
  });

  it('replaces property `computed` in `SignalStoreFeature` to `props`', async () => {
    const input = tags.stripIndent`
import { signalStoreFeature, type } from '@ngrx/signals';
import { Signal } from '@angular/core';

export function withMyFeature() {
  return signalStoreFeature({ computed: type<{ num: Signal<number> }>() });
}
`;

    const output = tags.stripIndent`
import { signalStoreFeature, type } from '@ngrx/signals';
import { Signal } from '@angular/core';

export function withMyFeature() {
  return signalStoreFeature({ props: type<{ num: Signal<number> }>() });
}
`;

    const logEntries = await verifySchematic(input, output);
    expect(logEntries).toEqual([
      "[@ngrx/signals] Renamed 'computed' to 'props' in signalStoreFeature() in /main.ts",
    ]);
  });

  it('replaces property `computed` in `type` with `signalStoreFeature` to `props`', async () => {
    const input = tags.stripIndent`
export function withMyFeature() {
  return signalStoreFeature(
    type<{ computed: { num: Signal<number> } }>()
  );
}
`;

    const output = tags.stripIndent`
export function withMyFeature() {
  return signalStoreFeature(
    type<{ props: { num: Signal<number> } }>()
  );
}
`;

    await verifySchematic(input, output);
  });

  it('replaces `computed` in `SignalStoreFeature` to `props`', async () => {
    const input = tags.stripIndent`
import { SignalStoreFeature } from '@ngrx/signals';
import { Signal } from '@angular/core';

declare function withMyFeature(): SignalStoreFeature<
  { state: {}; computed: { num1: Signal<number> }; methods: {} },
  { state: {}; computed: { num2: Signal<number> }; methods: {} }
>;
`;

    const output = tags.stripIndent`
import { SignalStoreFeature } from '@ngrx/signals';
import { Signal } from '@angular/core';

declare function withMyFeature(): SignalStoreFeature<
  { state: {}; props: { num1: Signal<number> }; methods: {} },
  { state: {}; props: { num2: Signal<number> }; methods: {} }
>;
`;

    const logEntries = await verifySchematic(input, output);
    expect(logEntries).toEqual([
      "[@ngrx/signals] Renamed 'computed' to 'props' in SignalStoreFeature<> in /main.ts",
    ]);
  });

  test('kitchen sink', async () => {
    const input = tags.stripIndent`
import { EntityComputed, NamedEntityComputed } from '@ngrx/signals/entities';
import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs/operators';
import { Signal } from '@angular/core';

declare function withNamedDataService<
  E extends { id: number },
  Collection extends string
>(): SignalStoreFeature<
  EmptyFeatureResult & { computed: NamedEntityComputed<E, Collection> }
>;

declare function withDataService<
  E extends { id: number },
  Collection extends string
>(): SignalStoreFeature<EmptyFeatureResult & { computed: EntityComputed<E> }>;

export function withConsoleLogger() {
  return signalStoreFeature(
    { computed: type<{ pretty: Signal<string> }>() },
    withMethods(() => ({
      log: rxMethod<string>(tap((message) => console.log(message))),
    })),
    withHooks((store) => ({
      onInit() {
        store.log(store.pretty());
      },
    }))
  );
}`;

    const output = tags.stripIndent`
import { EntityProps, NamedEntityProps } from '@ngrx/signals/entities';
import {
  EmptyFeatureResult,
  SignalStoreFeature,
  signalStoreFeature,
  type,
  withHooks,
  withMethods,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { tap } from 'rxjs/operators';
import { Signal } from '@angular/core';

declare function withNamedDataService<
  E extends { id: number },
  Collection extends string
>(): SignalStoreFeature<
  EmptyFeatureResult & { props: NamedEntityProps<E, Collection> }
>;

declare function withDataService<
  E extends { id: number },
  Collection extends string
>(): SignalStoreFeature<EmptyFeatureResult & { props: EntityProps<E> }>;

export function withConsoleLogger() {
  return signalStoreFeature(
    { props: type<{ pretty: Signal<string> }>() },
    withMethods(() => ({
      log: rxMethod<string>(tap((message) => console.log(message))),
    })),
    withHooks((store) => ({
      onInit() {
        store.log(store.pretty());
      },
    }))
  );
}`;

    const logEntries = await verifySchematic(input, output);
    expect(logEntries).toEqual([
      "[@ngrx/signals] Renamed '(Named)EntityComputed' to '(Named)EntityProps' in /main.ts",
      "[@ngrx/signals] Renamed 'computed' to 'props' in SignalStoreFeature<> in /main.ts",
      "[@ngrx/signals] Renamed 'computed' to 'props' in signalStoreFeature() in /main.ts",
    ]);
  });

  it('creates two files with minimal changes and checks both files', async () => {
    const input1 = tags.stripIndent`
import { EntityComputed } from '@ngrx/signals/entities';
`;

    const output1 = tags.stripIndent`
import { EntityProps } from '@ngrx/signals/entities';
`;

    const input2 = tags.stripIndent`
import { NamedEntityComputed } from '@ngrx/signals/entities';
`;

    const output2 = tags.stripIndent`
import { NamedEntityProps } from '@ngrx/signals/entities';
  `;

    appTree.create('file1.ts', input1);
    appTree.create('file2.ts', input2);

    const logEntries: string[] = [];
    schematicRunner.logger.subscribe((logEntry) =>
      logEntries.push(logEntry.message)
    );

    const tree = await schematicRunner.runSchematic(
      `19_0_0-rc_0-props`,
      {},
      appTree
    );

    const actual1 = tree.readContent('file1.ts');
    const actual2 = tree.readContent('file2.ts');

    expect(actual1).toBe(output1);
    expect(actual2).toBe(output2);

    expect(logEntries).toEqual([
      "[@ngrx/signals] Renamed '(Named)EntityComputed' to '(Named)EntityProps' in /file1.ts",
      "[@ngrx/signals] Renamed '(Named)EntityComputed' to '(Named)EntityProps' in /file2.ts",
    ]);
  });
});

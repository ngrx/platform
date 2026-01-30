import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import * as path from 'path';
import { tags } from '@angular-devkit/core';
import { logging } from '@angular-devkit/core';

describe('Store Migration to 21.0.0', () => {
  const collectionPath = path.join(
    process.cwd(),
    'dist/modules/store/migrations/migration.json'
  );
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const logs: logging.LogEntry[] = [];
    schematicRunner.logger.subscribe((e) => logs.push(e));

    const tree = await schematicRunner.runSchematic(
      'ngrx-store-migration-21',
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');
    expect(actual).toBe(output);

    return logs;
  };

  describe('removing SelectorWithProps and MemoizedSelectorWithProps imports', () => {
    it('should remove SelectorWithProps from import', async () => {
      const input = tags.stripIndent`
import { createSelector, SelectorWithProps } from '@ngrx/store';

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;
      const output = tags.stripIndent`
import { createSelector } from '@ngrx/store';

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;

      await verifySchematic(input, output);
    });

    it('should remove MemoizedSelectorWithProps from import', async () => {
      const input = tags.stripIndent`
import { Store, MemoizedSelectorWithProps } from '@ngrx/store';

class MyComponent {
  constructor(private store: Store) {}
}
      `;
      const output = tags.stripIndent`
import { Store } from '@ngrx/store';

class MyComponent {
  constructor(private store: Store) {}
}
      `;

      await verifySchematic(input, output);
    });

    it('should remove both SelectorWithProps and MemoizedSelectorWithProps from import', async () => {
      const input = tags.stripIndent`
import { createSelector, SelectorWithProps, MemoizedSelectorWithProps } from '@ngrx/store';

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;
      const output = tags.stripIndent`
import { createSelector } from '@ngrx/store';

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;

      await verifySchematic(input, output);
    });

    it('should remove entire import if only removed types are imported', async () => {
      const input = tags.stripIndent`
import { SelectorWithProps } from '@ngrx/store';
import { Component } from '@angular/core';
      `;
      const output = tags.stripIndent`
import { Component } from '@angular/core';
      `;

      await verifySchematic(input, output);
    });

    it('should not modify files without removed types', async () => {
      const input = tags.stripIndent`
import { createSelector, Store } from '@ngrx/store';

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;

      await verifySchematic(input, input);
    });

    it('should handle double-quote imports', async () => {
      const input = tags.stripIndent`
import { createSelector, SelectorWithProps } from "@ngrx/store";

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;
      const output = tags.stripIndent`
import { createSelector } from "@ngrx/store";

const selector = createSelector(
  (state: AppState) => state.items,
  (items) => items.length
);
      `;

      await verifySchematic(input, output);
    });
  });

  describe('migrating string-key select calls', () => {
    it('should migrate store.select with a string key', async () => {
      const input = tags.stripIndent`
import { Store } from '@ngrx/store';

class MyComponent {
  data$ = this.store.select('featureName');
  constructor(private store: Store) {}
}
      `;
      const output = tags.stripIndent`
import { Store } from '@ngrx/store';

class MyComponent {
  data$ = this.store.select((state: any) => state['featureName']);
  constructor(private store: Store) {}
}
      `;

      await verifySchematic(input, output);
    });

    it('should migrate select operator with a string key', async () => {
      const input = tags.stripIndent`
import { Store, select } from '@ngrx/store';

class MyComponent {
  data$ = this.store.pipe(select('featureName'));
  constructor(private store: Store) {}
}
      `;
      const output = tags.stripIndent`
import { Store, select } from '@ngrx/store';

class MyComponent {
  data$ = this.store.pipe(select((state: any) => state['featureName']));
  constructor(private store: Store) {}
}
      `;

      await verifySchematic(input, output);
    });

    it('should migrate nested string-key select', async () => {
      const input = tags.stripIndent`
import { Store, select } from '@ngrx/store';

class MyComponent {
  data$ = this.store.pipe(select('feature', 'nested', 'prop'));
  constructor(private store: Store) {}
}
      `;
      const output = tags.stripIndent`
import { Store, select } from '@ngrx/store';

class MyComponent {
  data$ = this.store.pipe(select((state: any) => state['feature']['nested']['prop']));
  constructor(private store: Store) {}
}
      `;

      await verifySchematic(input, output);
    });

    it('should not modify select calls with function selectors', async () => {
      const input = tags.stripIndent`
import { Store, select } from '@ngrx/store';

const selectItems = (state: AppState) => state.items;

class MyComponent {
  data$ = this.store.pipe(select(selectItems));
  constructor(private store: Store) {}
}
      `;

      await verifySchematic(input, input);
    });
  });

  describe('warning about select with props', () => {
    it('should warn about select(selector, props) calls', async () => {
      const input = tags.stripIndent`
import { Store, select } from '@ngrx/store';

class MyComponent {
  data$ = this.store.pipe(select(mySelector, { id: 1 }));
  constructor(private store: Store) {}
}
      `;

      const logs = await verifySchematic(input, input);
      const warnings = logs.filter((l) => l.level === 'warn');
      expect(warnings.length).toBe(1);
      expect(warnings[0].message).toContain('requires manual migration');
    });

    it('should warn about store.select(selector, props) calls', async () => {
      const input = tags.stripIndent`
import { Store } from '@ngrx/store';

class MyComponent {
  data$ = this.store.select(mySelector, { id: 1 });
  constructor(private store: Store) {}
}
      `;

      const logs = await verifySchematic(input, input);
      const warnings = logs.filter((l) => l.level === 'warn');
      expect(warnings.length).toBe(1);
      expect(warnings[0].message).toContain('requires manual migration');
    });
  });

  describe('files without @ngrx/store import', () => {
    it('should not modify files without @ngrx/store import', async () => {
      const input = tags.stripIndent`
import { Component } from '@angular/core';

class MyComponent {
  select(key: string) { return key; }
  data = this.select('featureName');
}
      `;

      await verifySchematic(input, input);
    });
  });
});

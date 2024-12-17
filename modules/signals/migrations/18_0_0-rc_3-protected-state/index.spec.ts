import * as path from 'path';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';

describe('migrate protectedState', () => {
  const collectionPath = path.join(
    process.cwd(),
    'dist/modules/signals/migrations/migration.json'
  );
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const tree = await schematicRunner.runSchematic(
      `18_0_0-rc_3-protected-state`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');

    expect(actual).toBe(output);
  };

  it('should disable the state protection for an existing signalStore', async () => {
    const input = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store = signalStore(withState({id: 1, name: 'Rob'}));
`;

    const output = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store = signalStore({ protectedState: false }, withState({id: 1, name: 'Rob'}));
`;

    await verifySchematic(input, output);
  });

  it('should append it to an existing config', async () => {
    const input = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store = signalStore({ providedIn: 'root' }, withState({id: 1, name: 'Rob'}));
`;

    const output = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store = signalStore({ providedIn: 'root', protectedState: false }, withState({id: 1, name: 'Rob'}));
`;

    await verifySchematic(input, output);
  });

  it('should migrate signalStores without features', async () => {
    const input = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store = signalStore();
`;

    const output = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store = signalStore({ protectedState: false });
`;

    await verifySchematic(input, output);
  });

  it('should also cover a signalStore with multiple lines (with config)', async () => {
    const input = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

export const TalkStore = signalStore(
  { providedIn: 'root' },
  withState(initialValue),
);
`;

    const output = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

export const TalkStore = signalStore(
  { providedIn: 'root', protectedState: false },
  withState(initialValue),
);
`;

    await verifySchematic(input, output);
  });

  it('should also cover a signalStore with multiple lines (without config)', async () => {
    const input = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

export const TalkStore = signalStore(
  withState(initialValue),
  withMethods(() => ({}))
);
`;

    const output = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

export const TalkStore = signalStore(
  { protectedState: false }, withState(initialValue),
  withMethods(() => ({}))
);
`;

    await verifySchematic(input, output);
  });

  it('should do migrations for multiple signalStores', async () => {
    const input = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const initialState = {id: 1, name: 'Rob'};
const store1 = signalStore(withState(initialState));

function createStore() {
  return signalStore(withState(initialState));
}

class PersonStore {
  #store = signalStore(withState(initialState));
}
`;

    const output = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const initialState = {id: 1, name: 'Rob'};
const store1 = signalStore({ protectedState: false }, withState(initialState));

function createStore() {
  return signalStore({ protectedState: false }, withState(initialState));
}

class PersonStore {
  #store = signalStore({ protectedState: false }, withState(initialState));
}
`;

    await verifySchematic(input, output);
  });

  it('should ensure files are running isolated', async () => {
    const inputMain1 = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store1 = signalStore(withState(initialState));
    `;

    const inputMain2 = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

class PersonStore {
  #store = signalStore(withState(initialState));
}
    `;

    const outputMain1 = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

const store1 = signalStore({ protectedState: false }, withState(initialState));
    `;

    const outputMain2 = tags.stripIndent`
import { signalStore } from '@ngrx/signals';

class PersonStore {
  #store = signalStore({ protectedState: false }, withState(initialState));
}
    `;

    appTree.create('main1.ts', inputMain1);
    appTree.create('main2.ts', inputMain2);

    const tree = await schematicRunner.runSchematic(
      `18_0_0-rc_3-protected-state`,
      {},
      appTree
    );

    expect(tree.readContent('main1.ts')).toBe(outputMain1);
    expect(tree.readContent('main2.ts')).toBe(outputMain2);
  });

  it('should be able to process import aliases', async () => {
    const input = tags.stripIndent`
import { of } from 'rxjs';
import { withState, withMethods, signalStore as createStoreClass } from '@ngrx/signals';
import { Injectable } from '@angular/common';

const store = createStoreClass(withState({id: 1, name: 'Rob'}));
`;

    const output = tags.stripIndent`
import { of } from 'rxjs';
import { withState, withMethods, signalStore as createStoreClass } from '@ngrx/signals';
import { Injectable } from '@angular/common';

const store = createStoreClass({ protectedState: false }, withState({id: 1, name: 'Rob'}));
`;

    await verifySchematic(input, output);
  });
});

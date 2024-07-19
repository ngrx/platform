import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';
import * as path from 'path';
import { LogEntry } from '@angular-devkit/core/src/logger';

describe('18_0_0-beta-replace-statesignal-with-writablestatesource', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (
    input: string,
    output: string
  ): Promise<LogEntry[]> => {
    appTree.create('main.ts', input);

    const logEntries: LogEntry[] = [];
    schematicRunner.logger.subscribe((logEntry) => logEntries.push(logEntry));

    const tree = await schematicRunner.runSchematic(
      `18_0_0-beta-replace-statesignal-with-writablestatesource`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');
    expect(actual).toBe(output);

    return logEntries;
  };

  it('replaces StateSignal references to WritableStateSource', async () => {
    const input = tags.stripIndent`
import { StateSignal, patchState } from '@ngrx/signals';

function updateCount(state: StateSignal<{ count: number }>, count: number): void {
  patchState(state, { count });
}

function updateCount2(state: StateSignal<{ count: number }>, count: number): void {
  patchState(state, { count });
}`;
    const output = tags.stripIndent`
import { WritableStateSource, patchState } from '@ngrx/signals';

function updateCount(state: WritableStateSource<{ count: number }>, count: number): void {
  patchState(state, { count });
}

function updateCount2(state: WritableStateSource<{ count: number }>, count: number): void {
  patchState(state, { count });
}`;

    const logEntries = await verifySchematic(input, output);

    expect(logEntries).toHaveLength(2);
    expect(logEntries[0]).toMatchObject({
      message: `[@ngrx/signals] Migrating 'StateSignal' to 'WritableStateSource'`,
      level: 'info',
    });
    expect(logEntries[1]).toMatchObject({
      message: `[@ngrx/signals] Updated 2 references from 'StateSignal' to 'WritableStateSource'`,
      level: 'info',
    });
  });

  it('does nothing if StateSignal is imported from other package', async () => {
    const input = tags.stripIndent`
import { StateSignal, patchState } from '@awesome-lib';

function updateCount(state: StateSignal<{ count: number }>, count: number): void {
  patchState(state, { count });
}`;

    const logEntries = await verifySchematic(input, input);

    expect(logEntries).toHaveLength(2);
    expect(logEntries[0]).toMatchObject({
      message: `[@ngrx/signals] Migrating 'StateSignal' to 'WritableStateSource'`,
      level: 'info',
    });
    expect(logEntries[1]).toMatchObject({
      message: `[@ngrx/signals] No 'StateSignal' refences found to, skipping the migration`,
      level: 'info',
    });
  });
});

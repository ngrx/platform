import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags, logging } from '@angular-devkit/core';
import * as path from 'path';

describe('21_0_0-beta_0-rename-withEffects-to-withEventHandlers', () => {
  const collectionPath = path.join(
    process.cwd(),
    'dist/modules/signals/migrations/migration.json'
  );
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verify = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const logs: logging.LogEntry[] = [];
    schematicRunner.logger.subscribe((e) => logs.push(e));

    const tree = await schematicRunner.runSchematic(
      `21_0_0-beta_0-rename-withEffects-to-withEventHandlers`,
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');
    expect(actual).toBe(output);

    return logs;
  };

  it('renames named import', async () => {
    const input = tags.stripIndent`
      import { withEffects } from '@ngrx/signals/events';
      const S = signalStore(withEffects(() => {}));
    `;

    const output = tags.stripIndent`
      import { withEventHandlers } from '@ngrx/signals/events';
      const S = signalStore(withEventHandlers(() => {}));
    `;

    const logs = await verify(input, output);
    expect(logs[0].message).toContain(
      "Renamed 'withEffects' to 'withEventHandlers'"
    );
  });

  it('preserves alias', async () => {
    const input = tags.stripIndent`
      import { withEffects as withAlias } from '@ngrx/signals/events';
      const S = signalStore(withAlias(() => {}));
    `;

    const output = tags.stripIndent`
      import { withEventHandlers as withAlias } from '@ngrx/signals/events';
      const S = signalStore(withAlias(() => {}));
    `;

    await verify(input, output);
  });

  it('renames namespace usage', async () => {
    const input = tags.stripIndent`
      import * as events from '@ngrx/signals/events';
      const S = signalStore(events.withEffects(() => {}));
    `;

    const output = tags.stripIndent`
      import * as events from '@ngrx/signals/events';
      const S = signalStore(events.withEventHandlers(() => {}));
    `;

    await verify(input, output);
  });

  it('ignores other packages', async () => {
    const input = tags.stripIndent`
      import { withEffects } from 'other';
      const S = withEffects(() => {});
    `;

    await verify(input, input);
  });

  it('handles multiple imports and usages', async () => {
    const input = tags.stripIndent`
    import { withEffects, event } from '@ngrx/signals/events';
    const S1 = signalStore(withEffects(() => {}));
    const S2 = signalStore(withEffects(() => {}));
  `;

    const output = tags.stripIndent`
    import { withEventHandlers, event } from '@ngrx/signals/events';
    const S1 = signalStore(withEventHandlers(() => {}));
    const S2 = signalStore(withEventHandlers(() => {}));
  `;

    await verify(input, output);
  });
});

import { logging, tags } from '@angular-devkit/core';
import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

describe('22_0_0-beta_0-rename-eslint-plugin-v9-imports', () => {
  const collectionPath = path.join(
    process.cwd(),
    'dist/modules/eslint-plugin/migrations/migration.json'
  );
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/eslint-plugin',
    collectionPath
  );

  let tree: UnitTestTree;

  beforeEach(() => {
    tree = new UnitTestTree(new HostTree());
  });

  it('renames ESM imports', async () => {
    tree.create(
      'eslint.config.mjs',
      tags.stripIndent`
        import ngrx from '@ngrx/eslint-plugin/v9';
        export default [
          ...ngrx.configs.all,
        ];
      `
    );

    await schematicRunner.runSchematic(
      '22_0_0-beta_0-rename-eslint-plugin-v9-imports',
      {},
      tree
    );

    expect(tree.readText('eslint.config.mjs')).toBe(tags.stripIndent`
      import ngrx from '@ngrx/eslint-plugin';
      export default [
        ...ngrx.configs.all,
      ];
    `);
  });

  it('renames CommonJS requires', async () => {
    tree.create(
      'eslint.config.cjs',
      tags.stripIndent`
        const ngrx = require('@ngrx/eslint-plugin/v9');
        module.exports = [
          ...ngrx.configs.store,
        ];
      `
    );

    await schematicRunner.runSchematic(
      '22_0_0-beta_0-rename-eslint-plugin-v9-imports',
      {},
      tree
    );

    expect(tree.readText('eslint.config.cjs')).toBe(tags.stripIndent`
      const ngrx = require('@ngrx/eslint-plugin');
      module.exports = [
        ...ngrx.configs.store,
      ];
    `);
  });

  it('renames TypeScript exports', async () => {
    tree.create(
      'src/config.ts',
      `export { configs } from '@ngrx/eslint-plugin/v9';\n`
    );

    await schematicRunner.runSchematic(
      '22_0_0-beta_0-rename-eslint-plugin-v9-imports',
      {},
      tree
    );

    expect(tree.readText('src/config.ts')).toBe(
      `export { configs } from '@ngrx/eslint-plugin';\n`
    );
  });

  it('ignores unsupported file extensions', async () => {
    const content = `Use @ngrx/eslint-plugin/v9 here.\n`;
    tree.create('README.md', content);

    await schematicRunner.runSchematic(
      '22_0_0-beta_0-rename-eslint-plugin-v9-imports',
      {},
      tree
    );

    expect(tree.readText('README.md')).toBe(content);
  });

  it('ignores node_modules', async () => {
    const content = `import ngrx from '@ngrx/eslint-plugin/v9';\n`;
    tree.create('node_modules/pkg/index.js', content);

    await schematicRunner.runSchematic(
      '22_0_0-beta_0-rename-eslint-plugin-v9-imports',
      {},
      tree
    );

    expect(tree.readText('node_modules/pkg/index.js')).toBe(content);
  });

  it('logs updated files', async () => {
    const logs: logging.LogEntry[] = [];
    schematicRunner.logger.subscribe((entry) => logs.push(entry));
    tree.create(
      'eslint.config.js',
      `import ngrx from '@ngrx/eslint-plugin/v9';`
    );

    await schematicRunner.runSchematic(
      '22_0_0-beta_0-rename-eslint-plugin-v9-imports',
      {},
      tree
    );

    expect(logs[0].message).toContain(
      "Renamed '@ngrx/eslint-plugin/v9' to '@ngrx/eslint-plugin'"
    );
  });
});

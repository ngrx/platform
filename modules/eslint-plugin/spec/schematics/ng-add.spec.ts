import { HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const schematicRunner = new SchematicTestRunner(
  '@ngrx/eslint-plugin',
  path.join(
    process.cwd(),
    'dist/modules/eslint-plugin/schematics/collection.json'
  )
);

describe('addNgRxESLintPlugin for ESLint >= 9 (flat config)', () => {
  let host: UnitTestTree;

  beforeEach(() => {
    host = new UnitTestTree(new HostTree());
  });

  it('does not register the plugin in an eslintrc config', async () => {
    const initialConfig = {};
    const initialContent = JSON.stringify(initialConfig, null, 2);
    host.create('.eslintrc.json', initialContent);

    await schematicRunner.runSchematic('ng-add', {}, host);

    expect(host.readText('.eslintrc.json')).toBe(initialContent);
  });

  it('registers the plugin with CommonJS', async () => {
    host.create(
      'eslint.config.js',
      `
// @ts-check
const tseslint = require('typescript-eslint');
module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
    ]
  }
);`
    );

    await schematicRunner.runSchematic('ng-add', { config: 'store' }, host);
    // verify it does not register the plugin twice
    await schematicRunner.runSchematic('ng-add', { config: 'store' }, host);

    const content = host.readText('eslint.config.js');
    expect(content).toContain(`@ngrx/eslint-plugin`);
    expect(content).toMatchInlineSnapshot(`
      "
      // @ts-check
      const tseslint = require('typescript-eslint');
      const ngrx = require('@ngrx/eslint-plugin');
      module.exports = tseslint.config(
        {
          files: ['**/*.ts'],
          extends: [
            ...tseslint.configs.recommended,
          ]
        },
        {
          files: ['**/*.ts'],
          extends: [
            ...ngrx.configs.store,
          ],
          rules: {},
        }
      );"
    `);
  });

  it('registers the plugin with ESM', async () => {
    host.create(
      'eslint.config.mjs',
      `
// @ts-check
import tseslint from 'typescript-eslint';
export default tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      ...tseslint.configs.recommended,
    ],
  },
);`
    );

    await schematicRunner.runSchematic('ng-add', { config: 'effects' }, host);
    // verify it does not register the plugin twice
    await schematicRunner.runSchematic('ng-add', { config: 'effects' }, host);

    const content = host.readText('eslint.config.mjs');
    expect(content).toContain(`@ngrx/eslint-plugin`);
    expect(content).toMatchInlineSnapshot(`
      "
      // @ts-check
      import tseslint from 'typescript-eslint';
      import ngrx from '@ngrx/eslint-plugin';
      export default tseslint.config(
        {
          files: ['**/*.ts'],
          extends: [
            ...tseslint.configs.recommended,
          ],
        },
        {
          files: ['**/*.ts'],
          extends: [
            ...ngrx.configs.effects,
          ],
          rules: {},
        },
      );"
    `);
  });

  it('registers the plugin when there are no existing plugins', async () => {
    host.create('eslint.config.cjs', `module.exports = tseslint.config();`);

    await schematicRunner.runSchematic('ng-add', { config: 'all' }, host);

    const content = host.readText('eslint.config.cjs');
    expect(content).toContain(`@ngrx/eslint-plugin`);
    expect(content).toMatchInlineSnapshot(`
      "
      const ngrx = require('@ngrx/eslint-plugin');module.exports = tseslint.config(
        {
          files: ['**/*.ts'],
          extends: [
            ...ngrx.configs.all,
          ],
          rules: {},
        }
      );"
    `);
  });

  it('does not register the plugin if tseslint is missing', async () => {
    const originalContent = `
        import somePlugin from 'some-plugin';
        export default [];
        `;
    host.create('eslint.config.js', originalContent);

    await schematicRunner.runSchematic('ng-add', { config: 'all' }, host);

    const content = host.readText('eslint.config.js');
    expect(content).toBe(originalContent);
  });
});

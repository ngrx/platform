import { Tree, HostTree } from '@angular-devkit/schematics';
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

describe('addNgRxESLintPlugin for ESLint < v9 (JSON)', () => {
  test('registers the plugin with the all config', async () => {
    const appTree = new UnitTestTree(Tree.empty());

    const initialConfig = {};
    appTree.create('./.eslintrc.json', JSON.stringify(initialConfig, null, 2));

    await schematicRunner.runSchematic('ng-add', {}, appTree);

    const eslintContent = appTree.readContent(`.eslintrc.json`);
    const eslintJson = JSON.parse(eslintContent);
    expect(eslintJson).toEqual({
      overrides: [{ files: ['*.ts'], extends: [`plugin:@ngrx/all`] }],
    });
  });

  test('registers the plugin with a different config', async () => {
    const appTree = new UnitTestTree(Tree.empty());

    const initialConfig = {};
    appTree.create('./.eslintrc.json', JSON.stringify(initialConfig, null, 2));

    const options = { config: 'store' };
    await schematicRunner.runSchematic('ng-add', options, appTree);

    const eslintContent = appTree.readContent(`.eslintrc.json`);
    const eslintJson = JSON.parse(eslintContent);
    expect(eslintJson).toEqual({
      overrides: [
        {
          files: ['*.ts'],
          extends: [`plugin:@ngrx/${options.config}`],
        },
      ],
    });
  });

  test('registers the plugin in overrides when it supports TS', async () => {
    const appTree = new UnitTestTree(Tree.empty());

    const initialConfig = {
      overrides: [
        {
          files: ['*.ts'],
          parserOptions: {
            project: ['tsconfig.eslint.json'],
            createDefaultProgram: true,
          },
          extends: [
            'plugin:@angular-eslint/recommended',
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:@angular-eslint/template/process-inline-templates',
            'plugin:prettier/recommended',
          ],
        },
        {
          files: ['*.html'],
          extends: [
            'plugin:@angular-eslint/template/recommended',
            'plugin:prettier/recommended',
          ],
          rules: {},
        },
      ],
    };
    appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2));

    await schematicRunner.runSchematic('ng-add', {}, appTree);

    const eslintContent = appTree.readContent(`.eslintrc.json`);
    const eslintJson = JSON.parse(eslintContent);
    expect(eslintJson).toEqual({
      overrides: [
        {
          files: ['*.ts'],
          parserOptions: {
            project: ['tsconfig.eslint.json'],
            createDefaultProgram: true,
          },
          extends: [
            'plugin:@angular-eslint/recommended',
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:@typescript-eslint/recommended-requiring-type-checking',
            'plugin:@angular-eslint/template/process-inline-templates',
            'plugin:prettier/recommended',
          ],
        },
        {
          files: ['*.html'],
          extends: [
            'plugin:@angular-eslint/template/recommended',
            'plugin:prettier/recommended',
          ],
          rules: {},
        },
        {
          files: ['*.ts'],
          extends: [`plugin:@ngrx/all`],
        },
      ],
    });
  });

  test('does not add the plugin if it is already added manually', async () => {
    const appTree = new UnitTestTree(Tree.empty());

    const initialConfig = {
      extends: ['plugin:@ngrx/all'],
    };
    appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2));

    await schematicRunner.runSchematic('ng-add', {}, appTree);

    const eslintContent = appTree.readContent(`.eslintrc.json`);
    const eslintJson = JSON.parse(eslintContent);
    expect(eslintJson).toEqual(initialConfig);
  });

  test('does not add the plugin if it is already added manually as an override', async () => {
    const appTree = new UnitTestTree(Tree.empty());

    const initialConfig = {
      overrides: [
        {
          extends: ['plugin:@ngrx/all'],
        },
      ],
    };
    appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2));

    await schematicRunner.runSchematic('ng-add', {}, appTree);

    const eslintContent = appTree.readContent(`.eslintrc.json`);
    const eslintJson = JSON.parse(eslintContent);
    expect(eslintJson).toEqual(initialConfig);
  });
});

describe('addNgRxESLintPlugin for ESLint >= 9 (flat config)', () => {
  let host: UnitTestTree;

  beforeEach(() => {
    host = new UnitTestTree(new HostTree());
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
      const ngrx = require('@ngrx/eslint-plugin/v9');
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
      import ngrx from '@ngrx/eslint-plugin/v9';
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
      const ngrx = require('@ngrx/eslint-plugin/v9');module.exports = tseslint.config(
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

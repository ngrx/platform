import { Tree, HostTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const schematicRunner = new SchematicTestRunner(
  '@ngrx/eslint-plugin',
  path.join(__dirname, '../../schematics/collection.json')
);

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

describe('addNgRxESLintPlugin (flat config)', () => {
  const flatSchematicRunner = new SchematicTestRunner(
    '@ngrx/eslint-plugin',
    path.join(__dirname, '../../schematics/collection.json')
  );
  let host: UnitTestTree;

  beforeEach(() => {
    host = new UnitTestTree(new HostTree());
  });

  it('should add NgRx plugin to flat ESLint config', async () => {
    host.create('eslint.config.js', `
      import somePlugin from 'some-plugin';
      export default [];
    `);

    await flatSchematicRunner.runSchematic('add-ngrx-eslint-plugin', { config: 'recommended' }, host);

    const content = host.readText('eslint.config.js');
    expect(content).toContain("import ngrxEslintPlugin from '@ngrx/eslint-plugin';");
    expect(content).toContain("extends: [`plugin:@ngrx/recommended`]");
  });

  it('should not add duplicate NgRx plugin entries in flat config', async () => {
    host.create('eslint.config.js', `
      import ngrxEslintPlugin from '@ngrx/eslint-plugin';
      export default [{
        files: ['*.ts'],
        extends: ['plugin:@ngrx/recommended']
      }];
    `);

    await flatSchematicRunner.runSchematic('add-ngrx-eslint-plugin', { config: 'recommended' }, host);

    const content = host.readText('eslint.config.js');
    const ngrxConfigCount = (content.match(/plugin:@ngrx\/recommended/g) || []).length;
    expect(ngrxConfigCount).toBe(1);
  });

  it('should prioritize flat config over JSON config', async () => {
    // Create both config files
    host.create('eslint.config.js', 'export default [];');
    host.create('.eslintrc.json', JSON.stringify({}));

    await flatSchematicRunner.runSchematic('add-ngrx-eslint-plugin', { config: 'recommended' }, host);

    // Verify flat config was modified
    const flatConfig = host.readText('eslint.config.js');
    expect(flatConfig).toContain('@ngrx/eslint-plugin');

    // Verify JSON config was NOT modified
    const jsonConfig = host.readText('.eslintrc.json');
    expect(jsonConfig).not.toContain('@ngrx/eslint-plugin');
  });

  it('should modify JSON config when flat config is missing', async () => {
    host.create('.eslintrc.json', JSON.stringify({
      overrides: []
    }));

    await flatSchematicRunner.runSchematic('add-ngrx-eslint-plugin', { config: 'recommended' }, host);

    const content = JSON.parse(host.readText('.eslintrc.json'));
    expect(content.overrides).toContain(jasmine.objectContaining({
      extends: ['plugin:@ngrx/recommended']
    }));
  });
});

import { Tree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const schematicRunner = new SchematicTestRunner(
  '@ngrx/eslint-plugin',
  path.join(__dirname, '../../schematics/collection.json')
);

test('registers the plugin with the recommended config', async () => {
  const appTree = new UnitTestTree(Tree.empty());

  const initialConfig = {};
  appTree.create('./.eslintrc.json', JSON.stringify(initialConfig, null, 2));

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise();

  const eslintContent = appTree.readContent(`.eslintrc.json`);
  const eslintJson = JSON.parse(eslintContent);
  expect(eslintJson).toEqual({
    overrides: [{ files: ['*.ts'], extends: [`plugin:@ngrx/recommended`] }],
  });
});

test('registers the plugin with a different config', async () => {
  const appTree = new UnitTestTree(Tree.empty());

  const initialConfig = {};
  appTree.create('./.eslintrc.json', JSON.stringify(initialConfig, null, 2));

  const options = { config: 'strict' };
  await schematicRunner
    .runSchematicAsync('ng-add', options, appTree)
    .toPromise();

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

  // this is a trimmed down version of the default angular-eslint schematic
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

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise();

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
        extends: [`plugin:@ngrx/recommended`],
      },
    ],
  });
});

test('does not add the plugin if it is already added manually', async () => {
  const appTree = new UnitTestTree(Tree.empty());

  const initialConfig = {
    extends: ['plugin:@ngrx/recommended'],
  };
  appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2));

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise();

  const eslintContent = appTree.readContent(`.eslintrc.json`);
  const eslintJson = JSON.parse(eslintContent);
  expect(eslintJson).toEqual(initialConfig);
});

test('does not add the plugin if it is already added manually as an override', async () => {
  const appTree = new UnitTestTree(Tree.empty());

  const initialConfig = {
    overrides: [
      {
        extends: ['plugin:@ngrx/recommended'],
      },
    ],
  };
  appTree.create('.eslintrc.json', JSON.stringify(initialConfig, null, 2));

  await schematicRunner.runSchematicAsync('ng-add', {}, appTree).toPromise();

  const eslintContent = appTree.readContent(`.eslintrc.json`);
  const eslintJson = JSON.parse(eslintContent);
  expect(eslintJson).toEqual(initialConfig);
});

import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';

export const defaultWorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0',
};

export const defaultAppOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  viewEncapsulation: 'Emulated',
  routing: false,
  style: 'css',
  skipTests: false,
};

const defaultLibOptions = {
  name: 'baz',
};

export function getTestProjectPath(
  workspaceOptions: any = defaultWorkspaceOptions,
  appOptions: any = defaultAppOptions
) {
  return `/${workspaceOptions.newProjectRoot}/${appOptions.name}`;
}

export async function createWorkspace(
  schematicRunner: SchematicTestRunner,
  appTree: UnitTestTree,
  workspaceOptions = defaultWorkspaceOptions,
  appOptions = defaultAppOptions,
  libOptions = defaultLibOptions
) {
  appTree = await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'workspace',
      workspaceOptions
    )
    .toPromise();

  appTree = await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'application',
      appOptions,
      appTree
    )
    .toPromise();

  appTree = await schematicRunner
    .runExternalSchematicAsync(
      '@schematics/angular',
      'library',
      libOptions,
      appTree
    )
    .toPromise();

  return appTree;
}

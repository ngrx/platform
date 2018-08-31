import {
  UnitTestTree,
  SchematicTestRunner,
} from '@angular-devkit/schematics/testing';

const defaultWorkspaceOptions = {
  name: 'workspace',
  newProjectRoot: 'projects',
  version: '6.0.0',
};

const defaultAppOptions = {
  name: 'bar',
  inlineStyle: false,
  inlineTemplate: false,
  viewEncapsulation: 'Emulated',
  routing: false,
  style: 'css',
  skipTests: false,
};

const defaultModuleOptions = {
  name: 'foo',
  spec: true,
  module: undefined,
  flat: false,
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

export function createWorkspace(
  schematicRunner: SchematicTestRunner,
  appTree: UnitTestTree,
  workspaceOptions = defaultWorkspaceOptions,
  appOptions = defaultAppOptions,
  libOptions = defaultLibOptions
) {
  appTree = schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'workspace',
    workspaceOptions
  );
  appTree = schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'application',
    appOptions,
    appTree
  );
  appTree = schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'library',
    libOptions,
    appTree
  );

  return appTree;
}

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
  standalone: false,
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
  appTree = await schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'workspace',
    workspaceOptions
  );

  appTree = await schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'application',
    { ...appOptions, standalone: false },
    appTree
  );

  appTree = await schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'application',
    { ...appOptions, name: 'bar-standalone', standalone: true },
    appTree
  );

  appTree = await schematicRunner.runExternalSchematic(
    '@schematics/angular',
    'library',
    libOptions,
    appTree
  );

  return appTree;
}

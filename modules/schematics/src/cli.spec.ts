import { Tree, VirtualTree } from '@angular-devkit/schematics';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {
  createWorkspace,
  getProjectPath,
} from './utility/test/create-workspace';

describe('CLI Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );

  const defaultOptions = {
    name: 'foo',
    project: 'bar',
  };

  const projectPath = getProjectPath();

  let appTree: UnitTestTree;

  beforeEach(() => {
    appTree = createWorkspace(schematicRunner, appTree);
  });

  it('should create a class by the angular/cli', () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = schematicRunner.runSchematic('class', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/foo.ts`);

    expect(content).toMatch(/export class Foo/);
  });
});

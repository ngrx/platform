import { Tree, VirtualTree } from '@angular-devkit/schematics';
import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createAppModule, getFileContent } from './utils';

describe('CLI Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions = {
    name: 'foo',
  };

  let appTree: Tree;

  beforeEach(() => {
    appTree = new VirtualTree();
    appTree = createAppModule(appTree);
  });

  it('should create a class by the angular/cli', () => {
    const options = { ...defaultOptions, state: undefined };
    const tree = schematicRunner.runSchematic('class', options, appTree);
    const content = getFileContent(tree, '/src/app/foo.ts');
    expect(content).toMatch(/export class Foo/);
  });
});

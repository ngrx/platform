import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { ActionOptions } from '../src/action';

describe('Action Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: ActionOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    spec: false,
    group: false,
    flat: true,
  };

  it('should create one file', () => {
    const tree = schematicRunner.runSchematic('action', defaultOptions);
    expect(tree.files.length).toEqual(1);
    expect(tree.files[0]).toEqual('/src/app/foo.actions.ts');
  });

  it('should create two files if spec is true', () => {
    const options = {
      ...defaultOptions,
      spec: true,
    };
    const tree = schematicRunner.runSchematic('action', options);
    expect(tree.files.length).toEqual(2);
    expect(
      tree.files.indexOf('/src/app/foo.actions.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      tree.files.indexOf('/src/app/foo.actions.ts')
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an enum named "Foo"', () => {
    const tree = schematicRunner.runSchematic('action', defaultOptions);
    const fileEntry = tree.get(tree.files[0]);
    if (fileEntry) {
      const fileContent = fileEntry.content.toString();
      expect(fileContent).toMatch(/export enum FooActionTypes/);
    }
  });

  it('should group within an "actions" folder if group is set', () => {
    const tree = schematicRunner.runSchematic('action', {
      ...defaultOptions,
      group: true,
    });
    expect(tree.files.length).toEqual(1);
    expect(tree.files[0]).toEqual('/src/app/actions/foo.actions.ts');
  });
});

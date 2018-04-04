import { SchematicTestRunner } from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { FeatureOptions } from '../src/feature';

describe('Feature Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: FeatureOptions = {
    name: 'foo',
    path: 'app',
    sourceDir: 'src',
    module: '',
    spec: true,
    group: false,
  };

  it('should create all files of a feature', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('feature', options);
    const files = tree.files;
    expect(files.indexOf('/src/app/foo.actions.ts')).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo.reducer.ts')).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(files.indexOf('/src/app/foo.effects.ts')).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/foo.effects.spec.ts')
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create all files of a feature within grouped folders if group is set', () => {
    const options = { ...defaultOptions, group: true };

    const tree = schematicRunner.runSchematic('feature', options);
    const files = tree.files;
    expect(
      files.indexOf('/src/app/actions/foo.actions.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/reducers/foo.reducer.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/reducers/foo.reducer.spec.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/effects/foo.effects.ts')
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf('/src/app/effects/foo.effects.spec.ts')
    ).toBeGreaterThanOrEqual(0);
  });
});

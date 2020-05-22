import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { getFileContent } from '@schematics/angular/utility/test';
import * as path from 'path';
import { Schema as RootEffectOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  createAppModuleWithEffects,
} from '../../../schematics-core/testing';

describe('Effects ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/effects',
    path.join(__dirname, '../collection.json')
  );

  const defaultOptions: RootEffectOptions = {
    name: 'foo',
    skipPackageJson: false,
    project: 'bar',
    module: 'app',
    flat: false,
    group: false,
    minimal: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/effects']).toBeDefined();
  });

  it('should skip package.json update', () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/effects']).toBeUndefined();
  });

  it('should create an effect', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not create an effect if the minimal flag is provided', () => {
    const options = { ...defaultOptions, minimal: true };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[\]\)/);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toBe(-1);
    expect(files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)).toBe(-1);
  });

  it('should not import an effect into a specified module in the minimal flag is provided', () => {
    const options = {
      ...defaultOptions,
      minimal: true,
      module: 'app.module.ts',
    };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).not.toMatch(
      /import { FooEffects } from '.\/foo\/foo.effects'/
    );
  });

  it('should be provided by default', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import { FooEffects } from '.\/foo\/foo.effects'/);
  });

  it('should import into a specified module', () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import { FooEffects } from '.\/foo\/foo.effects'/);
  });

  it('should fail if specified module does not exist', () => {
    const options = {
      ...defaultOptions,
      module: `${projectPath}/src/app/app.moduleXXX.ts`,
    };
    let thrownError: Error | null = null;
    try {
      schematicRunner.runSchematic('effects', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should respect the skipTest flag', () => {
    const options = { ...defaultOptions, skipTest: true };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toEqual(-1);
  });

  it('should register the root effect in the provided module', () => {
    const options = { ...defaultOptions };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should add an effect to the empty array of registered effects', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = {
      ...defaultOptions,
      module: 'store.module.ts',
    };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([])'
    );

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should add an effect to the existing registered root effects', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = {
      ...defaultOptions,
      module: 'store.module.ts',
    };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([UserEffects])'
    );

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).toMatch(
      /EffectsModule\.forRoot\(\[UserEffects, FooEffects\]\)/
    );
  });

  it('should not add an effect to registered effects defined with a variable', () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot(effects)'
    );

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const content = tree.readContent(storeModule);

    expect(content).not.toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should group within an "effects" folder if group is set', () => {
    const options = {
      ...defaultOptions,
      flat: true,
      skipTest: true,
      group: true,
    };

    const tree = schematicRunner.runSchematic('ng-add', options, appTree);
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should inject the effect service correctly', async () => {
    const options = { ...defaultOptions, skipTest: false };
    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.spec.ts`
    );

    expect(content).toMatch(/effects = TestBed\.inject\(FooEffects\);/);
  });
});

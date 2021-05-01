import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as EffectOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
  createAppModuleWithEffects,
  defaultWorkspaceOptions,
  defaultAppOptions,
} from '@ngrx/schematics-core/testing';

describe('Effect Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  const defaultOptions: EffectOptions = {
    name: 'foo',
    project: 'bar',
    module: undefined,
    flat: false,
    feature: false,
    root: false,
    group: false,
    creators: false,
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create an effect to specified project if provided', async () => {
    const options = {
      ...defaultOptions,
      project: 'baz',
    };

    const specifiedProjectPath = getTestProjectPath(defaultWorkspaceOptions, {
      ...defaultAppOptions,
      name: 'baz',
    });

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${specifiedProjectPath}/src/lib/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should create an effect with a spec file', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should not be provided by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).not.toMatch(
      /import { FooEffects } from '.\/foo\/foo.effects'/
    );
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(/import { FooEffects } from '.\/foo\/foo.effects'/);
  });

  it('should fail if specified module does not exist', async () => {
    const options = {
      ...defaultOptions,
      module: `${projectPath}/src/app/app.moduleXXX.ts`,
    };
    let thrownError: Error | null = null;
    try {
      await schematicRunner.runSchematicAsync('effects', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });

  it('should respect the skipTests flag', async () => {
    const options = { ...defaultOptions, skipTests: true };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
    expect(
      files.indexOf(`${projectPath}/src/app/foo/foo.effects.spec.ts`)
    ).toEqual(-1);
  });

  it('should register the root effect in the provided module', async () => {
    const options = { ...defaultOptions, root: true, module: 'app.module.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should register the root effect module without effect with the minimal flag', async () => {
    const options = {
      ...defaultOptions,
      root: true,
      name: undefined,
      module: 'app.module.ts',
      minimal: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[\]\)/);
    expect(content).not.toMatch(/FooEffects/);
  });

  it('should still register the feature effect module with an effect with the minimal flag', async () => {
    const options = {
      ...defaultOptions,
      root: false,
      module: 'app.module.ts',
      minimal: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forFeature\(\[FooEffects\]\)/);
    expect(
      tree.files.indexOf(`${projectPath}/src/app/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should register the feature effect in the provided module', async () => {
    const options = { ...defaultOptions, module: 'app.module.ts' };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);

    expect(content).toMatch(/EffectsModule\.forFeature\(\[FooEffects\]\)/);
  });

  it('should add an effect to the empty array of registered effects', async () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = {
      ...defaultOptions,
      root: true,
      module: 'store.module.ts',
    };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([])'
    );

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(storeModule);

    expect(content).toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should add an effect to the existing registered root effects', async () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = {
      ...defaultOptions,
      root: true,
      module: 'store.module.ts',
    };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot([UserEffects])'
    );

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(storeModule);

    expect(content).toMatch(
      /EffectsModule\.forRoot\(\[UserEffects, FooEffects\]\)/
    );
  });

  it('should add an effect to the existing registered feature effects', async () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      `EffectsModule.forRoot([RootEffects])\n    EffectsModule.forFeature([UserEffects])`
    );

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(storeModule);

    expect(content).toMatch(
      /EffectsModule\.forFeature\(\[UserEffects, FooEffects\]\)/
    );
  });

  it('should not add an effect to registered effects defined with a variable', async () => {
    const storeModule = `${projectPath}/src/app/store.module.ts`;
    const options = { ...defaultOptions, module: 'store.module.ts' };
    appTree = createAppModuleWithEffects(
      appTree,
      storeModule,
      'EffectsModule.forRoot(effects)'
    );

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(storeModule);

    expect(content).not.toMatch(/EffectsModule\.forRoot\(\[FooEffects\]\)/);
  });

  it('should group within an "effects" folder if group is set', async () => {
    const options = {
      ...defaultOptions,
      flat: true,
      skipTests: true,
      group: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);
  });

  it('should group and nest the effect within a feature', async () => {
    const options = {
      ...defaultOptions,
      skipTests: true,
      group: true,
      flat: false,
      feature: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const files = tree.files;
    expect(
      files.indexOf(`${projectPath}/src/app/effects/foo/foo.effects.ts`)
    ).toBeGreaterThanOrEqual(0);

    const content = tree.readContent(
      `${projectPath}/src/app/effects/foo/foo.effects.ts`
    );

    expect(content).toMatch(
      /import \{ FooActionTypes, FooActions } from '\.\.\/\.\.\/actions\/foo\/foo\.actions';/
    );
  });

  it('should create an effect that describes a source of actions within a feature', async () => {
    const options = { ...defaultOptions, feature: true };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.ts`
    );
    expect(content).toMatch(
      /import { Actions, Effect, ofType } from '@ngrx\/effects';/
    );
    expect(content).toMatch(/import { concatMap } from 'rxjs\/operators';/);
    expect(content).toMatch(/import { Observable, EMPTY } from 'rxjs';/);
    expect(content).toMatch(
      /import { FooActionTypes, FooActions } from '\.\/foo.actions';/
    );
    expect(content).toMatch(/export class FooEffects/);
    expect(content).toMatch(/loadFoos\$ = this\.actions\$.pipe\(/);
    expect(content).toMatch(/ofType\(FooActionTypes\.LoadFoos\)/);
    expect(content).toMatch(
      /concatMap\(\(\) => EMPTY as Observable<\{ type: string \}>\)/
    );

    expect(content).toMatch(
      /constructor\(private actions\$: Actions<FooActions>\) {}/
    );
  });

  it('should create an effect that does not define a source of actions within the root', async () => {
    const options = { ...defaultOptions, root: true };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.ts`
    );
    expect(content).toMatch(
      /import { Actions, Effect } from '@ngrx\/effects';/
    );
    expect(content).not.toMatch(
      /import { FooActionTypes } from '\.\/foo.actions';/
    );
    expect(content).toMatch(/export class FooEffects/);
    expect(content).not.toMatch(
      /loadFoos\$ = this\.actions\$.pipe\(ofType\(FooActionTypes\.LoadFoos/
    );
  });

  it('should create an api effect that describes a source of actions within a feature', async () => {
    const options = { ...defaultOptions, feature: true, api: true };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.ts`
    );
    expect(content).toMatch(
      /import { Actions, Effect, ofType } from '@ngrx\/effects';/
    );
    expect(content).toMatch(
      /import { catchError, map, concatMap } from 'rxjs\/operators';/
    );
    expect(content).toMatch(/import { Observable, EMPTY, of } from 'rxjs';/);
    expect(content).toMatch(
      /import { LoadFoosFailure, LoadFoosSuccess, FooActionTypes, FooActions } from '\.\/foo.actions';/
    );

    expect(content).toMatch(/export class FooEffects/);
    expect(content).toMatch(/loadFoos\$ = this\.actions\$.pipe\(/);
    expect(content).toMatch(/ofType\(FooActionTypes\.LoadFoos\),/);
    expect(content).toMatch(/concatMap\(\(\) =>/);
    expect(content).toMatch(/EMPTY\.pipe\(/);
    expect(content).toMatch(/map\(data => new LoadFoosSuccess\({ data }\)\),/);
    expect(content).toMatch(
      /catchError\(error => of\(new LoadFoosFailure\({ error }\)\)\)\)/
    );

    expect(content).toMatch(
      /constructor\(private actions\$: Actions<FooActions>\) {}/
    );
  });

  it('should create an effect using creator function', async () => {
    const options = { ...defaultOptions, creators: true, feature: true };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.ts`
    );
    expect(content).toMatch(
      /import { Actions, createEffect, ofType } from '@ngrx\/effects';/
    );
    expect(content).not.toMatch(/@Effect\(\)/);
    expect(content).toMatch(
      /loadFoos\$ = createEffect\(\(\) => {\s* return this.actions\$.pipe\(/
    );
  });

  it('should use action creators when creators is enabled in a feature', async () => {
    const options = { ...defaultOptions, creators: true, feature: true };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.ts`
    );

    expect(content).toMatch(
      /import { Actions, createEffect, ofType } from '@ngrx\/effects';/
    );
    expect(content).toMatch(/import \* as FooActions from '\.\/foo\.actions';/);
    expect(content).toMatch(/ofType\(FooActions\.loadFoos\),/);
  });

  it('should create an api effect using creator function', async () => {
    const options = {
      ...defaultOptions,
      creators: true,
      api: true,
      feature: true,
    };

    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.ts`
    );

    expect(content).toMatch(
      /import { Actions, createEffect, ofType } from '@ngrx\/effects';/
    );
    expect(content).not.toMatch(/@Effect\(\)/);
    expect(content).toMatch(
      /loadFoos\$ = createEffect\(\(\) => {\s* return this.actions\$.pipe\(/
    );
  });

  it('should inject the effect service correctly', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner
      .runSchematicAsync('effect', options, appTree)
      .toPromise();
    const content = tree.readContent(
      `${projectPath}/src/app/foo/foo.effects.spec.ts`
    );

    expect(content).toMatch(/effects = TestBed\.inject\(FooEffects\);/);
  });
});

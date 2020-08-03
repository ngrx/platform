import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { Schema as RouterStoreOptions } from './schema';
import {
  getTestProjectPath,
  createWorkspace,
} from '@ngrx/schematics-core/testing';

describe('Router Store ng-add Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/router-store',
    path.join(__dirname, '../collection.json')
  );
  const defaultOptions: RouterStoreOptions = {
    skipPackageJson: false,
    module: 'app',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should update package.json', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/router-store']).toBeDefined();
  });

  it('should skip package.json update', async () => {
    const options = { ...defaultOptions, skipPackageJson: true };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const packageJson = JSON.parse(tree.readContent('/package.json'));

    expect(packageJson.dependencies['@ngrx/router-store']).toBeUndefined();
  });

  it('should be provided by default', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { StoreRouterConnectingModule } from '@ngrx\/router-store';/
    );
    expect(content).toMatch(/StoreRouterConnectingModule.forRoot\(\)/);
  });

  it('should import into a specified module', async () => {
    const options = { ...defaultOptions };

    const tree = await schematicRunner
      .runSchematicAsync('ng-add', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/app.module.ts`);
    expect(content).toMatch(
      /import { StoreRouterConnectingModule } from '@ngrx\/router-store';/
    );
  });

  it('should fail if specified module does not exist', async () => {
    const options = { ...defaultOptions, module: '/src/app/app.moduleXXX.ts' };
    let thrownError: Error | null = null;
    try {
      await schematicRunner.runSchematicAsync('ng-add', options, appTree);
    } catch (err) {
      thrownError = err;
    }
    expect(thrownError).toBeDefined();
  });
});

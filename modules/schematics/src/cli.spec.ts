import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import {
  getTestProjectPath,
  createWorkspace,
} from '@ngrx/schematics-core/testing';

describe('CLI Schematic', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../collection.json')
  );

  const defaultOptions = {
    name: 'foo',
    project: 'bar',
  };

  const projectPath = getTestProjectPath();

  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should create a class by the angular/cli', async () => {
    const options = { ...defaultOptions };
    const tree = await schematicRunner
      .runSchematicAsync('class', options, appTree)
      .toPromise();
    const content = tree.readContent(`${projectPath}/src/app/foo.ts`);

    expect(content).toMatch(/export class Foo/);
  });
});

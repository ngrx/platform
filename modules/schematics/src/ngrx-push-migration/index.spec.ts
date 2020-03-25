import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import * as path from 'path';
import { createWorkspace } from '../../../schematics-core/testing';

describe('NgrxPush migration', () => {
  const schematicRunner = new SchematicTestRunner(
    '@ngrx/schematics',
    path.join(__dirname, '../../collection.json')
  );

  let appTree: UnitTestTree;

  const TEMPLATE = `
    <span>promise|async</span> <!-- this will also get replaced -->
    <span>One whitespace {{ greeting | async }}</span>
    <span>No whitespace {{ greeting |async }}</span>
    <span>Multiple whitespace {{ greeting |      async }}</span>
  `;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  it('should replace an inline template', async () => {
    appTree.create(
      './sut.component.ts',
      `@Component({
        selector: 'sut',
        template: \`${TEMPLATE}\`
      })
      export class SUTComponent { }`
    );

    const tree = await schematicRunner
      .runSchematicAsync('ngrx-push-migration', {}, appTree)
      .toPromise();

    const actual = tree.readContent('./sut.component.ts');
    expect(actual).not.toContain('async');
    expect(actual).toContain('ngrxPush');
  });

  it('should replace a file template', async () => {
    appTree.create(
      './sut.component.ts',
      `@Component({
        selector: 'sut',
        templateUrl: './sut.component.html'
      })
      export class SUTComponent { }`
    );
    appTree.create('./sut.component.html', TEMPLATE);

    const tree = await schematicRunner
      .runSchematicAsync('ngrx-push-migration', {}, appTree)
      .toPromise();

    const actual = tree.readContent('./sut.component.html');
    expect(actual).not.toContain('async');
    expect(actual).toContain('ngrxPush');
  });

  it('should not touch templates that are not referenced', async () => {
    appTree.create('./sut.component.html', TEMPLATE);

    const tree = await schematicRunner
      .runSchematicAsync('ngrx-push-migration', {}, appTree)
      .toPromise();

    const actual = tree.readContent('./sut.component.html');
    expect(actual).toBe(TEMPLATE);
  });
});

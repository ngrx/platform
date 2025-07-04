import * as path from 'path';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';

describe('migrate tapResponse', () => {
  const collectionPath = path.join(__dirname, '../migration.json');
  const schematicRunner = new SchematicTestRunner('schematics', collectionPath);
  let appTree: UnitTestTree;

  beforeEach(async () => {
    appTree = await createWorkspace(schematicRunner, appTree);
  });

  const verifySchematic = async (input: string, output: string) => {
    appTree.create('main.ts', input);

    const tree = await schematicRunner.runSchematic(
      '20.0.0-beta_1-tap-response',
      {},
      appTree
    );

    const actual = tree.readContent('main.ts');

    const normalize = (s: string) => s.replace(/\s+/g, '').replace(/;/g, '');
    expect(normalize(actual)).toBe(normalize(output));
  };

  it('migrates basic tapResponse signature', async () => {
    const input = `import { tapResponse } from '@ngrx/operators';
tapResponse(() => {}, () => {});
`;

    const output = `import { tapResponse } from '@ngrx/operators';
tapResponse({
    next: () => { },
    error: () => { }
});
`;

    await verifySchematic(input, output);
  });

  it('migrates tapResponse with complete callback', async () => {
    const input = `
    import { tapResponse } from '@ngrx/operators';
    tapResponse(
      () => next,
      () => error,
      () => complete
    );
  `;

    const output = `
    import { tapResponse } from '@ngrx/operators';
    tapResponse({
      next: () => next,
      error: () => error,
      complete: () => complete
    });
  `;

    await verifySchematic(input, output);
  });

  it('migrates aliased tapResponse calls', async () => {
    const input = `
    import { tapResponse } from '@ngrx/operators';
    const myTapResponse = tapResponse;
    myTapResponse(
      () => next,
      () => error
    );
  `;

    const output = `
    import { tapResponse } from '@ngrx/operators';
    const myTapResponse = tapResponse;
    myTapResponse({
      next: () => next,
      error: () => error
    });
  `;

    await verifySchematic(input, output);
  });

  it('migrates namespaced tapResponse calls', async () => {
    const input = `import * as operators from '@ngrx/operators';
operators.tapResponse(() => next, () => error, () => complete);
`;

    const output = `import * as operators from '@ngrx/operators';
operators.tapResponse({
    next: () => next,
    error: () => error,
    complete: () => complete
});
`;

    await verifySchematic(input, output);
  });

  it('skips tapResponse if not imported from @ngrx/operators', async () => {
    const input = `import { tapResponse } from '@ngrx/component';
tapResponse(() => {}, () => {});
`;

    // Expect NO transformation
    const output = `import { tapResponse } from '@ngrx/component';
tapResponse(() => {}, () => {});
`;

    await verifySchematic(input, output);
  });

  it('skips correct tapResponse signature', async () => {
    const input = `import { tapResponse } from '@ngrx/operators';
tapResponse({
    next: () => { },
    error: () => { }
});
`;

    const output = `import { tapResponse } from '@ngrx/operators';
tapResponse({
    next: () => { },
    error: () => { }
});
`;
    await verifySchematic(input, output);
  });

  it('migrates tapResponse inside a full component-like body', async () => {
    const input = `import { tapResponse } from '@ngrx/operators';
function handle() {
  return tapResponse(() => next(), () => error(), () => complete());
}
`;

    const output = `import { tapResponse } from '@ngrx/operators';
function handle() {
  return tapResponse({
    next: () => next(),
    error: () => error(),
    complete: () => complete()
  });
}
`;

    await verifySchematic(input, output);
  });

  it('should migrate tapResponse(onNext, onError) to object form', async () => {
    const input = `
    import { tapResponse } from '@ngrx/operators';
    const obs = tapResponse(
      (value) => console.log(value),
      (error) => console.error(error)
    );
  `;

    const output = `
    import { tapResponse } from '@ngrx/operators';
    const obs = tapResponse({
      next: (value) => console.log(value),
      error: (error) => console.error(error)
    });
  `;
    await verifySchematic(input, output);
  });

  it('should NOT migrate tapResponse imported from another module', async () => {
    const input = `
    import { tapResponse } from 'some-other-lib';
    const obs = tapResponse(
      (value) => console.log(value),
      (error) => console.error(error)
    );
  `;

    const output = input; // Should remain unchanged

    await verifySchematic(input, output);
  });
});

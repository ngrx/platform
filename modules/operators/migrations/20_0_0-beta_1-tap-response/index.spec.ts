import * as path from 'path';
import {
  SchematicTestRunner,
  UnitTestTree,
} from '@angular-devkit/schematics/testing';
import { createWorkspace } from '@ngrx/schematics-core/testing';
import { tags } from '@angular-devkit/core';
import { visitCallExpression } from '@ngrx/schematics-core/utility/visitors';
import * as ts from 'typescript';
import * as prettier from 'prettier';

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

    const actual = prettier.format(tree.readContent('main.ts'), {
      parser: 'typescript',
    });

    expect(actual).toBe(
      prettier.format(output, {
        parser: 'typescript',
      })
    );
  };

  it('should migrate basic tapResponse signature', async () => {
    const input = tags.stripIndent`
      import { tapResponse } from '@ngrx/component';
      tapResponse(() => {}, () => {});
    `;

    const output = tags.stripIndent`
      import { tapResponse } from '@ngrx/component';
      tapResponse({
        next: () => {},
        error: () => {}
      });
    `;

    await verifySchematic(input, output);
  });

  it('should migrate tapResponse with complete callback', async () => {
    const input = tags.stripIndent`
      tapResponse(() => next, () => error, () => complete);
    `;

    const output = tags.stripIndent`
      tapResponse({
        next: () => next,
        error: () => error,
        complete: () => complete
      });
    `;

    await verifySchematic(input, output);
  });

  it('should migrate aliased tapResponse calls', async () => {
    const input = tags.stripIndent`
      const myTapResponse = tapResponse;
      myTapResponse(() => next, () => error);
    `;

    const output = tags.stripIndent`
      const myTapResponse = tapResponse;
      myTapResponse({
        next: () => next,
        error: () => error
      });
    `;

    await verifySchematic(input, output);
  });

  it('should migrate namespaced tapResponse calls', async () => {
    const input = tags.stripIndent`
      import * as operators from '@ngrx/component';
      operators.tapResponse(() => next, () => error, () => complete);
    `;

    const output = tags.stripIndent`
      import * as operators from '@ngrx/component';
      operators.tapResponse({
        next: () => next,
        error: () => error,
        complete: () => complete
      });
    `;

    await verifySchematic(input, output);
  });

  it('should identify all call expressions including aliases and namespace calls', () => {
    const code = tags.stripIndent`
      import { tapResponse } from '@ngrx/component';
      import * as operators from '@ngrx/component';
      const myTapResponse = tapResponse;
      const anotherAlias = operators;
      tapResponse(() => {}, () => {});
      myTapResponse(() => {}, () => {});
      anotherAlias.tapResponse(() => {}, () => {});
    `;

    const sourceFile = ts.createSourceFile(
      'test.ts',
      code,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );

    const foundCalls: ts.CallExpression[] = [];

    visitCallExpression(sourceFile, (node) => {
      foundCalls.push(node);
    });

    expect(foundCalls.length).toBe(3);

    const callTexts = foundCalls.map((call) => call.getText());

    expect(callTexts).toContain('tapResponse(() => {}, () => {})');
    expect(callTexts).toContain('myTapResponse(() => {}, () => {})');
    expect(callTexts).toContain('anotherAlias.tapResponse(() => {}, () => {})');
  });
});

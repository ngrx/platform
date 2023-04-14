import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  RemoveChange,
  InsertChange,
  commitChanges,
} from '../../schematics-core';

function updateGetMockStore(): Rule {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const imports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(
          (importDeclaration) =>
            importDeclaration.moduleSpecifier.getText(sourceFile) ===
              "'@ngrx/store'" ||
            importDeclaration.moduleSpecifier.getText(sourceFile) ===
              '"@ngrx/store"'
        )
        .flatMap((importDeclaration) => {
          return importDeclaration.importClause?.namedBindings ?? [];
        })
        .flatMap((binding) =>
          ts.isNamedImports(binding) ? binding.elements : []
        )
        .filter(
          (element) => element.name.getText(sourceFile) === 'getMockStore'
        );
      if (!imports.length) return;

      const changes: (InsertChange | RemoveChange)[] = [];
      imports.forEach((binding) => {
        changes.push(
          new RemoveChange(sourceFile.fileName, binding.pos, binding.end)
        );
        changes.push(
          new InsertChange(sourceFile.fileName, binding.pos, 'createMockStore')
        );
      });

      ts.forEachChild(sourceFile, crawl);
      return commitChanges(tree, sourceFile.fileName, changes);

      function crawl(node: ts.Node) {
        ts.forEachChild(node, crawl);

        if (!ts.isCallExpression(node)) return;
        if (!ts.isIdentifier(node.expression)) return;
        if (node.expression.text !== 'getMockStore') return;

        changes.push(
          new RemoveChange(
            sourceFile.fileName,
            node.expression.pos,
            node.expression.end
          )
        );
        changes.push(
          new InsertChange(
            sourceFile.fileName,
            node.expression.pos,
            'createMockStore'
          )
        );
      }
    });
  };
}

export default function (): Rule {
  return chain([updateGetMockStore]);
}

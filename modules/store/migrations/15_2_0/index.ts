import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  RemoveChange,
  commitChanges,
  InsertChange,
} from '../../schematics-core';

function updatecreateFeature(): Rule {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const runMigration = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(
          (importDeclaration) =>
            importDeclaration.moduleSpecifier.getText(sourceFile) ===
              "'@ngrx/store'" ||
            importDeclaration.moduleSpecifier.getText(sourceFile) ===
              '"@ngrx/store"'
        )
        .some((importDeclaration) => {
          return importDeclaration.importClause?.namedBindings
            ?.getText(sourceFile)
            .includes('createFeature');
        });

      if (!runMigration) return;

      const changes: (RemoveChange | InsertChange)[] = [];
      ts.forEachChild(sourceFile, crawl);
      return commitChanges(tree, sourceFile.fileName, changes);

      function crawl(node: ts.Node) {
        ts.forEachChild(node, crawl);

        if (!ts.isCallExpression(node)) return;

        const { typeArguments } = node;

        if (!typeArguments?.length) return;

        if (!ts.isIdentifier(node.expression)) return;
        if (node.expression.text !== 'createFeature') return;

        changes.push(
          new RemoveChange(
            sourceFile.fileName,
            // to include <
            typeArguments.pos - 1,
            // to include >
            typeArguments.end + 1
          )
        );
      }
    });
  };
}

export default function (): Rule {
  return chain([updatecreateFeature]);
}

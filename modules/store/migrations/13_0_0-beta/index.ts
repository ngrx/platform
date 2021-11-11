import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  RemoveChange,
  commitChanges,
} from '../../schematics-core';

function updateCreateFeatureSelectorGenerics(): Rule {
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
            .includes('createFeatureSelector');
        });

      if (!runMigration) return;

      const changes: RemoveChange[] = [];
      ts.forEachChild(sourceFile, crawl);
      return commitChanges(tree, sourceFile.fileName, changes);

      function crawl(node: ts.Node) {
        ts.forEachChild(node, crawl);

        if (!ts.isCallExpression(node)) return;
        if (node.typeArguments?.length !== 2) return;
        if (!ts.isIdentifier(node.expression)) return;
        if (node.expression.text !== 'createFeatureSelector') return;

        changes.push(
          new RemoveChange(
            sourceFile.fileName,
            node.typeArguments[0].pos,
            node.typeArguments[1].pos
          )
        );
      }
    });
  };
}

export default function (): Rule {
  return chain([updateCreateFeatureSelectorGenerics()]);
}

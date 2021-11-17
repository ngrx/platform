import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  RemoveChange,
  commitChanges,
  InsertChange,
} from '../../schematics-core';

function updateCreateSelectorGenerics(): Rule {
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
            .includes('createSelector');
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
        const typeArgumentsLength = typeArguments?.length;
        if (typeArgumentsLength < 3) return;
        if (!ts.isIdentifier(node.expression)) return;
        if (node.expression.text !== 'createSelector') return;

        const lastTypeArgumentIndex = typeArgumentsLength - 1;
        const slicesTypeArguments = typeArguments.slice(
          1,
          lastTypeArgumentIndex
        );
        const updatedTypeArguments = [
          typeArguments[0],
          slicesTypeArguments,
          typeArguments[lastTypeArgumentIndex],
        ];

        const isSelectorWithProps =
          node.arguments.length === typeArguments.length - 2;
        if (isSelectorWithProps) return;

        const newTypeArguments = updatedTypeArguments
          .map((arg) =>
            Array.isArray(arg)
              ? `[${arg.map((a) => a.getText(sourceFile)).join(',')}]`
              : arg.getText(sourceFile)
          )
          .join(',');

        changes.push(
          new RemoveChange(
            sourceFile.fileName,
            typeArguments.pos,
            typeArguments?.end
          ),
          new InsertChange(
            sourceFile.fileName,
            typeArguments.pos,
            newTypeArguments
          )
        );
      }
    });
  };
}

export default function (): Rule {
  return chain([updateCreateSelectorGenerics]);
}

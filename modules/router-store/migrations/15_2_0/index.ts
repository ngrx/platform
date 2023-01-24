import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  commitChanges,
  createReplaceChange,
  ReplaceChange,
} from '../../schematics-core';

const renames: { [key: string]: string } = {
  getSelectors: 'getRouterSelectors',
};

function renameSelector() {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const routerStoreImports = sourceFile.statements
        .filter((p): p is ts.ImportDeclaration => ts.isImportDeclaration(p))
        .filter(({ moduleSpecifier }) =>
          moduleSpecifier.getText(sourceFile).includes('@ngrx/router-store')
        );
      const changes: ReplaceChange[] = [
        ...replaceNamedImports(routerStoreImports, sourceFile),
        ...replaceNamespaceImports(routerStoreImports, sourceFile),
      ];

      if (changes.length) {
        commitChanges(tree, sourceFile.fileName, changes);
      }
    });
  };
}

function replaceNamedImports(
  routerStoreImports: ts.ImportDeclaration[],
  sourceFile: ts.SourceFile
): ReplaceChange[] {
  const changes: ReplaceChange[] = [];

  const namedImports = routerStoreImports
    .flatMap((p) =>
      !!p.importClause && ts.isImportClause(p.importClause)
        ? p.importClause.namedBindings
        : []
    )
    .flatMap((p) => (!!p && ts.isNamedImports(p) ? p.elements : []));

  for (const namedImport of namedImports) {
    tryToAddReplacement(namedImport.name, sourceFile, changes);
  }
  return changes;
}

function replaceNamespaceImports(
  routerStoreImports: ts.ImportDeclaration[],
  sourceFile: ts.SourceFile
): ReplaceChange[] {
  const changes: ReplaceChange[] = [];

  const namespaceImports = routerStoreImports
    .map((p) =>
      !!p.importClause &&
      ts.isImportClause(p.importClause) &&
      !!p.importClause.namedBindings &&
      ts.isNamespaceImport(p.importClause.namedBindings)
        ? p.importClause.namedBindings.name.getText(sourceFile)
        : null
    )
    .filter((p): p is string => !!p);

  if (namespaceImports.length === 0) {
    return changes;
  }

  for (const statement of sourceFile.statements) {
    statement.forEachChild((child) => {
      if (ts.isVariableDeclarationList(child)) {
        const [declaration] = child.declarations;
        if (
          ts.isVariableDeclaration(declaration) &&
          declaration.initializer &&
          ts.isCallExpression(declaration.initializer) &&
          declaration.initializer.expression &&
          ts.isPropertyAccessExpression(declaration.initializer.expression) &&
          ts.isIdentifier(declaration.initializer.expression.expression) &&
          ts.isIdentifier(declaration.initializer.expression.name)
        ) {
          if (
            namespaceImports.includes(
              declaration.initializer.expression.expression.getText(sourceFile)
            )
          ) {
            tryToAddReplacement(
              declaration.initializer.expression.name,
              sourceFile,
              changes
            );
          }
        }
      }
    });
  }

  return changes;
}

function tryToAddReplacement(
  oldName: ts.Identifier,
  sourceFile: ts.SourceFile,
  changes: ReplaceChange[]
) {
  const oldNameText = oldName.getText(sourceFile);
  const newName = renames[oldNameText];
  if (newName) {
    const change = createReplaceChange(
      sourceFile,
      oldName,
      oldNameText,
      newName
    );
    changes.push(change);
  }
}

export default function (): Rule {
  return chain([renameSelector()]);
}

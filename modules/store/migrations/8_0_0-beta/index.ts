import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  ReplaceChange,
  createReplaceChange,
  visitTSSourceFiles,
  commitChanges,
} from '@ngrx/store/schematics-core';

const META_REDUCERS = 'META_REDUCERS';

function updateMetaReducersToken(): Rule {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, sourceFile => {
      const createChange = (node: ts.Node) =>
        createReplaceChange(
          sourceFile,
          node,
          META_REDUCERS,
          'USER_PROVIDED_META_REDUCERS'
        );

      const changes: ReplaceChange[] = [];
      changes.push(
        ...findMetaReducersImportStatements(sourceFile, createChange)
      );
      changes.push(...findMetaReducersAssignment(sourceFile, createChange));

      return commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

export default function(): Rule {
  return chain([updateMetaReducersToken()]);
}

function findMetaReducersImportStatements(
  sourceFile: ts.SourceFile,
  createChange: (node: ts.Node) => ReplaceChange
) {
  const metaReducerImports = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .filter(isNgRxStoreImport)
    .map(p =>
      (p.importClause!.namedBindings! as ts.NamedImports).elements.filter(
        isMetaReducersImportSpecifier
      )
    )
    .reduce((imports, curr) => imports.concat(curr), []);

  const changes = metaReducerImports.map(createChange);
  return changes;

  function isNgRxStoreImport(importDeclaration: ts.ImportDeclaration) {
    return (
      importDeclaration.moduleSpecifier.getText(sourceFile) === "'@ngrx/store'"
    );
  }

  function isMetaReducersImportSpecifier(importSpecifier: ts.ImportSpecifier) {
    const isImport = () => importSpecifier.name.text === META_REDUCERS;
    const isRenamedImport = () =>
      importSpecifier.propertyName &&
      importSpecifier.propertyName.text === META_REDUCERS;

    return (
      ts.isImportSpecifier(importSpecifier) && (isImport() || isRenamedImport())
    );
  }
}

function findMetaReducersAssignment(
  sourceFile: ts.SourceFile,
  createChange: (node: ts.Node) => ReplaceChange
) {
  let changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, node => findMetaReducers(node, changes));
  return changes;

  function findMetaReducers(node: ts.Node, changes: ReplaceChange[]) {
    if (
      ts.isPropertyAssignment(node) &&
      node.initializer.getText(sourceFile) === META_REDUCERS
    ) {
      changes.push(createChange(node.initializer));
    }

    ts.forEachChild(node, childNode => findMetaReducers(childNode, changes));
  }
}

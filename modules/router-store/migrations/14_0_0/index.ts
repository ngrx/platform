import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  commitChanges,
  createReplaceChange,
  ReplaceChange,
} from '../../schematics-core';

const renames = {
  DefaultRouterStateSerializer: 'FullRouterStateSerializer',
};

function renameSerializers() {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const routerStoreImports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(({ moduleSpecifier }) =>
          moduleSpecifier.getText(sourceFile).includes('@ngrx/router-store')
        );

      if (routerStoreImports.length === 0) {
        return;
      }

      const changes = [
        ...findSerializerImportDeclarations(sourceFile, routerStoreImports),
        ...findSerializerReplacements(sourceFile),
      ];

      commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

function findSerializerImportDeclarations(
  sourceFile: ts.SourceFile,
  imports: ts.ImportDeclaration[]
) {
  const changes = imports
    .map((p) => (p?.importClause?.namedBindings as ts.NamedImports)?.elements)
    .reduce(
      (imports, curr) => imports.concat(curr ?? []),
      [] as ts.ImportSpecifier[]
    )
    .map((specifier) => {
      if (!ts.isImportSpecifier(specifier)) {
        return { hit: false };
      }

      const serializerImports = Object.keys(renames);
      if (serializerImports.includes(specifier.name.text)) {
        return { hit: true, specifier, text: specifier.name.text };
      }

      // if import is renamed
      if (
        specifier.propertyName &&
        serializerImports.includes(specifier.propertyName.text)
      ) {
        return { hit: true, specifier, text: specifier.propertyName.text };
      }

      return { hit: false };
    })
    .filter(({ hit }) => hit)
    .map(({ specifier, text }) =>
      !!specifier && !!text
        ? createReplaceChange(
            sourceFile,
            specifier,
            text,
            (renames as any)[text]
          )
        : undefined
    )
    .filter((change) => !!change) as Array<ReplaceChange>;

  return changes;
}

function findSerializerReplacements(sourceFile: ts.SourceFile) {
  const renameKeys = Object.keys(renames);
  const changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, (node) => find(node, changes));
  return changes;

  function find(node: ts.Node, changes: ReplaceChange[]) {
    let change = undefined;

    if (
      ts.isPropertyAssignment(node) &&
      renameKeys.includes(node.initializer.getText(sourceFile))
    ) {
      change = {
        node: node.initializer,
        text: node.initializer.getText(sourceFile),
      };
    }

    if (
      ts.isPropertyAccessExpression(node) &&
      renameKeys.includes(node.expression.getText(sourceFile))
    ) {
      change = {
        node: node.expression,
        text: node.expression.getText(sourceFile),
      };
    }

    if (
      ts.isVariableDeclaration(node) &&
      node.type &&
      renameKeys.includes(node.type.getText(sourceFile))
    ) {
      change = {
        node: node.type,
        text: node.type.getText(sourceFile),
      };
    }

    if (change) {
      changes.push(
        createReplaceChange(
          sourceFile,
          change.node,
          change.text,
          (renames as any)[change.text]
        )
      );
    }

    ts.forEachChild(node, (childNode) => find(childNode, changes));
  }
}

export default function (): Rule {
  return chain([renameSerializers()]);
}

import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  commitChanges,
  createReplaceChange,
  ReplaceChange,
} from '../../schematics-core';

const reactiveComponentModuleText = 'ReactiveComponentModule';
const reactiveComponentModuleReplacement = 'LetModule, PushModule';

function migrateReactiveComponentModule() {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const componentStoreImports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(({ moduleSpecifier }) =>
          moduleSpecifier.getText(sourceFile).includes('@ngrx/component')
        );

      if (componentStoreImports.length === 0) {
        return;
      }

      const changes = [
        ...findReactiveComponentModuleImportDeclarations(
          sourceFile,
          componentStoreImports
        ),
        ...findReactiveComponentModuleImportReplacements(sourceFile),
      ];

      commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

function findReactiveComponentModuleImportDeclarations(
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

      if (specifier.name.text === reactiveComponentModuleText) {
        return { hit: true, specifier, text: specifier.name.text };
      }

      // if import is renamed
      if (
        specifier.propertyName &&
        specifier.propertyName.text === reactiveComponentModuleText
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
            reactiveComponentModuleReplacement
          )
        : undefined
    )
    .filter((change) => !!change) as Array<ReplaceChange>;

  return changes;
}

function findReactiveComponentModuleImportReplacements(
  sourceFile: ts.SourceFile
) {
  const changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, (node) => find(node, changes));
  return changes;

  function find(node: ts.Node, changes: ReplaceChange[]) {
    let change = undefined;

    // ReactiveComponentModule in NgModule `imports` array
    if (
      ts.isIdentifier(node) &&
      node.text === reactiveComponentModuleText &&
      ts.isArrayLiteralExpression(node.parent) &&
      ts.isPropertyAssignment(node.parent.parent) &&
      node.parent.parent.getText().startsWith('imports:')
    ) {
      change = {
        node: node,
        text: node.text,
      };
    }

    if (change) {
      changes.push(
        createReplaceChange(
          sourceFile,
          change.node,
          change.text,
          reactiveComponentModuleReplacement
        )
      );
    }

    ts.forEachChild(node, (childNode) => find(childNode, changes));
  }
}

export default function (): Rule {
  return chain([migrateReactiveComponentModule()]);
}

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
const moduleLocations = {
  imports: ['NgModule', 'Component'],
  exports: ['NgModule'],
};

function migrateReactiveComponentModule() {
  return (tree: Tree) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const componentImports = sourceFile.statements
        .filter(ts.isImportDeclaration)
        .filter(({ moduleSpecifier }) =>
          moduleSpecifier.getText(sourceFile).includes('@ngrx/component')
        );

      if (componentImports.length === 0) {
        return;
      }

      const ngModuleReplacements =
        findReactiveComponentModuleNgModuleReplacements(sourceFile);

      const possibleUsagesOfReactiveComponentModuleCount =
        findPossibleReactiveComponentModuleUsageCount(sourceFile);

      const importAdditionReplacements =
        findReactiveComponentModuleImportDeclarationAdditions(
          sourceFile,
          componentImports
        );

      const importUsagesCount = importAdditionReplacements.length;

      const jsImportDeclarationReplacements =
        possibleUsagesOfReactiveComponentModuleCount >
        ngModuleReplacements.length + importUsagesCount
          ? importAdditionReplacements
          : findReactiveComponentModuleImportDeclarationReplacements(
              sourceFile,
              componentImports
            );

      const changes = [
        ...jsImportDeclarationReplacements,
        ...ngModuleReplacements,
      ];

      commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

function findReactiveComponentModuleImportDeclarationReplacements(
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

function findReactiveComponentModuleImportDeclarationAdditions(
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
            `${text}, ${reactiveComponentModuleReplacement}`
          )
        : undefined
    )
    .filter((change) => !!change) as Array<ReplaceChange>;

  return changes;
}

function findPossibleReactiveComponentModuleUsageCount(
  sourceFile: ts.SourceFile
): number {
  let count = 0;
  ts.forEachChild(sourceFile, (node) => countUsages(node));
  return count;

  function countUsages(node: ts.Node) {
    if (ts.isIdentifier(node) && node.text === reactiveComponentModuleText) {
      count = count + 1;
    }

    ts.forEachChild(node, (childNode) => countUsages(childNode));
  }
}

function findReactiveComponentModuleNgModuleReplacements(
  sourceFile: ts.SourceFile
) {
  const changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, (node) => find(node, changes));
  return changes;

  function find(node: ts.Node, changes: ReplaceChange[]) {
    let change = undefined;

    if (
      ts.isIdentifier(node) &&
      node.text === reactiveComponentModuleText &&
      ts.isArrayLiteralExpression(node.parent) &&
      ts.isPropertyAssignment(node.parent.parent)
    ) {
      const property = node.parent.parent;
      if (ts.isIdentifier(property.name)) {
        const propertyName = String(property.name.escapedText);
        if (Object.keys(moduleLocations).includes(propertyName)) {
          const decorator = property.parent.parent.parent;
          if (
            ts.isDecorator(decorator) &&
            ts.isCallExpression(decorator.expression) &&
            ts.isIdentifier(decorator.expression.expression) &&
            moduleLocations[propertyName as 'imports' | 'exports'].includes(
              String(decorator.expression.expression.escapedText)
            )
          ) {
            change = {
              node: node,
              text: node.text,
            };
          }
        }
      }
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

import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  visitTSSourceFiles,
  commitChanges,
  createReplaceChange,
  ReplaceChange,
} from '../../schematics-core';

const letModuleText = 'LetModule';
const letDirectiveText = 'LetDirective';
const pushModuleText = 'PushModule';
const pushPipeText = 'PushPipe';
const moduleLocations = {
  imports: ['NgModule', 'Component'],
  exports: ['NgModule'],
};

function migrateToStandaloneAPIs() {
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

      const ngModuleReplacements = findNgModuleReplacements(sourceFile);
      const possibleModulesUsageCount =
        findPossibleModulesUsageCount(sourceFile);
      const importAdditionReplacements = findImportDeclarationAdditions(
        sourceFile,
        componentImports
      );
      const jsImportDeclarationReplacements =
        possibleModulesUsageCount >
        ngModuleReplacements.length + importAdditionReplacements.length
          ? importAdditionReplacements
          : findImportDeclarationReplacements(sourceFile, componentImports);

      const changes = [
        ...jsImportDeclarationReplacements,
        ...ngModuleReplacements,
      ];

      commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

function findImportDeclarationReplacements(
  sourceFile: ts.SourceFile,
  imports: ts.ImportDeclaration[]
) {
  return findImportDeclarations(sourceFile, imports)
    .map(({ specifier, oldText, newText }) =>
      !!specifier && !!oldText
        ? createReplaceChange(sourceFile, specifier, oldText, newText)
        : undefined
    )
    .filter((change) => !!change) as Array<ReplaceChange>;
}

function findImportDeclarationAdditions(
  sourceFile: ts.SourceFile,
  imports: ts.ImportDeclaration[]
) {
  return findImportDeclarations(sourceFile, imports)
    .map(({ specifier, oldText, newText }) =>
      !!specifier && !!oldText
        ? createReplaceChange(
            sourceFile,
            specifier,
            oldText,
            `${oldText}, ${newText}`
          )
        : undefined
    )
    .filter((change) => !!change) as Array<ReplaceChange>;
}

function findImportDeclarations(
  sourceFile: ts.SourceFile,
  imports: ts.ImportDeclaration[]
) {
  return imports
    .map((p) => (p?.importClause?.namedBindings as ts.NamedImports)?.elements)
    .reduce(
      (imports, curr) => imports.concat(curr ?? []),
      [] as ts.ImportSpecifier[]
    )
    .map((specifier) => {
      if (!ts.isImportSpecifier(specifier)) {
        return { hit: false };
      }

      if (specifier.name.text === letModuleText) {
        return {
          hit: true,
          specifier,
          oldText: specifier.name.text,
          newText: letDirectiveText,
        };
      }

      if (specifier.name.text === pushModuleText) {
        return {
          hit: true,
          specifier,
          oldText: specifier.name.text,
          newText: pushPipeText,
        };
      }

      // if `LetModule` import is renamed
      if (specifier.propertyName?.text === letModuleText) {
        return {
          hit: true,
          specifier,
          oldText: specifier.propertyName.text,
          newText: letDirectiveText,
        };
      }

      // if `PushModule` import is renamed
      if (specifier.propertyName?.text === pushModuleText) {
        return {
          hit: true,
          specifier,
          oldText: specifier.propertyName.text,
          newText: pushPipeText,
        };
      }

      return { hit: false };
    })
    .filter(({ hit }) => hit);
}

function findPossibleModulesUsageCount(sourceFile: ts.SourceFile): number {
  let count = 0;
  ts.forEachChild(sourceFile, (node) => countUsages(node));
  return count;

  function countUsages(node: ts.Node) {
    if (
      ts.isIdentifier(node) &&
      (node.text === letModuleText || node.text === pushModuleText)
    ) {
      count = count + 1;
    }

    ts.forEachChild(node, (childNode) => countUsages(childNode));
  }
}

function findNgModuleReplacements(sourceFile: ts.SourceFile) {
  const changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, (node) => find(node, changes));
  return changes;

  function find(node: ts.Node, changes: ReplaceChange[]) {
    let change = undefined;

    if (
      ts.isIdentifier(node) &&
      (node.text === letModuleText || node.text === pushModuleText) &&
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
              oldText: node.text,
              newText:
                node.text === letModuleText ? letDirectiveText : pushPipeText,
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
          change.oldText,
          change.newText
        )
      );
    }

    ts.forEachChild(node, (childNode) => find(childNode, changes));
  }
}

export default function (): Rule {
  return chain([migrateToStandaloneAPIs()]);
}

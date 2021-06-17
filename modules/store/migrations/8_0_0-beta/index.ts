import * as ts from 'typescript';
import { tags, logging } from '@angular-devkit/core';
import {
  Rule,
  chain,
  Tree,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  ReplaceChange,
  createReplaceChange,
  visitTSSourceFiles,
  commitChanges,
} from '../../schematics-core';

const META_REDUCERS = 'META_REDUCERS';

function updateMetaReducersToken(): Rule {
  return (tree: Tree, context: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const createChange = (node: ts.Node) =>
        createReplaceChange(
          sourceFile,
          node,
          META_REDUCERS,
          'USER_PROVIDED_META_REDUCERS'
        );

      const changes: ReplaceChange[] = [];
      changes.push(
        ...findMetaReducersImportStatements(
          sourceFile,
          createChange,
          context.logger
        )
      );
      changes.push(...findMetaReducersAssignment(sourceFile, createChange));

      return commitChanges(tree, sourceFile.fileName, changes);
    });
  };
}

export default function (): Rule {
  return chain([updateMetaReducersToken()]);
}

function findMetaReducersImportStatements(
  sourceFile: ts.SourceFile,
  createChange: (node: ts.Node) => ReplaceChange,
  logger: any
) {
  let canRunSchematics = false;

  const metaReducerImports = sourceFile.statements
    .filter(ts.isImportDeclaration)
    .filter(isNgRxStoreImport)
    .filter((p) => {
      canRunSchematics = Boolean(
        p.importClause &&
          p.importClause.namedBindings &&
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          (p.importClause!.namedBindings as ts.NamedImports).elements
      );
      return canRunSchematics;
    })
    .map((p) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (p.importClause!.namedBindings! as ts.NamedImports).elements.filter(
        isMetaReducersImportSpecifier
      )
    )
    .reduce((imports, curr) => imports.concat(curr), []);

  const changes = metaReducerImports.map(createChange);
  if (!canRunSchematics && changes.length === 0) {
    logger.info(tags.stripIndent`
      NgRx 8 Migration: Unable to run the schematics to rename \`META_REDUCERS\` to \`USER_PROVIDED_META_REDUCERS\`
      in file '${sourceFile.fileName}'.

      For more info see https://ngrx.io/guide/migration/v8#meta_reducers-token.
    `);
  }

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
  const changes: ReplaceChange[] = [];
  ts.forEachChild(sourceFile, (node) => findMetaReducers(node, changes));
  return changes;

  function findMetaReducers(node: ts.Node, changes: ReplaceChange[]) {
    if (
      ts.isPropertyAssignment(node) &&
      node.initializer.getText(sourceFile) === META_REDUCERS
    ) {
      changes.push(createChange(node.initializer));
    }

    ts.forEachChild(node, (childNode) => findMetaReducers(childNode, changes));
  }
}

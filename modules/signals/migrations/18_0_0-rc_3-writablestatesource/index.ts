import * as ts from 'typescript';
import {
  Tree,
  Rule,
  chain,
  SchematicContext,
} from '@angular-devkit/schematics';
import {
  commitChanges,
  createReplaceChange,
  replaceImport,
  visitTSSourceFiles,
} from '../../schematics-core';
import { Path } from '@angular-devkit/core';

export function migrateWritableStateSource(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    let updateCounter = 0;
    ctx.logger.info(
      `[@ngrx/signals] Migrating 'StateSignal' to 'WritableStateSource'`
    );

    visitTSSourceFiles(tree, (sourceFile) => {
      const changes = replaceImport(
        sourceFile,
        sourceFile.fileName as Path,
        '@ngrx/signals',
        'StateSignal',
        'WritableStateSource'
      );

      if (changes.length) {
        visitIdentifiers(sourceFile, (node) => {
          if (
            node.getText() === 'StateSignal' &&
            !ts.isImportSpecifier(node.parent)
          ) {
            changes.push(
              createReplaceChange(
                sourceFile,
                node,
                'StateSignal',
                'WritableStateSource'
              )
            );
            updateCounter++;
          }
        });
      }

      commitChanges(tree, sourceFile.fileName, changes);
    });

    if (updateCounter) {
      ctx.logger.info(
        `[@ngrx/signals] Updated ${updateCounter} references from 'StateSignal' to 'WritableStateSource'`
      );
    } else {
      ctx.logger.info(
        `[@ngrx/signals] No 'StateSignal' refences found to, skipping the migration`
      );
    }
  };
}

function visitIdentifiers(
  node: ts.Node,
  visitor: (node: ts.Identifier) => void
) {
  if (ts.isIdentifier(node)) {
    visitor(node);
  }

  ts.forEachChild(node, (childNode) => visitIdentifiers(childNode, visitor));
}

export default function (): Rule {
  return chain([migrateWritableStateSource()]);
}

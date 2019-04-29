import * as ts from 'typescript';
import { Rule, chain, Tree } from '@angular-devkit/schematics';
import {
  ReplaceChange,
  createChangeRecorder,
  createReplaceChange,
  replaceImport,
} from '@ngrx/store/schematics-core';

const META_REDUCERS = 'META_REDUCERS';
const USER_PROVIDED_META_REDUCERS = 'USER_PROVIDED_META_REDUCERS';

function updateMetaReducersToken(): Rule {
  return (tree: Tree) => {
    tree.visit(path => {
      if (!path.endsWith('.ts')) {
        return;
      }

      const sourceFile = ts.createSourceFile(
        path,
        tree.read(path)!.toString(),
        ts.ScriptTarget.Latest
      );

      if (sourceFile.isDeclarationFile) {
        return;
      }

      const createChange = (node: ts.Node) =>
        createReplaceChange(
          sourceFile,
          path,
          node,
          META_REDUCERS,
          USER_PROVIDED_META_REDUCERS
        );

      const changes: ReplaceChange[] = [];
      changes.push(
        ...replaceImport(
          sourceFile,
          path,
          '@ngrx/store',
          META_REDUCERS,
          USER_PROVIDED_META_REDUCERS
        )
      );
      changes.push(...findMetaReducersAssignment(sourceFile, createChange));

      if (changes.length < 1) {
        return;
      }

      const recorder = createChangeRecorder(tree, path, changes);
      tree.commitUpdate(recorder);
    });
  };
}

export default function(): Rule {
  return chain([updateMetaReducersToken()]);
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

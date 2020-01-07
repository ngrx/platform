import * as ts from 'typescript';
import { Tree, DirEntry } from '@angular-devkit/schematics';

export function visitTSSourceFiles<Result = void>(
  tree: Tree,
  visitor: (
    sourceFile: ts.SourceFile,
    tree: Tree,
    result?: Result
  ) => Result | undefined
): Result | undefined {
  let result: Result | undefined = undefined;
  for (const sourceFile of visit(tree.root)) {
    result = visitor(sourceFile, tree, result);
  }

  return result;
}

function* visit(directory: DirEntry): IterableIterator<ts.SourceFile> {
  for (const path of directory.subfiles) {
    if (path.endsWith('.ts') && !path.endsWith('.d.ts')) {
      const entry = directory.file(path);
      if (entry) {
        const content = entry.content;
        const source = ts.createSourceFile(
          entry.path,
          content.toString().replace(/^\uFEFF/, ''),
          ts.ScriptTarget.Latest,
          true
        );
        yield source;
      }
    }
  }

  for (const path of directory.subdirs) {
    if (path === 'node_modules') {
      continue;
    }

    yield* visit(directory.dir(path));
  }
}

export function visitNgModuleImports(
  sourceFile: ts.SourceFile,
  callback: (
    importNode: ts.PropertyAssignment,
    elementExpressions: ts.NodeArray<ts.Expression>
  ) => void
) {
  ts.forEachChild(sourceFile, function findDecorator(node) {
    if (!ts.isDecorator(node)) {
      ts.forEachChild(node, findDecorator);
      return;
    }

    ts.forEachChild(node, function findImportsNode(n) {
      if (
        ts.isPropertyAssignment(n) &&
        ts.isArrayLiteralExpression(n.initializer) &&
        ts.isIdentifier(n.name) &&
        n.name.text === 'imports'
      ) {
        callback(n, n.initializer.elements);
      }

      ts.forEachChild(n, findImportsNode);
    });
  });
}

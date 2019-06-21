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

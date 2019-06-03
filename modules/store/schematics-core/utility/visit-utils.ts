import * as ts from 'typescript';
import { Tree } from '@angular-devkit/schematics';

export function visitTSSourceFiles<Result = void>(
  tree: Tree,
  visitor: (
    sourceFile: ts.SourceFile,
    tree: Tree,
    result?: Result
  ) => Result | undefined
): Result | undefined {
  let result: Result | undefined = undefined;

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

    result = visitor(sourceFile, tree, result);
  });

  return result;
}

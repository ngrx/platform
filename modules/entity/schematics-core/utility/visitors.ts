import * as ts from 'typescript';
import { normalize, resolve } from '@angular-devkit/core';
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

export function visitTemplates(
  tree: Tree,
  visitor: (
    template: {
      fileName: string;
      content: string;
      inline: boolean;
      start: number;
    },
    tree: Tree
  ) => void
): void {
  visitTSSourceFiles(tree, source => {
    visitComponents(source, (_, decoratorExpressionNode) => {
      ts.forEachChild(decoratorExpressionNode, function findTemplates(n) {
        if (ts.isPropertyAssignment(n) && ts.isIdentifier(n.name)) {
          if (
            n.name.text === 'template' &&
            ts.isStringLiteralLike(n.initializer)
          ) {
            // Need to add an offset of one to the start because the template quotes are
            // not part of the template content.
            const templateStartIdx = n.initializer.getStart() + 1;
            visitor(
              {
                fileName: source.fileName,
                content: n.initializer.text,
                inline: true,
                start: templateStartIdx,
              },
              tree
            );
            return;
          } else if (
            n.name.text === 'templateUrl' &&
            ts.isStringLiteralLike(n.initializer)
          ) {
            const parts = normalize(source.fileName)
              .split('/')
              .slice(0, -1);
            const templatePath = resolve(
              normalize(parts.join('/')),
              normalize(n.initializer.text)
            );
            if (!tree.exists(templatePath)) {
              return;
            }

            const fileContent = tree.read(templatePath);
            if (!fileContent) {
              return;
            }

            visitor(
              {
                fileName: templatePath,
                content: fileContent.toString(),
                inline: false,
                start: 0,
              },
              tree
            );
            return;
          }
        }

        ts.forEachChild(n, findTemplates);
      });
    });
  });
}

export function visitNgModuleImports(
  sourceFile: ts.SourceFile,
  callback: (
    importNode: ts.PropertyAssignment,
    elementExpressions: ts.NodeArray<ts.Expression>
  ) => void
) {
  visitNgModules(sourceFile, (_, decoratorExpressionNode) => {
    ts.forEachChild(decoratorExpressionNode, function findTemplates(n) {
      if (
        ts.isPropertyAssignment(n) &&
        ts.isIdentifier(n.name) &&
        n.name.text === 'imports' &&
        ts.isArrayLiteralExpression(n.initializer)
      ) {
        callback(n, n.initializer.elements);
        return;
      }

      ts.forEachChild(n, findTemplates);
    });
  });
}

export function visitComponents(
  sourceFile: ts.SourceFile,
  callback: (
    classDeclarationNode: ts.ClassDeclaration,
    decoratorExpressionNode: ts.ObjectLiteralExpression
  ) => void
) {
  visitDecorator(sourceFile, 'Component', callback);
}

export function visitNgModules(
  sourceFile: ts.SourceFile,
  callback: (
    classDeclarationNode: ts.ClassDeclaration,
    decoratorExpressionNode: ts.ObjectLiteralExpression
  ) => void
) {
  visitDecorator(sourceFile, 'NgModule', callback);
}

export function visitDecorator(
  sourceFile: ts.SourceFile,
  decoratorName: string,
  callback: (
    classDeclarationNode: ts.ClassDeclaration,
    decoratorExpressionNode: ts.ObjectLiteralExpression
  ) => void
) {
  ts.forEachChild(sourceFile, function findClassDeclaration(node) {
    if (!ts.isClassDeclaration(node)) {
      ts.forEachChild(node, findClassDeclaration);
    }

    const classDeclarationNode = node as ts.ClassDeclaration;

    if (
      !classDeclarationNode.decorators ||
      !classDeclarationNode.decorators.length
    ) {
      return;
    }

    const componentDecorator = classDeclarationNode.decorators.find(d => {
      return (
        ts.isCallExpression(d.expression) &&
        ts.isIdentifier(d.expression.expression) &&
        d.expression.expression.text === decoratorName
      );
    });

    if (!componentDecorator) {
      return;
    }

    const { expression } = componentDecorator;
    if (!ts.isCallExpression(expression)) {
      return;
    }

    const [arg] = expression.arguments;
    if (!ts.isObjectLiteralExpression(arg)) {
      return;
    }

    callback(classDeclarationNode, arg);
  });
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

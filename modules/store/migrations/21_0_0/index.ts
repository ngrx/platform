import * as ts from 'typescript';
import {
  Rule,
  SchematicContext,
  Tree,
  chain,
} from '@angular-devkit/schematics';
import {
  Change,
  commitChanges,
  createReplaceChange,
  visitTSSourceFiles,
} from '../../schematics-core';
import { createRemoveChange } from '../../schematics-core/utility/change';

const removedTypes = ['SelectorWithProps', 'MemoizedSelectorWithProps'];

/**
 * Remove `SelectorWithProps` and `MemoizedSelectorWithProps` from
 * `@ngrx/store` imports.
 */
export function migrateRemoveSelectorWithPropsImports(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      const changes: Change[] = [];

      const importDeclarations = sourceFile.statements.filter(
        ts.isImportDeclaration
      );

      for (const importDecl of importDeclarations) {
        const moduleSpecifier = importDecl.moduleSpecifier;
        if (
          !ts.isStringLiteral(moduleSpecifier) ||
          moduleSpecifier.text !== '@ngrx/store'
        ) {
          continue;
        }

        const namedBindings = importDecl.importClause?.namedBindings;
        if (!namedBindings || !ts.isNamedImports(namedBindings)) {
          continue;
        }

        const removedElements = namedBindings.elements.filter((el) =>
          removedTypes.includes(
            (el.propertyName ?? el.name).getText(sourceFile)
          )
        );

        if (removedElements.length === 0) {
          continue;
        }

        const remainingElements = namedBindings.elements.filter(
          (el) =>
            !removedTypes.includes(
              (el.propertyName ?? el.name).getText(sourceFile)
            )
        );

        if (remainingElements.length === 0) {
          changes.push(
            createRemoveChange(
              sourceFile,
              importDecl,
              importDecl.getStart(sourceFile),
              importDecl.getEnd() + 1
            )
          );
        } else {
          const remainingImports = remainingElements
            .map((el) => el.getText(sourceFile))
            .join(', ');
          const quote = importDecl.moduleSpecifier
            .getText(sourceFile)
            .charAt(0);
          const newImport = `import { ${remainingImports} } from ${quote}@ngrx/store${quote};`;
          changes.push(
            createReplaceChange(
              sourceFile,
              importDecl,
              importDecl.getText(sourceFile),
              newImport
            )
          );
        }

        const removedNames = removedElements.map((el) =>
          (el.propertyName ?? el.name).getText(sourceFile)
        );
        ctx.logger.info(
          `[@ngrx/store] ${sourceFile.fileName}: Removed ${removedNames.join(', ')} import(s)`
        );
      }

      if (changes.length) {
        commitChanges(tree, sourceFile.fileName, changes);
      }
    });
  };
}

/**
 * Convert string-key `select('key')` calls to
 * `select((state: any) => state['key'])` and warn about
 * `select(selector, props)` calls that require manual migration.
 */
export function migrateSelectCalls(): Rule {
  return (tree: Tree, ctx: SchematicContext) => {
    visitTSSourceFiles(tree, (sourceFile) => {
      // Only process files that import from @ngrx/store
      const hasStoreImport = sourceFile.statements.some(
        (stmt) =>
          ts.isImportDeclaration(stmt) &&
          ts.isStringLiteral(stmt.moduleSpecifier) &&
          stmt.moduleSpecifier.text === '@ngrx/store'
      );
      if (!hasStoreImport) {
        return;
      }

      const changes: Change[] = [];
      visitCallExpressions(sourceFile, (node) => {
        if (!ts.isCallExpression(node)) {
          return;
        }

        const name = getSelectCallName(node);
        if (!name) {
          return;
        }

        const args = node.arguments;
        if (args.length === 0) {
          return;
        }

        const firstArg = args[0];

        // Case 1: select('stringKey') or store.select('stringKey')
        if (ts.isStringLiteral(firstArg) && args.length === 1) {
          const key = firstArg.text;
          const replacement = `(state: any) => state['${key}']`;
          changes.push(
            createReplaceChange(
              sourceFile,
              firstArg,
              firstArg.getText(sourceFile),
              replacement
            )
          );
          ctx.logger.info(
            `[@ngrx/store] ${sourceFile.fileName}: Migrated string-key ${name}('${key}') to use a selector function`
          );
          return;
        }

        // Case 2: select('key1', 'key2', ...) — nested string keys
        if (
          ts.isStringLiteral(firstArg) &&
          args.length > 1 &&
          args.every((a) => ts.isStringLiteral(a))
        ) {
          const keys = args.map((a) => (a as ts.StringLiteral).text);
          const chain = keys.map((k) => `['${k}']`).join('');
          const replacement = `(state: any) => state${chain}`;
          // Replace from first arg to last arg
          const fullText = args.map((a) => a.getText(sourceFile)).join(', ');
          changes.push(
            createReplaceChange(sourceFile, firstArg, fullText, replacement)
          );
          ctx.logger.info(
            `[@ngrx/store] ${sourceFile.fileName}: Migrated nested string-key ${name}(${keys.map((k) => `'${k}'`).join(', ')}) to use a selector function`
          );
          return;
        }

        // Case 3: select(selectorFn, propsArg) — selector with props
        // This cannot be safely auto-migrated. Warn the user.
        if (args.length >= 2 && !ts.isStringLiteral(firstArg)) {
          const line =
            sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile))
              .line + 1;
          ctx.logger.warn(
            `[@ngrx/store] ${sourceFile.fileName}:${line}: ` +
              `Found ${name}(selector, props) call that requires manual migration. ` +
              `Convert to a factory selector pattern. See https://ngrx.io/guide/migration/v21`
          );
        }
      });

      if (changes.length) {
        commitChanges(tree, sourceFile.fileName, changes);
      }
    });
  };
}

function getSelectCallName(node: ts.CallExpression): string | null {
  const expr = node.expression;

  // select(...)
  if (ts.isIdentifier(expr) && expr.text === 'select') {
    return 'select';
  }

  // something.select(...)
  if (
    ts.isPropertyAccessExpression(expr) &&
    ts.isIdentifier(expr.name) &&
    expr.name.text === 'select'
  ) {
    return 'select';
  }

  return null;
}

function visitCallExpressions(
  node: ts.Node,
  visitor: (node: ts.Node) => void
): void {
  if (ts.isCallExpression(node)) {
    visitor(node);
  }
  ts.forEachChild(node, (child) => visitCallExpressions(child, visitor));
}

export default function (): Rule {
  return chain([migrateRemoveSelectorWithPropsImports(), migrateSelectCalls()]);
}

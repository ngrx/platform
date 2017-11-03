import * as ts from 'typescript';
import { ActionInterface, getActionName } from '../action-interface';

export function printImportDeclaration(
  filename: string,
  actions: ActionInterface[]
) {
  return ts.createImportDeclaration(
    undefined,
    undefined,
    ts.createImportClause(
      undefined,
      ts.createNamedImports(
        actions
          .map(getActionName)
          .map(name =>
            ts.createImportSpecifier(undefined, ts.createIdentifier(name))
          )
      )
    ),
    ts.createIdentifier(`'./${filename}'`)
  );
}

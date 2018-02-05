import * as ts from 'typescript';

export function isActionDescendent(
  statement: ts.InterfaceDeclaration
): boolean {
  const heritageClauses = statement.heritageClauses;

  if (heritageClauses) {
    return heritageClauses.some(clause => {
      /**
       * TODO: This breaks if the interface looks like this:
       *
       *   interface MyAction extends ngrx.Action { }
       *
       */
      return clause.types.some(type => type.expression.getText() === 'Action');
    });
  }

  return false;
}

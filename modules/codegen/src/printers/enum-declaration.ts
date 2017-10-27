import * as ts from 'typescript';
import {
  ActionInterface,
  getActionEnumName,
  getActionEnumPropName,
  getActionType,
} from '../action-interface';

export function printEnumDeclaration(actions: ActionInterface[]) {
  const [firstInterface] = actions;

  return ts.createEnumDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    getActionEnumName(firstInterface),
    actions
      .map(action => ({
        prop: getActionEnumPropName(action),
        value: getActionType(action),
      }))
      .map(({ prop, value }) => {
        return ts.createEnumMember(prop, ts.createLiteral(value));
      })
  );
}

import * as ts from 'typescript';
import {
  ActionInterface,
  getActionName,
  getActionUnionName,
} from '../action-interface';

export function printTypeUnionDeclaration(actions: ActionInterface[]) {
  const [firstAction] = actions;

  return ts.createTypeAliasDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    getActionUnionName(firstAction),
    undefined,
    ts.createUnionTypeNode(
      actions
        .map(getActionName)
        .map(name => ts.createTypeReferenceNode(name, undefined))
    )
  );
}

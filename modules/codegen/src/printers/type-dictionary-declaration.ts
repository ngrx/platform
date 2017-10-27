import * as ts from 'typescript';
import {
  ActionInterface,
  getActionLookupName,
  getActionType,
  getActionName,
} from '../action-interface';

export function printTypeDictionaryDeclaration(actions: ActionInterface[]) {
  const [firstAction] = actions;

  return ts.createTypeAliasDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    getActionLookupName(firstAction),
    undefined,
    ts.createTypeLiteralNode(
      actions.map(action => {
        return ts.createPropertySignature(
          undefined,
          JSON.stringify(getActionType(action)),
          undefined,
          ts.createTypeReferenceNode(getActionName(action), undefined),
          undefined
        );
      })
    )
  );
}

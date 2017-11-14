import * as ts from 'typescript';
import {
  ActionInterface,
  getActionFactoryName,
  getActionName,
  getActionEnumName,
  getActionEnumPropName,
} from '../action-interface';

export function printActionFactoryDeclaration(action: ActionInterface) {
  return ts.createFunctionDeclaration(
    undefined,
    [ts.createToken(ts.SyntaxKind.ExportKeyword)],
    undefined,
    getActionFactoryName(action),
    undefined,
    action.properties.map(({ name, required }) => {
      return ts.createParameter(
        undefined,
        undefined,
        undefined,
        name,
        required ? undefined : ts.createToken(ts.SyntaxKind.QuestionToken),
        ts.createTypeReferenceNode(
          `${getActionName(action)}["${name}"]`,
          undefined
        ),
        undefined
      );
    }),
    ts.createTypeReferenceNode(getActionName(action), undefined),
    ts.createBlock(
      [
        ts.createReturn(
          ts.createObjectLiteral([
            ts.createPropertyAssignment(
              'type',
              ts.createPropertyAccess(
                ts.createIdentifier(getActionEnumName(action)),
                ts.createIdentifier(getActionEnumPropName(action))
              )
            ),
            ...action.properties.map(({ name }) => {
              return ts.createShorthandPropertyAssignment(name, undefined);
            }),
          ])
        ),
      ],
      true
    )
  );
}

import * as ts from 'typescript';
import { getProperties } from './get-properties';

export function getType(
  action: ts.InterfaceDeclaration
): ts.LiteralTypeNode | undefined {
  const typeProperty = getProperties(action).find(
    property => property.name.getText() === 'type'
  );

  if (!typeProperty) {
    return undefined;
  }

  return ts.isLiteralTypeNode(typeProperty.type as any)
    ? (typeProperty.type as any)
    : undefined;

  // return !!typeProperty && ts.isLiteralTypeNode(typeProperty.type) ? typeProperty.type : undefined;
}

import * as ts from 'typescript';

export function getProperties(
  node: ts.InterfaceDeclaration
): ts.PropertySignature[] {
  return node.members.filter(ts.isPropertySignature);
}

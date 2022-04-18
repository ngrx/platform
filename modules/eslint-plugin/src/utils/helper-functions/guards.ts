import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { AST_NODE_TYPES } from '@typescript-eslint/experimental-utils';
import type * as ts from 'typescript';

const isNodeOfType =
  <NodeType extends AST_NODE_TYPES>(nodeType: NodeType) =>
  (node: TSESTree.Node): node is TSESTree.Node & { type: NodeType } =>
    node.type === nodeType;

export const isArrowFunctionExpression = isNodeOfType(
  AST_NODE_TYPES.ArrowFunctionExpression
);
export const isReturnStatement = isNodeOfType(AST_NODE_TYPES.ReturnStatement);
export const isMethodDefinition = isNodeOfType(AST_NODE_TYPES.MethodDefinition);
export const isCallExpression = isNodeOfType(AST_NODE_TYPES.CallExpression);
export const isClassDeclaration = isNodeOfType(AST_NODE_TYPES.ClassDeclaration);
export const isPropertyDefinition = isNodeOfType(
  AST_NODE_TYPES.PropertyDefinition
);
export const isFunctionExpression = isNodeOfType(
  AST_NODE_TYPES.FunctionExpression
);
export const isIdentifier = isNodeOfType(AST_NODE_TYPES.Identifier);
export const isImportDeclaration = isNodeOfType(
  AST_NODE_TYPES.ImportDeclaration
);
export const isImportDefaultSpecifier = isNodeOfType(
  AST_NODE_TYPES.ImportDefaultSpecifier
);
export const isImportNamespaceSpecifier = isNodeOfType(
  AST_NODE_TYPES.ImportNamespaceSpecifier
);
export const isImportSpecifier = isNodeOfType(AST_NODE_TYPES.ImportSpecifier);
export const isLiteral = isNodeOfType(AST_NODE_TYPES.Literal);
export const isTemplateElement = isNodeOfType(AST_NODE_TYPES.TemplateElement);
export const isTemplateLiteral = isNodeOfType(AST_NODE_TYPES.TemplateLiteral);
export const isMemberExpression = isNodeOfType(AST_NODE_TYPES.MemberExpression);
export const isProgram = isNodeOfType(AST_NODE_TYPES.Program);
export const isThisExpression = isNodeOfType(AST_NODE_TYPES.ThisExpression);
export const isTSParameterProperty = isNodeOfType(
  AST_NODE_TYPES.TSParameterProperty
);
export const isTSTypeAnnotation = isNodeOfType(AST_NODE_TYPES.TSTypeAnnotation);
export const isTSTypeReference = isNodeOfType(AST_NODE_TYPES.TSTypeReference);
export const isObjectExpression = isNodeOfType(AST_NODE_TYPES.ObjectExpression);
export const isProperty = isNodeOfType(AST_NODE_TYPES.Property);

export function isIdentifierOrMemberExpression(
  node: TSESTree.Node
): node is TSESTree.Identifier | TSESTree.MemberExpression {
  return isIdentifier(node) || isMemberExpression(node);
}

export function isTypeReference(type: ts.Type): type is ts.TypeReference {
  return type.hasOwnProperty('target');
}

function equalTo(one: RegExp | string, other: string) {
  return typeof one === 'string' ? one === other : one.test(other);
}

export function isCallExpressionWith(
  node: TSESTree.CallExpression,
  objectName: RegExp | string,
  propertyName: string
) {
  return (
    isMemberExpression(node.callee) &&
    !node.callee.computed &&
    node.callee.property.name === propertyName &&
    ((isIdentifier(node.callee.object) &&
      equalTo(objectName, node.callee.object.name)) ||
      (isMemberExpression(node.callee.object) &&
        isThisExpression(node.callee.object.object) &&
        isIdentifier(node.callee.object.property) &&
        equalTo(objectName, node.callee.object.property.name)))
  );
}

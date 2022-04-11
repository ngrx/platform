import type { TSESTree } from '@typescript-eslint/experimental-utils';
import { getTypeServices } from 'eslint-etc';
import * as path from 'path';
import * as ts from 'typescript';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  createEffectExpression,
  getNgRxEffectActions,
  isCallExpression,
  isIdentifier,
  isTypeReference,
} from '../../utils';

export const messageId = 'avoidCyclicEffects';

type MessageIds = typeof messageId;
type Options = readonly [];

// This rule is a modified version (to support dispatch: false) from the eslint-plugin-rxjs plugin.
// The original implementation can be found at https://github.com/cartant/eslint-plugin-rxjs/blob/main/source/rules/no-cyclic-action.ts
// Thank you Nicholas Jamieson (@cartant).

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    ngrxModule: 'effects',
    docs: {
      description: 'Avoid `Effect` that re-emit filtered actions.',
      recommended: 'warn',
      requiresTypeChecking: true,
    },
    schema: [],
    messages: {
      [messageId]: '`Effect` that re-emit filtered actions are forbidden.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxEffectActions(context);
    const actionsNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!actionsNames) {
      return {};
    }

    const { getType, typeChecker } = getTypeServices(context);

    function checkNode(pipeCallExpression: TSESTree.CallExpression) {
      const operatorCallExpression = pipeCallExpression.arguments.find(
        (arg) =>
          isCallExpression(arg) &&
          isIdentifier(arg.callee) &&
          arg.callee.name === 'ofType'
      );
      if (!operatorCallExpression) {
        return;
      }
      const operatorType = getType(operatorCallExpression);
      const [signature] = typeChecker.getSignaturesOfType(
        operatorType,
        ts.SignatureKind.Call
      );

      if (!signature) {
        return;
      }
      const operatorReturnType =
        typeChecker.getReturnTypeOfSignature(signature);
      if (!isTypeReference(operatorReturnType)) {
        return;
      }
      const [operatorElementType] =
        typeChecker.getTypeArguments(operatorReturnType);
      if (!operatorElementType) {
        return;
      }

      const pipeType = getType(pipeCallExpression);
      if (!isTypeReference(pipeType)) {
        return;
      }
      const [pipeElementType] = typeChecker.getTypeArguments(pipeType);
      if (!pipeElementType) {
        return;
      }

      const operatorActionTypes = getActionTypes(operatorElementType);
      const pipeActionTypes = getActionTypes(pipeElementType);

      for (const actionType of operatorActionTypes) {
        if (pipeActionTypes.includes(actionType)) {
          context.report({
            node: pipeCallExpression.callee,
            messageId,
          });
          return;
        }
      }
    }

    function getActionType(symbol: ts.Symbol): ts.Type | null {
      const { valueDeclaration } = symbol;

      if (!valueDeclaration) {
        return null;
      }

      if (valueDeclaration.kind === ts.SyntaxKind.PropertyDeclaration) {
        const { parent } = symbol as typeof symbol & { parent: ts.Symbol };
        return parent.valueDeclaration
          ? typeChecker.getTypeOfSymbolAtLocation(
              parent,
              parent.valueDeclaration
            )
          : null;
      }

      return typeChecker.getTypeOfSymbolAtLocation(symbol, valueDeclaration);
    }

    function getActionTypes(type: ts.Type): string[] {
      if (type.isUnion()) {
        const memberActionTypes: string[] = [];
        for (const memberType of type.types) {
          memberActionTypes.push(...getActionTypes(memberType));
        }
        return memberActionTypes;
      }

      const symbol = typeChecker.getPropertyOfType(type, 'type');

      if (!symbol) {
        return [];
      }

      const actionType = getActionType(symbol);

      if (!actionType) {
        return [];
      }

      // TODO: support "dynamic" types
      // e.g. const genericFoo = createAction(`${subject} FOO`); (resolves to 'string')
      if (typeChecker.typeToString(actionType) === 'string') {
        return [];
      }
      return [typeChecker.typeToString(actionType)];
    }

    return {
      [`${createEffectExpression}:not([arguments.1]:has(Property[key.name='dispatch'][value.value=false])) CallExpression[callee.property.name='pipe'][callee.object.property.name=${actionsNames}]`]:
        checkNode,
    };
  },
});

import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  getNgRxStores,
  isPropertyDefinition,
  isTSTypeReference,
  isCallExpression,
  isTSInstantiationExpression,
} from '../../utils';
import type { TSESTree } from '@typescript-eslint/experimental-utils';

export const noTypedStore = 'noTypedStore';
export const noTypedStoreSuggest = 'noTypedStoreSuggest';

type MessageIds = typeof noTypedStore | typeof noTypedStoreSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description: 'The global store should not be typed.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [],
    messages: {
      [noTypedStore]:
        '`Store` should not be typed, use `Store` (without generic) instead.',
      [noTypedStoreSuggest]: 'Remove generic from `Store`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      Program() {
        const { identifiers = [] } = getNgRxStores(context);

        for (const identifier of identifiers) {
          // using inject()
          if (!identifier.typeAnnotation) {
            const { parent } = identifier;
            if (
              isPropertyDefinition(parent) &&
              parent.value &&
              isCallExpression(parent.value) &&
              parent.value.arguments.length
            ) {
              const [storeArgument] = parent.value.arguments;
              if (isTSInstantiationExpression(storeArgument)) {
                report(storeArgument.typeParameters);
              }
            }

            continue;
          }

          if (
            !isTSTypeReference(identifier.typeAnnotation.typeAnnotation) ||
            !identifier.typeAnnotation.typeAnnotation.typeParameters
          ) {
            continue;
          }

          report(identifier.typeAnnotation.typeAnnotation.typeParameters);
        }
      },
    };

    function report(typeParameters: TSESTree.TSTypeParameterInstantiation) {
      context.report({
        node: typeParameters,
        messageId: noTypedStore,
        suggest: [
          {
            messageId: noTypedStoreSuggest,
            fix: (fixer) => fixer.remove(typeParameters),
          },
        ],
      });
    }
  },
});

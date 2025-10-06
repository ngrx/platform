import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  getNgRxStores,
  isPropertyDefinition,
  isTSTypeReference,
  isCallExpression,
  isTSInstantiationExpression,
} from '../../utils';
import type { TSESTree } from '@typescript-eslint/utils';

export const noTypedStore = 'noTypedStore';
export const noTypedStoreSuggest = 'noTypedStoreSuggest';

type MessageIds = typeof noTypedStore | typeof noTypedStoreSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    docs: {
      description: 'The global store should not be typed.',
      ngrxModule: 'store',
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
                report(storeArgument.typeArguments);
              }
            }

            continue;
          }

          if (
            !isTSTypeReference(identifier.typeAnnotation.typeAnnotation) ||
            !identifier.typeAnnotation.typeAnnotation.typeArguments
          ) {
            continue;
          }

          report(identifier.typeAnnotation.typeAnnotation.typeArguments);
        }
      },
    };

    function report(typeArguments: TSESTree.TSTypeParameterInstantiation) {
      context.report({
        node: typeArguments,
        messageId: noTypedStore,
        suggest: [
          {
            messageId: noTypedStoreSuggest,
            fix: (fixer) => fixer.remove(typeArguments),
          },
        ],
      });
    }
  },
});

import * as path from 'path';
import { createRule } from '../../rule-creator';
import { getNgRxStores, isTSTypeReference } from '../../utils';

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

        for (const {
          typeAnnotation: { typeAnnotation },
        } of identifiers) {
          if (
            !isTSTypeReference(typeAnnotation) ||
            !typeAnnotation.typeParameters
          ) {
            continue;
          }

          const { typeParameters } = typeAnnotation;

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
    };
  },
});

import * as path from 'path';
import { createRule } from '../../rule-creator';
import { getNgRxStores } from '../../utils';

export const useConsistentGlobalStoreName = 'useConsistentGlobalStoreName';
export const useConsistentGlobalStoreNameSuggest =
  'useConsistentGlobalStoreNameSuggest';

type MessageIds =
  | typeof useConsistentGlobalStoreName
  | typeof useConsistentGlobalStoreNameSuggest;
type Options = readonly [string];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description: 'Use a consistent name for the global store.',
      recommended: 'warn',
      suggestion: true,
    },
    schema: [
      {
        type: 'string',
        additionalProperties: false,
      },
    ],
    messages: {
      [useConsistentGlobalStoreName]:
        'Global store should be named as `{{ storeName }}`.',
      [useConsistentGlobalStoreNameSuggest]: 'Rename it to `{{ storeName }}`.',
    },
  },
  defaultOptions: ['store'],
  create: (context, [storeName]) => {
    return {
      Program() {
        const { identifiers = [] } = getNgRxStores(context);

        for (const { loc, name, range, typeAnnotation } of identifiers) {
          if (name === storeName) {
            return;
          }

          const data = { storeName };
          context.report({
            loc: {
              ...loc,
              end: {
                ...loc.start,
                column: loc.start.column + name.length,
              },
            },
            messageId: useConsistentGlobalStoreName,
            data,
            suggest: [
              {
                messageId: useConsistentGlobalStoreNameSuggest,
                data,
                fix: (fixer) =>
                  fixer.replaceTextRange(
                    [range[0], typeAnnotation.range[0]],
                    storeName
                  ),
              },
            ],
          });
        }
      },
    };
  },
});

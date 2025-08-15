import type { TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import { capitalize } from '../../utils';

export const prefixSelectorsWithSelect = 'prefixSelectorsWithSelect';
export const prefixSelectorsWithSelectSuggest =
  'prefixSelectorsWithSelectSuggest';

type MessageIds =
  | typeof prefixSelectorsWithSelect
  | typeof prefixSelectorsWithSelectSuggest;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    hasSuggestions: true,
    ngrxModule: 'store',
    docs: {
      description:
        'The selector should start with "select", for example "selectEntity".',
    },
    schema: [],
    messages: {
      [prefixSelectorsWithSelect]: 'The selector should start with "select".',
      [prefixSelectorsWithSelectSuggest]:
        'Prefix the selector with "select": `{{ name }}`.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    return {
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        const { id } = node;

        // Handle destructuring: { selectAll: selectAllBooks }
        if (id.type === 'ObjectPattern') {
          for (const prop of id.properties) {
            if (
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.value.type === 'Identifier'
            ) {
              const originalName = prop.value.name;
              if (!/^select[^a-z]/.test(originalName)) {
                const suggestedName = getSuggestedName(originalName);
                context.report({
                  node: prop.value,
                  messageId: prefixSelectorsWithSelect,
                  suggest: [
                    {
                      messageId: prefixSelectorsWithSelectSuggest,
                      data: { name: suggestedName },
                      fix: (fixer) =>
                        fixer.replaceText(prop.value, suggestedName),
                    },
                  ],
                });
              }
            }
          }
        }

        // Handle regular selector declarations
        if (
          id.type === 'Identifier' &&
          !/^select[^a-z]/.test(id.name) &&
          id.typeAnnotation &&
          id.typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
          id.typeAnnotation.typeAnnotation.typeName.type === 'Identifier' &&
          /^MemoizedSelector(WithProps)?$/.test(
            id.typeAnnotation.typeAnnotation.typeName.name
          )
        ) {
          const suggestedName = getSuggestedName(id.name);
          context.report({
            node: id,
            messageId: prefixSelectorsWithSelect,
            suggest: [
              {
                messageId: prefixSelectorsWithSelectSuggest,
                data: { name: suggestedName },
                fix: (fixer) => fixer.replaceText(id, suggestedName),
              },
            ],
          });
        }
      },
    };
  },
});

function getSuggestedName(name: string): string {
  if (typeof name !== 'string') return 'selectUnknown';

  const selectWord = 'select';

  // Case 1: Already starts with "select" but needs capitalization
  let possibleReplacedName = name.replace(
    new RegExp(`^${selectWord}(.+)`),
    (_, word: string) => `${selectWord}${capitalize(word)}`
  );
  if (name !== possibleReplacedName) return possibleReplacedName;

  // Case 2: Starts with "get"
  possibleReplacedName = name.replace(/^get([^a-z].+)/, (_, word: string) => {
    return `${selectWord}${capitalize(word)}`;
  });
  if (name !== possibleReplacedName) return possibleReplacedName;

  // Case 3: No prefix
  return `${selectWord}${capitalize(name)}`;
}

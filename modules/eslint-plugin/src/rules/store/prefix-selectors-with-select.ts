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
    function reportIfInvalid(name: string, node: TSESTree.Identifier) {
      if (!/^select[^a-z]/.test(name)) {
        const suggestedName = getSuggestedName(name);
        context.report({
          node,
          messageId: prefixSelectorsWithSelect,
          suggest: [
            {
              messageId: prefixSelectorsWithSelectSuggest,
              data: { name: suggestedName },
              fix: (fixer) => fixer.replaceText(node, suggestedName),
            },
          ],
        });
      }
    }

    return {
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        const { id, init } = node;

        // Case 1: Destructuring from getSelectors()
        if (
          id.type === 'ObjectPattern' &&
          init?.type === 'CallExpression' &&
          init.callee.type === 'Identifier' &&
          init.callee.name === 'getSelectors'
        ) {
          for (const prop of id.properties) {
            if (
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.value.type === 'Identifier'
            ) {
              reportIfInvalid(prop.value.name, prop.value);
            }
          }
        }

        // Case 2: Destructuring from any object
        if (id.type === 'ObjectPattern') {
          for (const prop of id.properties) {
            if (
              prop.type === 'Property' &&
              prop.key.type === 'Identifier' &&
              prop.value.type === 'Identifier'
            ) {
              reportIfInvalid(prop.value.name, prop.value);
            }
          }
        }

        // Case 3: Regular selector declaration with MemoizedSelector type
        if (
          id.type === 'Identifier' &&
          id.typeAnnotation &&
          id.typeAnnotation.typeAnnotation.type === 'TSTypeReference' &&
          id.typeAnnotation.typeAnnotation.typeName.type === 'Identifier' &&
          /^MemoizedSelector(WithProps)?$/.test(
            id.typeAnnotation.typeAnnotation.typeName.name
          )
        ) {
          reportIfInvalid(id.name, id);
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

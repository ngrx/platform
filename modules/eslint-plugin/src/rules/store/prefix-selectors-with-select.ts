import type { TSESTree } from '@typescript-eslint/experimental-utils';
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
        'The selector should start with "select", for example "selectThing".',
      recommended: 'warn',
      suggestion: true,
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
      'VariableDeclarator[id.name!=/^select[^a-z].+$/]:matches([id.typeAnnotation.typeAnnotation.typeName.name=/^MemoizedSelector(WithProps)?$/], :has(CallExpression[callee.name=/^(create(Feature)?Selector|createSelectorFactory)$/]))'({
        id,
      }: TSESTree.VariableDeclarator & { id: TSESTree.Identifier }) {
        const suggestedName = getSuggestedName(id.name);
        context.report({
          loc: {
            ...id.loc,
            end: {
              ...id.loc.end,
              column: (id.typeAnnotation?.range[0] ?? id.range[1]) - 1,
            },
          },
          messageId: prefixSelectorsWithSelect,
          suggest: [
            {
              messageId: prefixSelectorsWithSelectSuggest,
              data: {
                name: suggestedName,
              },
              fix: (fixer) =>
                fixer.replaceTextRange(
                  [id.range[0], id.typeAnnotation?.range[0] ?? id.range[1]],
                  suggestedName
                ),
            },
          ],
        });
      },
    };
  },
});

function getSuggestedName(name: string) {
  const selectWord = 'select';
  // Ex: 'selectfeature' => 'selectFeature'
  let possibleReplacedName = name.replace(
    new RegExp(`^${selectWord}(.+)`),
    (_, word: string) => {
      return `${selectWord}${capitalize(word)}`;
    }
  );

  if (name !== possibleReplacedName) {
    return possibleReplacedName;
  }

  // Ex: 'getCount' => 'selectCount'
  possibleReplacedName = name.replace(/^get([^a-z].+)/, (_, word: string) => {
    return `${selectWord}${capitalize(word)}`;
  });

  if (name !== possibleReplacedName) {
    return possibleReplacedName;
  }

  // Ex: 'item' => 'selectItem'
  return `${selectWord}${capitalize(name)}`;
}

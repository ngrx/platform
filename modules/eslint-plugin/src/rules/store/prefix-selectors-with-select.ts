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
      if (!name.startsWith('select')) {
        const suggestedName = getSuggestedName(name);
        context.report({
          node,
          loc: {
            start: node.loc.start,
            end: {
              line: node.loc.start.line,
              column: node.loc.start.column + name.length,
            },
          },
          messageId: prefixSelectorsWithSelect,
          suggest: [
            {
              messageId: prefixSelectorsWithSelectSuggest,
              data: { name: suggestedName },
              fix: (fixer) => {
                const sourceCode = context.sourceCode;
                const parent = node.parent;

                if (
                  parent &&
                  parent.type === 'VariableDeclarator' &&
                  parent.id.type === 'Identifier'
                ) {
                  const fullText = sourceCode.getText(parent.id);
                  const updatedText = fullText.replace(
                    node.name,
                    suggestedName
                  );
                  return fixer.replaceText(parent.id, updatedText);
                }

                return fixer.replaceText(node, suggestedName);
              },
            },
          ],
        });
      }
    }

    return {
      VariableDeclarator(node: TSESTree.VariableDeclarator) {
        const { id, init } = node;

        const isSelectorSource =
          init?.type === 'CallExpression' &&
          ((init.callee.type === 'Identifier' &&
            init.callee.name === 'getSelectors') ||
            (init.callee.type === 'MemberExpression' &&
              init.callee.property.type === 'Identifier' &&
              init.callee.property.name === 'getSelectors'));

        if (id.type === 'ObjectPattern' && isSelectorSource) {
          for (const prop of id.properties) {
            if (prop.type === 'Property' && prop.value.type === 'Identifier') {
              reportIfInvalid(prop.value.name, prop.value);
            }
          }
          return; // Early exit to prevent duplicate lint errors when handling ObjectPattern selectors
        }

        if (
          id.type === 'Identifier' &&
          id.typeAnnotation?.typeAnnotation.type === 'TSTypeReference' &&
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
  if (typeof name !== 'string') {
    return 'selectUnknown';
  }

  const selectWord = 'select';

  // Case 1: Already starts with "select" isn't pascal-case
  let possibleReplacedName = name.replace(
    new RegExp(`^${selectWord}(.+)`),
    (_, word: string) => `${selectWord}${capitalize(word)}`
  );

  if (name !== possibleReplacedName) {
    return possibleReplacedName;
  }

  // Case 2: Starts with "get"
  possibleReplacedName = name.replace(/^get([^a-z].+)/, (_, word: string) => {
    return `${selectWord}${capitalize(word)}`;
  });

  if (name !== possibleReplacedName) {
    return possibleReplacedName;
  }

  // Case 3: No prefix
  return `${selectWord}${capitalize(name)}`;
}

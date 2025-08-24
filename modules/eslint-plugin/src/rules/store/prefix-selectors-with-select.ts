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
      const isValid =
        name.startsWith('select') &&
        name.length > 'select'.length &&
        /^[A-Z_$]/.test(name.slice('select'.length));

      if (!isValid) {
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
                  const updatedText = fullText.replace(name, suggestedName);
                  return fixer.replaceText(parent.id, updatedText);
                }

                return fixer.replaceText(node, suggestedName);
              },
            },
          ],
        });
      }
    }

    function isSelectorFactoryCall(node: TSESTree.CallExpression): boolean {
      const callee = node.callee;
      return (
        callee.type === 'Identifier' &&
        [
          'createSelector',
          'createFeatureSelector',
          'createSelectorFactory',
        ].includes(callee.name)
      );
    }

    function checkFunctionBody(
      name: string,
      node: TSESTree.Identifier,
      body: TSESTree.BlockStatement | TSESTree.Expression
    ) {
      if (body.type === 'CallExpression' && isSelectorFactoryCall(body)) {
        reportIfInvalid(name, node);
      }

      if (body.type === 'BlockStatement') {
        for (const stmt of body.body) {
          if (
            stmt.type === 'ReturnStatement' &&
            stmt.argument &&
            stmt.argument.type === 'CallExpression' &&
            isSelectorFactoryCall(stmt.argument)
          ) {
            reportIfInvalid(name, node);
          }
        }
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
          return;
        }

        if (id.type === 'Identifier') {
          const hasSelectorType =
            node.id.typeAnnotation?.typeAnnotation.type === 'TSTypeReference' &&
            node.id.typeAnnotation.typeAnnotation.typeName.type ===
              'Identifier' &&
            /^MemoizedSelector(WithProps)?$/.test(
              node.id.typeAnnotation.typeAnnotation.typeName.name
            );

          const isSelectorCall =
            init?.type === 'CallExpression' && isSelectorFactoryCall(init);

          const isArrowFunction =
            init?.type === 'ArrowFunctionExpression' &&
            init.body &&
            (init.body.type === 'CallExpression' ||
              init.body.type === 'BlockStatement');

          const isFunctionExpression =
            init?.type === 'FunctionExpression' &&
            init.body &&
            init.body.type === 'BlockStatement';

          if (hasSelectorType || isSelectorCall) {
            reportIfInvalid(id.name, id);
          } else if (isArrowFunction || isFunctionExpression) {
            checkFunctionBody(id.name, id, init.body);
          }
        }
      },
    };
  },
});

function getSuggestedName(name: string): string {
  const selectWord = 'select';

  // Case 1: Already starts with "select" but not properly capitalized
  if (name.startsWith(selectWord)) {
    const rest = name.slice(selectWord.length);
    if (rest.length === 0) {
      return 'selectSelect';
    }

    // Preserve casing for snake_case or ALL_CAPS
    if (/^[A-Z_]+$/.test(rest)) {
      return `${selectWord}${rest}`;
    }

    return `${selectWord}${capitalize(rest)}`;
  }

  // Case 2: Starts with "get"
  if (/^get([^a-z].+)/.test(name)) {
    const rest = name.slice(3);
    return `${selectWord}${capitalize(rest)}`;
  }

  // Case 3: ALL_CAPS or snake_case
  if (/^[A-Z_]+$/.test(name)) {
    return `${selectWord}${name}`;
  }

  // Case 4: generic or camelCase
  return `${selectWord}${capitalize(name)}`;
}

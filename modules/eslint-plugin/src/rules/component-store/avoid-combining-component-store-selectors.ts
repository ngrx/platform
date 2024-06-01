import type { TSESTree } from '@typescript-eslint/utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  getNgRxComponentStores,
  namedExpression,
} from '../../utils';
export const messageId = 'avoidCombiningComponentStoreSelectors';
type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'component-store',
    docs: {
      description: 'Prefer combining selectors at the selector level.',
    },
    schema: [],
    messages: {
      [messageId]: 'Combine selectors at the selector level.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxComponentStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    const thisSelects = `CallExpression[callee.object.type='ThisExpression'][callee.property.name='select']`;
    const storeSelects = storeNames ? namedExpression(storeNames) : null;

    const selectsInArray: TSESTree.CallExpression[] = [];
    return {
      [`ClassDeclaration[superClass.name=/Store/] CallExpression[callee.name='combineLatest'] ${thisSelects} ~ ${thisSelects}`](
        node: TSESTree.CallExpression
      ) {
        selectsInArray.push(node);
      },
      [`CallExpression[callee.name='combineLatest'] ${storeSelects} ~ ${storeSelects}`](
        node: TSESTree.CallExpression
      ) {
        selectsInArray.push(node);
      },
      [`CallExpression[callee.name='combineLatest']:exit`]() {
        for (const node of selectsInArray) {
          context.report({
            node,
            messageId,
          });
        }
        selectsInArray.length = 0;
      },
    };
  },
});

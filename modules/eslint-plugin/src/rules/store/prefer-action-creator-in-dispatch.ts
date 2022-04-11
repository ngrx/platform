import type { TSESTree } from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import { createRule } from '../../rule-creator';
import {
  asPattern,
  dispatchExpression,
  getNearestUpperNodeFrom,
  getNgRxStores,
  isCallExpression,
  isCallExpressionWith,
} from '../../utils';

export const messageId = 'preferActionCreatorInDispatch';

type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'suggestion',
    ngrxModule: 'store',
    docs: {
      description:
        'Using `action creator` in `dispatch` is preferred over `object` or old `Action`.',
      recommended: 'warn',
    },
    schema: [],
    messages: {
      [messageId]:
        'Using `object` or old `Action` is forbidden. Use `action creator` instead.',
    },
  },
  defaultOptions: [],
  create: (context) => {
    const { identifiers = [] } = getNgRxStores(context);
    const storeNames = identifiers.length > 0 ? asPattern(identifiers) : null;

    if (!storeNames) {
      return {};
    }

    return {
      [`${dispatchExpression(
        storeNames
      )} :matches(NewExpression, :not(NewExpression) > ObjectExpression)`](
        node: TSESTree.NewExpression | TSESTree.ObjectExpression
      ) {
        const nearestUpperCallExpression = getNearestUpperNodeFrom(
          node,
          isCallExpression
        );
        const isStoreDispatchImmediateParent =
          nearestUpperCallExpression !== undefined &&
          isCallExpressionWith(
            nearestUpperCallExpression,
            storeNames,
            'dispatch'
          );

        if (!isStoreDispatchImmediateParent) {
          return;
        }

        context.report({
          node,
          messageId,
        });
      },
    };
  },
});

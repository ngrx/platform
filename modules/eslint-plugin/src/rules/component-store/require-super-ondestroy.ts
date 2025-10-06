import * as path from 'path';
import { createRule } from '../../rule-creator';
import { TSESTree } from '@typescript-eslint/types';

export const messageId = 'requireSuperOnDestroy';
type MessageIds = typeof messageId;
type Options = readonly [];

export default createRule<Options, MessageIds>({
  name: path.parse(__filename).name,
  meta: {
    type: 'problem',
    docs: {
      description:
        'Overriden ngOnDestroy method in component stores require a call to super.ngOnDestroy().',
      ngrxModule: 'component-store',
    },
    schema: [],
    messages: {
      [messageId]:
        "Call super.ngOnDestroy() inside a component store's ngOnDestroy method.",
    },
  },
  defaultOptions: [],
  create: (context) => {
    const ngOnDestroyMethodSelector = `MethodDefinition[key.name='ngOnDestroy']`;
    const componentStoreClassName = 'ComponentStore';

    let hasNgrxComponentStoreImport = false;

    return {
      [`ImportDeclaration[source.value='@ngrx/component-store'] ImportSpecifier[imported.name='${componentStoreClassName}']`](
        _: TSESTree.ImportSpecifier
      ) {
        hasNgrxComponentStoreImport = true;
      },
      [`ClassDeclaration[superClass.name=${componentStoreClassName}] ${ngOnDestroyMethodSelector}:not(:has(CallExpression[callee.object.type='Super'][callee.property.name='ngOnDestroy'])) > .key`](
        node: TSESTree.Identifier
      ) {
        if (!hasNgrxComponentStoreImport) {
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

import { ESLintUtils } from '@typescript-eslint/utils';
import { NGRX_MODULE } from './utils';

export interface NgRxRuleDocs {
  ngrxModule: NGRX_MODULE;
  requiresTypeChecking?: boolean;
}

export type NgRxRule = ReturnType<
  ReturnType<typeof ESLintUtils.RuleCreator<NgRxRuleDocs>>
>;

/**
 * We need to patch the RuleCreator in order to preserve the defaultOptions
 * to use as part of documentation generation.
 */
const patchedRuleCreator: typeof ESLintUtils.RuleCreator = (urlCreator) => {
  return function createRule({ name, meta, defaultOptions, create }) {
    return {
      meta: Object.assign(Object.assign({}, meta), {
        docs: Object.assign(Object.assign({}, meta.docs), {
          url: urlCreator(name),
        }),
      }),
      defaultOptions,
      create(context) {
        const optionsWithDefault = ESLintUtils.applyDefault(
          defaultOptions,
          context.options
        );
        return create(context, optionsWithDefault);
      },
    };
  };
};
patchedRuleCreator.withoutDocs = ESLintUtils.RuleCreator.withoutDocs;

export const createRule = patchedRuleCreator<NgRxRuleDocs>(
  (ruleName) => `https://ngrx.io/guide/eslint-plugin/rules/${ruleName}`
);

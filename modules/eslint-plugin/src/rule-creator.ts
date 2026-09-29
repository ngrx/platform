import { ESLintUtils } from '@typescript-eslint/utils';
import { NGRX_MODULE } from './utils';

export interface NgRxRuleDocs {
  ngrxModule: NGRX_MODULE;
  requiresTypeChecking?: boolean;
}

export type NgRxRule = ReturnType<
  ReturnType<typeof ESLintUtils.RuleCreator<NgRxRuleDocs>>
>;

export const createRule = ESLintUtils.RuleCreator<NgRxRuleDocs>(
  (ruleName) => `https://ngrx.io/guide/eslint-plugin/rules/${ruleName}`
);

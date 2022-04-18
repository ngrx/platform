import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, { messageId } from '../../src/rules/store/good-action-hygiene';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `export const loadCustomer = createAction('[Customer Page] Load Customer')`,
  `export const loadCustomerSuccess = createAction('[Customer API] Load Customer Success', props<{ customer: Customer }>())`,
  `export const loadCustomerFail = createAction('[Customer API] Load Customer Fail', (error: string) => ({ error, timestamp: +Date.now() }))`,
  `export const computed = createAction(iDoNotCrash)`,
  `export const withIncorrectFunction = createActionType('Just testing')`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
        export const loadCustomer = createAction('Load Customer')
                                                 ~~~~~~~~~~~~~~~ [${messageId} { "actionType": "Load Customer" }]
    `
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, { messageId } from '../../../src/rules/store/good-action-hygiene';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `export const loadCustomer = createAction('[Customer Page] Load Customer')`,
  `export const loadCustomerSuccess = createAction('[Customer API] Load Customer Success', props<{ customer: Customer }>())`,
  `export const loadCustomerFail = createAction('[Customer API] Load Customer Fail', (error: string) => ({ error, timestamp: +Date.now() }))`,
  `export const computed = createAction(iDoNotCrash)`,
  `export const withIncorrectFunction = createActionType('Just testing')`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
        export const loadCustomer = createAction('Load Customer')
                                                 ~~~~~~~~~~~~~~~ [${messageId} { "actionType": "Load Customer" }]
    `
  ),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);

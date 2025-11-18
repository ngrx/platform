import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/store/prefer-action-creator';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `const loadUser = createAction('[User Page] Load User')`,
  `
    class Test {
      type = '[Customer Page] Load Customer'
    }`,
  `
    class Test implements Action {
      member = '[Customer Page] Load Customer'
    }`,
  `
    class Test {
      readonly type = ActionTypes.success

      constructor(
        currentState: string,
        newState: string,
        params?: RawParams,
        options?: TransitionOptions
      ) {}
    }`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
class Test implements Action { type = '[Customer Page] Load Customer' }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]`
  ),
  fromFixture(
    `
class Test implements ngrx.Action { type = ActionTypes.success; constructor(readonly payload: Payload) {} }
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]`
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

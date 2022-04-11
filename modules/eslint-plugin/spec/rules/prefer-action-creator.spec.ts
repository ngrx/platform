import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, { messageId } from '../../src/rules/store/prefer-action-creator';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
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

const invalid: () => RunTests['invalid'] = () => [
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

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

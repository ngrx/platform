import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/signals/with-state-no-arrays-at-root-level';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `const store = withState({ foo: 'bar' })`,
  `const Store = signalStore(withState(initialState));`,
  `
    const initialState = {};
    const Store = signalStore(withState(initialState));
  `,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
const store = withState([1, 2, 3]);
                        ~~~~~~~~~ [${messageId}]`),
  fromFixture(`
class Fixture {
  store = withState([{ foo: 'bar' }]);
                    ~~~~~~~~~~~~~~~~ [${messageId}]
}`),
  fromFixture(`
const store = withState<string[]>([]);
                                  ~~ [${messageId}]`),
  fromFixture(`
  const initialState = [];
  const store = withState(initialState);
                          ~~~~~~~~~~~~ [${messageId}]`),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);

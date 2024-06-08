import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/signals/with-state-no-arrays-at-root-level';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `const store = withState({ foo: 'bar' })`,
  `const Store = signalStore(withState(initialState));`,
  `
    const initialState = {};
    const Store = signalStore(withState(initialState));
  `,
];

const invalid: () => RunTests['invalid'] = () => [
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

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

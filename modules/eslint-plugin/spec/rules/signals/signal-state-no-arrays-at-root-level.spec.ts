import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/signals/signal-state-no-arrays-at-root-level';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `const state = signalState({ numbers: [1, 2, 3] });`,
  `const state = state([1, 2, 3]);`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(`
const state = signalState([1, 2, 3]);
                          ~~~~~~~~~ [${messageId}]`),
  fromFixture(`
class Fixture {
  state = signalState([{ foo: 'bar' }]);
                      ~~~~~~~~~~~~~~~~ [${messageId}]
}`),
  fromFixture(`
const state = signalState<string[]>([]);
                                    ~~ [${messageId}]`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

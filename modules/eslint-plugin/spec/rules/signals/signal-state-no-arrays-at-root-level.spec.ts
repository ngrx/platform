import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/signals/signal-state-no-arrays-at-root-level';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `const state = signalState({ numbers: [1, 2, 3] });`,
  `const state = signalState({ date: new Date() });`,
  `const state = signalState({ set: new Set() });`,
  `const state = signalState({ map: new Map() });`,
  `const state = state([1, 2, 3]);`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
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
  fromFixture(`
const initialState: string[] = [];
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new Set());
                          ~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const initialState = new Set<string>();
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new Map());
                          ~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const initialState = new Map<string, number>();
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new WeakSet());
                          ~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new WeakMap());
                          ~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new Date());
                          ~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const initialState = new Date();
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new Error());
                          ~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new RegExp('test'));
                          ~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(/test/);
                          ~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new ArrayBuffer(8));
                          ~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const buffer = new ArrayBuffer(8);
const state = signalState(new DataView(buffer));
                          ~~~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(new Promise(() => {}));
                          ~~~~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(Promise.resolve({}));
                          ~~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(function() {});
                          ~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const state = signalState(() => {});
                          ~~~~~~~~ [${messageId}]`),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);

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
                          ~~~~~~~~~ [${messageId} { "property": "Array" }]`),
  fromFixture(`
class Fixture {
  state = signalState([{ foo: 'bar' }]);
                      ~~~~~~~~~~~~~~~~ [${messageId} { "property": "Array" }]
}`),
  fromFixture(`
const state = signalState<string[]>([]);
                                    ~~ [${messageId} { "property": "Array" }]`),
  fromFixture(`
const initialState: string[] = [];
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId} { "property": "Array" }]`),
  fromFixture(`
const state = signalState(new Set());
                          ~~~~~~~~~ [${messageId} { "property": "Set" }]`),
  fromFixture(`
const initialState = new Set<string>();
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId} { "property": "Set" }]`),
  fromFixture(`
const state = signalState(new Map());
                          ~~~~~~~~~ [${messageId} { "property": "Map" }]`),
  fromFixture(`
const initialState = new Map<string, number>();
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId} { "property": "Map" }]`),
  fromFixture(`
const state = signalState(new WeakSet());
                          ~~~~~~~~~~~~~ [${messageId} { "property": "WeakSet" }]`),
  fromFixture(`
const state = signalState(new WeakMap());
                          ~~~~~~~~~~~~~ [${messageId} { "property": "WeakMap" }]`),
  fromFixture(`
const state = signalState(new Date());
                          ~~~~~~~~~~ [${messageId} { "property": "Date" }]`),
  fromFixture(`
const initialState = new Date();
const state = signalState(initialState);
                          ~~~~~~~~~~~~ [${messageId} { "property": "Date" }]`),
  fromFixture(`
const state = signalState(new Error());
                          ~~~~~~~~~~~ [${messageId} { "property": "Error" }]`),
  fromFixture(`
const state = signalState(new RegExp('test'));
                          ~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "RegExp" }]`),
  fromFixture(`
const state = signalState(/test/);
                          ~~~~~~ [${messageId} { "property": "RegExp" }]`),
  fromFixture(`
const state = signalState(new ArrayBuffer(8));
                          ~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "ArrayBuffer" }]`),
  fromFixture(`
const buffer = new ArrayBuffer(8);
const state = signalState(new DataView(buffer));
                          ~~~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "DataView" }]`),
  fromFixture(`
const state = signalState(new Promise(() => {}));
                          ~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "Promise" }]`),
  fromFixture(`
const state = signalState(Promise.resolve({}));
                          ~~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "Promise" }]`),
  fromFixture(`
const state = signalState(function() {});
                          ~~~~~~~~~~~~~ [${messageId} { "property": "Function" }]`),
  fromFixture(`
const state = signalState(() => {});
                          ~~~~~~~~ [${messageId} { "property": "Function" }]`),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);

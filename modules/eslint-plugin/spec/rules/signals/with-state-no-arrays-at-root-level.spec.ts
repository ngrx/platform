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
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `const store = withState({ foo: 'bar' })`,
  `const store = withState({ date: new Date() })`,
  `const store = withState({ set: new Set() })`,
  `const store = withState({ map: new Map() })`,
  `const Store = signalStore(withState(initialState));`,
  `
    const initialState = {};
    const Store = signalStore(withState(initialState));
  `,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
const store = withState([1, 2, 3]);
                        ~~~~~~~~~ [${messageId} { "property": "Array" }]`),
  fromFixture(`
class Fixture {
  store = withState([{ foo: 'bar' }]);
                    ~~~~~~~~~~~~~~~~ [${messageId} { "property": "Array" }]
}`),
  fromFixture(`
const store = withState<string[]>([]);
                                  ~~ [${messageId} { "property": "Array" }]`),
  fromFixture(`
const initialState = [];
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId} { "property": "Array" }]`),
  fromFixture(`
const store = withState(new Set());
                        ~~~~~~~~~ [${messageId} { "property": "Set" }]`),
  fromFixture(`
const initialState = new Set<string>();
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId} { "property": "Set" }]`),
  fromFixture(`
const store = withState(new Map());
                        ~~~~~~~~~ [${messageId} { "property": "Map" }]`),
  fromFixture(`
const initialState = new Map<string, number>();
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId} { "property": "Map" }]`),
  fromFixture(`
const store = withState(new WeakSet());
                        ~~~~~~~~~~~~~ [${messageId} { "property": "WeakSet" }]`),
  fromFixture(`
const store = withState(new WeakMap());
                        ~~~~~~~~~~~~~ [${messageId} { "property": "WeakMap" }]`),
  fromFixture(`
const store = withState(new Date());
                        ~~~~~~~~~~ [${messageId} { "property": "Date" }]`),
  fromFixture(`
const initialState = new Date();
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId} { "property": "Date" }]`),
  fromFixture(`
const store = withState(new Error());
                        ~~~~~~~~~~~ [${messageId} { "property": "Error" }]`),
  fromFixture(`
const store = withState(new RegExp('test'));
                        ~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "RegExp" }]`),
  fromFixture(`
const store = withState(/test/);
                        ~~~~~~ [${messageId} { "property": "RegExp" }]`),
  fromFixture(`
const store = withState(new ArrayBuffer(8));
                        ~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "ArrayBuffer" }]`),
  fromFixture(`
const buffer = new ArrayBuffer(8);
const store = withState(new DataView(buffer));
                        ~~~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "DataView" }]`),
  fromFixture(`
const store = withState(new Promise(() => {}));
                        ~~~~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "Promise" }]`),
  fromFixture(`
const store = withState(Promise.resolve({}));
                        ~~~~~~~~~~~~~~~~~~~ [${messageId} { "property": "Promise" }]`),
  fromFixture(`
const store = withState(function() {});
                        ~~~~~~~~~~~~~ [${messageId} { "property": "Function" }]`),
  fromFixture(`
const store = withState(() => {});
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

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
  fromFixture(`
const store = withState(new Set());
                        ~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const initialState = new Set<string>();
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new Map());
                        ~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const initialState = new Map<string, number>();
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new WeakSet());
                        ~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new WeakMap());
                        ~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new Date());
                        ~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const initialState = new Date();
const store = withState(initialState);
                        ~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new Error());
                        ~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new RegExp('test'));
                        ~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(/test/);
                        ~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new ArrayBuffer(8));
                        ~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const buffer = new ArrayBuffer(8);
const store = withState(new DataView(buffer));
                        ~~~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(new Promise(() => {}));
                        ~~~~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(Promise.resolve({}));
                        ~~~~~~~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(function() {});
                        ~~~~~~~~~~~~~ [${messageId}]`),
  fromFixture(`
const store = withState(() => {});
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

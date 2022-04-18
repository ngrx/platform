import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import rule, {
  avoidDuplicateActionsInReducer,
  avoidDuplicateActionsInReducerSuggest,
} from '../../src/rules/store/avoid-duplicate-actions-in-reducer';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
export const reducer = createReducer(
  {},
  on(abc, state => state),
  on(def, state => state),
  on(ghi, state => state),
)`,
  `
export const reducer = createReducer(
  {},
  on(abc, state => state),
  on(def, state => state),
  on(ghi, state => state),
)

export const reducerTwo = createReducer(
  {},
  on(abc, state => state),
  on(def, state => state),
  on(ghi, state => state),
)`,
  // does not crash when no arguments present
  `
export const reducer = createReducer(
  {},
  on(),
)`,
];

const invalid: () => RunTests['invalid'] = () => [
  {
    code: `
export const reducer = createReducer(
  {},
  on(abc, state => state),
  on(def, state => state),
  on(abc, (state, props) => state),
)`,
    errors: [
      {
        column: 6,
        endColumn: 9,
        line: 4,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'abc',
            },
            output: `
export const reducer = createReducer(
  {},
  
  on(def, state => state),
  on(abc, (state, props) => state),
)`,
          },
        ],
      },
      {
        column: 6,
        endColumn: 9,
        line: 6,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'abc',
            },
            output: `
export const reducer = createReducer(
  {},
  on(abc, state => state),
  on(def, state => state),
  
)`,
          },
        ],
      },
    ],
  },
  {
    code: `
export const reducer = createReducer(
  {},
  on(foo, state => state),
  on(foo2, state => state),
  on(foo, (state, props) => state),
  on(foo, state => state),
  on(foo3, state => state),
)`,
    errors: [
      {
        column: 6,
        endColumn: 9,
        line: 4,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'foo',
            },
            output: `
export const reducer = createReducer(
  {},
  
  on(foo2, state => state),
  on(foo, (state, props) => state),
  on(foo, state => state),
  on(foo3, state => state),
)`,
          },
        ],
      },
      {
        column: 6,
        endColumn: 9,
        line: 6,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'foo',
            },
            output: `
export const reducer = createReducer(
  {},
  on(foo, state => state),
  on(foo2, state => state),
  
  on(foo, state => state),
  on(foo3, state => state),
)`,
          },
        ],
      },
      {
        column: 6,
        endColumn: 9,
        line: 7,
        messageId: avoidDuplicateActionsInReducer,
        suggestions: [
          {
            messageId: avoidDuplicateActionsInReducerSuggest,
            data: {
              actionName: 'foo',
            },
            output: `
export const reducer = createReducer(
  {},
  on(foo, state => state),
  on(foo2, state => state),
  on(foo, (state, props) => state),
  
  on(foo3, state => state),
)`,
          },
        ],
      },
    ],
  },
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

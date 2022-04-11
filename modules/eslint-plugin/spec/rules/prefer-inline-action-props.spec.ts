import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import * as path from 'path';
import rule, {
  preferInlineActionProps,
  preferInlineActionPropsSuggest,
} from '../../src/rules/store/prefer-inline-action-props';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `const ok0 = createAction('ok0', props<{ id: number, name: string }>())`,
  `const ok1 = createAction('ok1', props<Readonly<{ description: string }>>())`,
  `const ok2 = createAction('ok2', props<Readonly<HttpErrorResponse & { description: string }>>())`,
  `const ok3 = createAction('ok3')`,
  `const ok4 = createAction('[Users] Add User', props<{ user: User }>())`,
  `const ok5 = createAction('[API/User] Save user success', (user: User<number>) => ({
      kind: 'SAVE_SUCCESS',
      message,
      user,
    }));`,
];

const invalid: () => TSESLint.InvalidTestCase<MessageIds, []>[] = () => [
  {
    code: `const notOk0 = createAction('notOk0', props<number>())`,
    errors: [
      {
        messageId: preferInlineActionProps,
        suggestions: [
          {
            messageId: preferInlineActionPropsSuggest,
            output: `const notOk0 = createAction('notOk0', props<{name: number}>())`,
          },
        ],
      },
    ],
  },
  {
    code: `const notOk1 = createAction('notOk1', props<Person>())`,
    errors: [
      {
        messageId: preferInlineActionProps,
        suggestions: [
          {
            messageId: preferInlineActionPropsSuggest,
            output: `const notOk1 = createAction('notOk1', props<{name: Person}>())`,
          },
        ],
      },
    ],
  },
  {
    code: `const notOk2 = createAction('notOk2', props<Customer<T>>())`,
    errors: [
      {
        messageId: preferInlineActionProps,
        suggestions: [
          {
            messageId: preferInlineActionPropsSuggest,
            output: `const notOk2 = createAction('notOk2', props<{name: Customer<T>}>())`,
          },
        ],
      },
    ],
  },
  {
    code: `const notOk3 = createAction('notOk3', props<ReadonlyArray<Test>>())`,
    errors: [
      {
        messageId: preferInlineActionProps,
        suggestions: [
          {
            messageId: preferInlineActionPropsSuggest,
            output: `const notOk3 = createAction('notOk3', props<{name: ReadonlyArray<Test>}>())`,
          },
        ],
      },
    ],
  },
  {
    code: `const notOk4 = createAction('notOk4', props<Test[]>())`,
    errors: [
      {
        messageId: preferInlineActionProps,
        suggestions: [
          {
            messageId: preferInlineActionPropsSuggest,
            output: `const notOk4 = createAction('notOk4', props<{name: Test[]}>())`,
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

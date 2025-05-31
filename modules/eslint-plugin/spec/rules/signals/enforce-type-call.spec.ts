import type { ESLintUtils } from '@typescript-eslint/utils';
import { ruleTester } from '../../utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  enforceTypeCall,
  enforceTypeCallSuggest,
} from '../../../src/rules/signals/enforce-type-call';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  {
    code: `
      import { type } from '@ngrx/signals';
      const stateType = type<{ count: number }>();
    `,
  },
  {
    code: `
      import { type as typeFn } from '@ngrx/signals';
      const stateType = typeFn<{ count: number; name: string }>();
    `,
  },
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  {
    code: `
      import { type } from '@ngrx/signals';
      const stateType = type<{ count: number }>;
    `,
    output: `
      import { type } from '@ngrx/signals';
      const stateType = type<{ count: number }>();
    `,
    errors: [
      {
        messageId: enforceTypeCall,
        data: { name: 'type' },
        suggestions: [
          {
            messageId: enforceTypeCallSuggest,
            data: { name: 'type' },
            output: `
      import { type } from '@ngrx/signals';
      const stateType = type<{ count: number }>();
    `,
          },
        ],
      },
    ],
  },
  {
    code: `
      import { type as typeFn } from '@ngrx/signals';
      const stateType = typeFn<{ count: number }>;
    `,
    output: `
      import { type as typeFn } from '@ngrx/signals';
      const stateType = typeFn<{ count: number }>();
    `,
    errors: [
      {
        messageId: enforceTypeCall,
        data: { name: 'typeFn' },
        suggestions: [
          {
            messageId: enforceTypeCallSuggest,
            data: { name: 'typeFn' },
            output: `
      import { type as typeFn } from '@ngrx/signals';
      const stateType = typeFn<{ count: number }>();
    `,
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

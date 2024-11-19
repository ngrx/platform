import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  preferProtectedState,
  preferProtectedStateSuggest,
} from '../../../src/rules/signals/prefer-protected-state';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  `const mySignalStore = signalStore();`,
  `const mySignalStore = signalStore({ protectedState: true });`,
  `const mySignalStore = signalStore({ providedIn: 'root' });`,
  `const mySignalStore = signalStore({ providedIn: 'root', protectedState: true });`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
const mySignalStore = signalStore({ providedIn: 'root', protectedState: false, });
                                                        ~~~~~~~~~~~~~~~~~~~~~ [${preferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: preferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore({ providedIn: 'root',  });`,
        },
      ],
    }
  ),
  fromFixture(
    `
const mySignalStore = signalStore({ providedIn: 'root', protectedState: false  ,  });
                                                        ~~~~~~~~~~~~~~~~~~~~~ [${preferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: preferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore({ providedIn: 'root',   });`,
        },
      ],
    }
  ),
  fromFixture(
    `
const mySignalStore = signalStore({ protectedState: false, });
                                    ~~~~~~~~~~~~~~~~~~~~~ [${preferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: preferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore();`,
        },
      ],
    }
  ),
  fromFixture(
    `
const mySignalStore = signalStore({ protectedState: false, providedIn: 'root' });
                                    ~~~~~~~~~~~~~~~~~~~~~ [${preferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: preferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore({  providedIn: 'root' });`,
        },
      ],
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

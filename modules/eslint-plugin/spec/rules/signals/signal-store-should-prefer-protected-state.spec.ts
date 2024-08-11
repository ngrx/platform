import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  signalStoreShouldPreferProtectedState,
  signalStoreShouldPreferProtectedStateSuggest,
} from '../../../src/rules/signals/signal-store-should-prefer-protected-state';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[];
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `const mySignalStore = signalStore();`,
  `const mySignalStore = signalStore({ protectedState: true });`,
  `const mySignalStore = signalStore({ providedIn: 'root' });`,
  `const mySignalStore = signalStore({ providedIn: 'root', protectedState: true });`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
const mySignalStore = signalStore({ providedIn: 'root', protectedState: false, });
                                                        ~~~~~~~~~~~~~~~~~~~~~ [${signalStoreShouldPreferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: signalStoreShouldPreferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore({ providedIn: 'root',  });`,
        },
      ],
    }
  ),
  fromFixture(
    `
const mySignalStore = signalStore({ providedIn: 'root', protectedState: false  ,  });
                                                        ~~~~~~~~~~~~~~~~~~~~~ [${signalStoreShouldPreferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: signalStoreShouldPreferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore({ providedIn: 'root',   });`,
        },
      ],
    }
  ),
  fromFixture(
    `
const mySignalStore = signalStore({ protectedState: false, });
                                    ~~~~~~~~~~~~~~~~~~~~~ [${signalStoreShouldPreferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: signalStoreShouldPreferProtectedStateSuggest,
          output: `
const mySignalStore = signalStore({  });`,
        },
      ],
    }
  ),
  fromFixture(
    `
const mySignalStore = signalStore({ protectedState: false, providedIn: 'root' });
                                    ~~~~~~~~~~~~~~~~~~~~~ [${signalStoreShouldPreferProtectedState} suggest]`,
    {
      suggestions: [
        {
          messageId: signalStoreShouldPreferProtectedStateSuggest,
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

import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  noMultipleGlobalStores,
  noMultipleGlobalStoresSuggest,
} from '../../src/rules/store/no-multiple-global-stores';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
class Ok {}`,
  `
class Ok1 {
  constructor() {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok2 {
  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok3 {
  constructor(store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok4 {
  constructor(private store: Store, data: Service) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok5 {
  constructor(private store: Store) {}
}

class Ok6 {
  constructor(private readonly store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok7 {
  constructor(store: Store, apiService: ApiService) {}
}

class Ok8 {
  constructor(public store$: Store) {}
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class ShouldNotBreakLaterReports {
  constructor(store: Store, apiService: ApiService) {}
}

class ShouldNotBreakLaterReports1 {
  constructor(public store$: Store) {}
}

class NotOk {
  constructor(store: Store, store2: Store) {}
              ~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 0]
                            ~~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class ShouldNotBreakLaterReports {
  constructor(store: Store, apiService: ApiService) {}
}

class ShouldNotBreakLaterReports1 {
  constructor(public store$: Store) {}
}

class NotOk {
  constructor( store2: Store) {}
}`,
        },
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class ShouldNotBreakLaterReports {
  constructor(store: Store, apiService: ApiService) {}
}

class ShouldNotBreakLaterReports1 {
  constructor(public store$: Store) {}
}

class NotOk {
  constructor(store: Store, ) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(store: Store /* first store */, private readonly actions$: Actions, private store2: Store, b: B) {}
              ~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 0]
                                                                                  ~~~~~~~~~~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor( /* first store */ private readonly actions$: Actions, private store2: Store, b: B) {}
}`,
        },
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(store: Store /* first store */, private readonly actions$: Actions,  b: B) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(
    a: A,
    store: Store,// a comment
    ~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 0]
    private readonly actions$: Actions,
    private store2: Store,
    ~~~~~~~~~~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 1]
    private readonly store3: Store,
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noMultipleGlobalStores} suggest 2]
  ) {}
}`,
    {
      suggestions: [
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(
    a: A,
    // a comment
    private readonly actions$: Actions,
    private store2: Store,
    private readonly store3: Store,
  ) {}
}`,
        },
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(
    a: A,
    store: Store,// a comment
    private readonly actions$: Actions,
    \n    private readonly store3: Store,
  ) {}
}`,
        },
        {
          messageId: noMultipleGlobalStoresSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(
    a: A,
    store: Store,// a comment
    private readonly actions$: Actions,
    private store2: Store,
    \n  ) {}
}`,
        },
      ],
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

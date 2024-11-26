import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  useConsistentGlobalStoreName,
  useConsistentGlobalStoreNameSuggest,
} from '../../../src/rules/store/use-consistent-global-store-name';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[0][];

const validConstructor: () => (string | ValidTestCase<Options>)[] = () => [
  `
class Ok {}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  constructor(store: Store) {}
}`,
  {
    code: `
import { Store } from '@ngrx/store'

class Ok2 {
  constructor(private customName: Store) {}
}`,
    options: ['customName'],
  },
];

const validInject: () => (string | ValidTestCase<Options>)[] = () => [
  `
class Ok3 {}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok4 {
  readonly store = inject(Store)
}`,
  {
    code: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok5 {
  readonly customName = inject(Store)
}`,
    options: ['customName'],
  },
];

const invalidConstructor: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(private readonly somethingElse$: Store) {}
                               ~~~~~~~~~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(private readonly store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(private readonly store1: Store, private readonly store: Store) {}
                               ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(private readonly store: Store, private readonly store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store1: Store, private readonly store2: Store) {}
                               ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest 0]
                                                               ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store: Store, private readonly store2: Store) {}
}`,
        },
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store1: Store, private readonly store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(private store: Store) {}
                      ~~~~~ [${useConsistentGlobalStoreName} { "storeName": "customName" } suggest]
}`,
    {
      options: ['customName'],
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'customName',
          },
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(private customName: Store) {}
}`,
        },
      ],
    }
  ),
];

const invalidInject: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk4 {
  readonly somethingElse$: Store = inject(Store)
           ~~~~~~~~~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk4 {
  readonly store: Store = inject(Store)
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk5 {
  private readonly store1 = inject(Store)
                   ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest]
  private readonly store = inject(Store)
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk5 {
  private readonly store = inject(Store)
  private readonly store = inject(Store)
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  private readonly store1 = inject(Store)
                   ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest 0]
  private readonly store2 = inject(Store)
                   ~~~~~~ [${useConsistentGlobalStoreName} { "storeName": "store" } suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  private readonly store = inject(Store)
  private readonly store2 = inject(Store)
}`,
        },
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'store',
          },
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  private readonly store1 = inject(Store)
  private readonly store = inject(Store)
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  private store = inject(Store)
          ~~~~~ [${useConsistentGlobalStoreName} { "storeName": "customName" } suggest]
}`,
    {
      options: ['customName'],
      suggestions: [
        {
          messageId: useConsistentGlobalStoreNameSuggest,
          data: {
            storeName: 'customName',
          },
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  private customName = inject(Store)
}`,
        },
      ],
    }
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

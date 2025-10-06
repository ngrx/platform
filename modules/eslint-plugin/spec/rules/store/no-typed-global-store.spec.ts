import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  noTypedStore,
  noTypedStoreSuggest,
} from '../../../src/rules/store/no-typed-global-store';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const validConstructor: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { Store } from '@ngrx/store'

export class Ok {
  constructor(store: Store) {}
}`,
];

const validInject: () => (string | ValidTestCase<Options>)[] = () => [
  // https://github.com/ngrx/platform/issues/3950
  `
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

export class AppComponent {
  store = inject(Store);
  otherName = inject(Store);
}`,
  `
import { somethingElse } from '@angular/core';
import { Store } from '@ngrx/store';

export class AppComponent {
  store = somethingElse(Store<{}>);
}
`,
];

const invalidConstructor: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(store: Store<PersonsState>) {}
                          ~~~~~~~~~~~~~~ [${noTypedStore} suggest]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk {
  constructor(store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(cdr: ChangeDetectorRef, private store: Store<CustomersState>) {}
                                                          ~~~~~~~~~~~~~~~~ [${noTypedStore} suggest]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(cdr: ChangeDetectorRef, private store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store: Store<any>, private personsService: PersonsService) {}
                                           ~~~~~ [${noTypedStore} suggest]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(private readonly store: Store, private personsService: PersonsService) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(store: Store<{}>, private customStore: Store<object>) {}
                          ~~~~ [${noTypedStore} suggest 0]
                                                          ~~~~~~~~ [${noTypedStore} suggest 1]
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(store: Store, private customStore: Store<object>) {}
}`,
        },
        {
          messageId: noTypedStoreSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(store: Store<{}>, private customStore: Store) {}
}`,
        },
      ],
    }
  ),
];

const invalidInject: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

export class NotOk4 {
  store = inject(Store<{}>);
                      ~~~~ [${noTypedStore} suggest] 
}`,
    {
      suggestions: [
        {
          messageId: noTypedStoreSuggest,
          output: `
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';

export class NotOk4 {
  store = inject(Store);
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

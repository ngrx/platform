import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/store/prefer-selector-in-select';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const validConstructor: () => RunTests['valid'] = () => [
  `
class Ok {
  readonly test$ = somethingOutside();
}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  view$: Observable<unknown>

  constructor(store: Store) {
    this.view$ = store.pipe(select(selectCustomers))
  }
}`,
  `
import { Store } from '@ngrx/store'

class Ok2 {
  view$: Observable<unknown>

  constructor(private store: Store) {
    this.view$ = store.select(selectCustomers)
  }
}`,
  `
import { Store } from '@ngrx/store'

class Ok3 {
  view$ = this.store.pipe(select(CustomerSelectors.selectCustomers))

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok4 {
  view$ = this.store.select(selectCustomers)

  constructor(private readonly store: Store) {}
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/41
  `
import { Store } from '@ngrx/store'

class Ok5 {
  view$ = this.store.pipe(select(selectQueryParam('parameter')))

  constructor(private store: Store) {}
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/135
  `
import { Store } from '@ngrx/store'

class Ok6 {
  view$ = this.store.select(this.store.select(hasAuthorization, 'ADMIN'));

  constructor(private readonly store: Store) {}
}`,
];

const validInject: () => RunTests['valid'] = () => [
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok7 {
  store = inject(Store)
  view$ = this.store.pipe(select(selectCustomers))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok8 {
  private store = inject(Store)
  view$ = this.store.select(selectCustomers)
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok9 {
  private store = inject(Store)
  view$ = this.store.pipe(select(CustomerSelectors.selectCustomers))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok10 {
  private readonly store = inject(Store)
  view$ = this.store.select(selectCustomers)
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok11 {
  private store = inject(Store)
  view$ = this.store.pipe(select(selectQueryParam('parameter')))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok12 {
  private readonly store = inject(Store)
  view$ = this.store.select(this.store.select(hasAuthorization, 'ADMIN'));
}`,
];

const invalidConstructor: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  view$: Observable<unknown>

  constructor(store: Store) {
    this.view$ = this.store.pipe(select('customers'))
                                        ~~~~~~~~~~~  [${messageId}]
  }
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  view$ = this.store.select('customers')
                            ~~~~~~~~~~~  [${messageId}]

  constructor(private store: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  view$ = this.store.pipe(select('customers', 'orders'))
                                 ~~~~~~~~~~~            [${messageId}]
                                              ~~~~~~~~  [${messageId}]

  constructor(private readonly store: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk3 {
  view$ = this.store.select('customers', 'orders')
                            ~~~~~~~~~~~               [${messageId}]
                                         ~~~~~~~~     [${messageId}]

  constructor(private store: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk4 {
  view$ = this.store.pipe(select(s => s.customers))
                                 ~~~~~~~~~~~~~~~~  [${messageId}]

  constructor(private store: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk5 {
  view$ = this.store.select(s => s.customers)
                            ~~~~~~~~~~~~~~~~  [${messageId}]

  constructor(readonly store: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk6 {
  view$ = this.store$.select(s => s.customers)
                             ~~~~~~~~~~~~~~~~  [${messageId}]

  constructor(private store$: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk7 {
  view$ = this.store$.pipe(select('customers'))
                                  ~~~~~~~~~~~  [${messageId}]

  constructor(private readonly store$: Store) {}
}`
  ),
];

const invalidInject: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk8 {
  store = inject(Store)
  view$ = this.store.pipe(select('customers'))
                                 ~~~~~~~~~~~  [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk9 {
  private store = inject(Store)
  view$ = this.store.select('customers')
                            ~~~~~~~~~~~  [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk10 {
  private readonly store = inject(Store)
  view$ = this.store.pipe(select('customers', 'orders'))
                                 ~~~~~~~~~~~            [${messageId}]
                                              ~~~~~~~~  [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk11 {
  private store = inject(Store)
  view$ = this.store.select('customers', 'orders')
                            ~~~~~~~~~~~               [${messageId}]
                                         ~~~~~~~~     [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk12 {
  private store = inject(Store)
  view$ = this.store.pipe(select(s => s.customers))
                                 ~~~~~~~~~~~~~~~~  [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk13 {
  readonly store = inject(Store)
  view$ = this.store.select(s => s.customers)
                            ~~~~~~~~~~~~~~~~  [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk14 {
  private store$ = inject(Store)
  view$ = this.store$.select(s => s.customers)
                             ~~~~~~~~~~~~~~~~  [${messageId}]
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk15 {
  private readonly store$ = inject(Store)
  view$ = this.store$.pipe(select('customers'))
                                  ~~~~~~~~~~~  [${messageId}]
}`
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

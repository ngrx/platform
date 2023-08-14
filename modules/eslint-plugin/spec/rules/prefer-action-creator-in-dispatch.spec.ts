import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/store/prefer-action-creator-in-dispatch';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const validConstructor: () => RunTests['valid'] = () => [
  `
class Ok {
  readonly viewModel$ = somethingElse()

  constructor(private readonly appFacade: AppFacade) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  constructor(store$: Store) {
    store$.dispatch(action)
  }
}`,
  `
import { Store } from '@ngrx/store'

class Ok2 {
  constructor(private readonly store$: Store) {
    this.store$.dispatch(BookActions.load())
  }
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/255
  `
import { Store } from '@ngrx/store'

class Ok3 {
  constructor(private readonly store: Store) {
    this.store.dispatch(login({ payload }));
    this.store.dispatch(AuthActions.dispatch({ type: 'SUCCESS' }));
    nonStore.dispatch(AuthActions.dispatch({ type: 'FAIL' }));
  }
}`,
];

const validInject: () => RunTests['valid'] = () => [
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok4 {
  store$ = inject(Store)

  constructor() {
    this.store$.dispatch(action)
  }
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok5 {
  private readonly store$ = inject(Store)

  constructor() {
    this.store$.dispatch(BookActions.load())
  }
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok6 {
  private readonly store = inject(Store)

  constructor() {
    this.store.dispatch(login({ payload }));
    this.store.dispatch(AuthActions.dispatch({ type: 'SUCCESS' }));
    nonStore.dispatch(AuthActions.dispatch({ type: 'FAIL' }));
  }
}`,
];

const invalidConstructor: () => RunTests['invalid'] = () => [
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk {
  constructor(store$: Store) {
    store$.dispatch(new CustomAction())
                    ~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(private readonly store$: Store) {
    this.store$.dispatch({ type: 'custom' })
                         ~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk2 {
  constructor(store: Store, private readonly store$: Store) {
    store.dispatch(new Login({ payload }));
                   ~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store$.dispatch(new AuthActions.dispatch({ type: 'SUCCESS' }));
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    nonStore.dispatch(new AuthActions.dispatch({ type: 'FAIL' }));
  }

  ngOnInit() {
    const store = { dispatch: () => void 0 }
    store.dispatch()
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk3 {
  constructor(private readonly store$: Store) {}

  ngOnInit() {
    this.store$.dispatch(useObject ? { type: 'custom' } : new CustomAction())
                                     ~~~~~~~~~~~~~~~~~~ [${messageId}]
                                                          ~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
];

const invalidInject: () => RunTests['invalid'] = () => [
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk4 {
  store$ = inject(Store)

  constructor() {
    this.store$.dispatch(new CustomAction())
                         ~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk5 {
  private readonly store$ = inject(Store)

  constructor() {
    this.store$.dispatch({ type: 'custom' })
                         ~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  store = inject(Store)
  private readonly store$ = inject(Store)

  constructor() {
    this.store.dispatch(new Login({ payload }));
                        ~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store$.dispatch(new AuthActions.dispatch({ type: 'SUCCESS' }));
                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    nonStore.dispatch(new AuthActions.dispatch({ type: 'FAIL' }));
  }

  ngOnInit() {
    const store = { dispatch: () => void 0 }
    store.dispatch()
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  private readonly store$ = inject(Store)

  constructor() {}

  ngOnInit() {
    this.store$.dispatch(useObject ? { type: 'custom' } : new CustomAction())
                                     ~~~~~~~~~~~~~~~~~~ [${messageId}]
                                                          ~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

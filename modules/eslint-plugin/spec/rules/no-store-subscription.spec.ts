import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, { messageId } from '../../src/rules/store/no-store-subscription';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
  `
import { Store } from '@ngrx/store'

class Ok {
  readonly test$ = somethingOutside();
}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  vm$ = this.store.select(selectItems)

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok2 {
  vm$ = this.store.pipe(select(selectItems))

  constructor(private store: Store) {}
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/175
  `
import { Store } from '@ngrx/store'

class Ok3 {
  readonly formControlChangesSubscription$ = this.formCtrlOrg.valueChanges
    .pipe(takeUntil(this.drop))
    .subscribe((orgName) => {
      this.store.dispatch(UserPageActions.checkOrgNameInput({ orgName }))
    })

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok4 {
  readonly items$: Observable<readonly Item[]>
  readonly metrics$: Observable<Metric>

  constructor(store: Store) {
    this.items$ = store.pipe(select(selectItems))
    this.metrics$ = store.select(selectMetrics)
  }
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk {
  constructor(store: Store) {
    store.subscribe()
          ~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk1 {
  constructor(store: Store) {
    store.pipe(map(selectItems)).subscribe()
                                 ~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk2 {
  sub = this.store.subscribe()
                   ~~~~~~~~~ [${messageId}]

  constructor(private store: Store) {}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk3 {
  sub = this.store.select(selectItems).subscribe()
                                       ~~~~~~~~~ [${messageId}]

  constructor(private store: Store) {}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk4 {
  sub = this.store.pipe(select(selectItems)).subscribe()
                                             ~~~~~~~~~ [${messageId}]

  constructor(private store: Store) {}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk5 {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.select(selectItems).subscribe()
                                   ~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk6 {
  items: readonly Item[]

  constructor(private store: Store) {}

  ngOnInit() {
    this.store.pipe(select(selectItems)).subscribe((items) => {
                                         ~~~~~~~~~ [${messageId}]
      this.items = items
    })
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk6 {
  readonly items: readonly Item[]

  constructor(store: Store) {
    store.pipe(select(selectItems)).subscribe((items) => this.items = items)
                                    ~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { Store } from '@ngrx/store'

class NotOk7 {
  readonly control = new FormControl()

  constructor(store: Store) {
    this.control.valueChanges.subscribe(() => {
      store.pipe(select(selectItems)).subscribe()
                                      ~~~~~~~~~ [${messageId}]
    })
  }
}`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

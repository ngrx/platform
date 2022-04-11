import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/store/avoid-combining-selectors';
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
  readonly vm$: Observable<unknown>

  constructor(store: Store) {
    this.vm$ = store.select(selectItems)
  }
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok2 {
  vm$ = this.store.pipe(select(selectItems))

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok3 {
  vm$ = combineLatest(this.store$.select(selectItems), this.somethingElse())

  constructor(private store$: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

@Pipe()
class Ok4 {
  vm$ = combineLatest(this.somethingElse(), this.store.select(selectItems))

  constructor(private readonly store: Store) {}
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  readonly vm$: Observable<unknown>

  constructor(store: Store, private store2: Store) {
    this.vm$ = combineLatest(
      store.select(selectItems),
      store.select(selectOtherItems),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      this.store2.select(selectOtherItems),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    )
  }
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  vm$ = combineLatest(
    this.store.pipe(select(selectItems)),
    this.store.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )

  constructor(private store: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  vm$ = combineLatest(
    this.customName.select(selectItems),
    this.customName.select(selectOtherItems),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.somethingElse(),
  )

  constructor(private customName: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

@Pipe()
class NotOk3 {
  vm$ = combineLatest(
    this.customName.select(selectItems),
    this.customName.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.somethingElse(),
  )

  constructor(private readonly customName: Store) {}
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk4 {
  vm$ = combineLatest(
    this.store.pipe(select(selectItems)),
    this.store.select(selectOtherItems),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )

  constructor(private store: Store) {}
}`
  ),

  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk5 {
  vm$ = combineLatest(
    this.store.select(selectItems),
    this.store.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store2.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )

  constructor(private store: Store, private store2: Store) {}
}`
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

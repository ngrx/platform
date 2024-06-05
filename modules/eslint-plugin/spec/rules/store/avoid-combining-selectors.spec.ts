import type { ESLintUtils, TSESLint } from '@typescript-eslint/utils';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/store/avoid-combining-selectors';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const validConstructor: () => RunTests['valid'] = () => [
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

const validInject: () => RunTests['valid'] = () => [
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok5 {
  readonly vm$: Observable<unknown>
  readonly store = inject(Store)

  constructor() {
    this.vm$ = store.select(selectItems)
  }
}`,
  `
import { Store, select } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok6 {
  readonly store = inject(Store)
  vm$ = this.store.pipe(select(selectItems))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok7 {
  readonly store = inject(Store)
  vm$ = combineLatest(this.store.select(selectItems), this.somethingElse())
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

@Pipe()
class Ok8 {
  private readonly store = inject(Store)
  vm$ = combineLatest(this.somethingElse(), this.store.select(selectItems))
}`,
];

const invalidConstructor: () => RunTests['invalid'] = () => [
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

class NotOkWithArrays {
  readonly vm$: Observable<unknown>

  constructor(store: Store, private store2: Store) {
    this.vm$ = combineLatest([
      store.select(selectItems),
      store.select(selectOtherItems),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      this.store2.select(selectOtherItems),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    ])
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

class NotOkWithArray {
  vm$ = combineLatest([
    this.store.pipe(select(selectItems)),
    this.store.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  ])

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

const invalidInject: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  readonly vm$: Observable<unknown>
  readonly store = inject(Store)
  readonly store2 = inject(Store)

  constructor() {
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
import { inject } from '@angular/core'

class NotOkWithArrays1 {
  readonly vm$: Observable<unknown>
  readonly store = inject(Store)
  readonly store2 = inject(Store)

  constructor() {
    this.vm$ = combineLatest([
      store.select(selectItems),
      store.select(selectOtherItems),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      this.store2.select(selectOtherItems),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    ])
  }
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  private readonly store = inject(Store)
  vm$ = combineLatest(
    this.store.pipe(select(selectItems)),
    this.store.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOkWithArray1 {
  private readonly store = inject(Store)
  vm$ = combineLatest([
    this.store.pipe(select(selectItems)),
    this.store.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  ])
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk8 {
  private readonly customName = inject(Store)
  vm$ = combineLatest(
    this.customName.select(selectItems),
    this.customName.select(selectOtherItems),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.somethingElse(),
  )
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

@Pipe()
class NotOk9 {
  private readonly customName = inject(Store)
  vm$ = combineLatest(
    this.customName.select(selectItems),
    this.customName.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.somethingElse(),
  )
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk10 {
  private readonly store = inject(Store)
  vm$ = combineLatest(
    this.store.pipe(select(selectItems)),
    this.store.select(selectOtherItems),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )
}`
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk11 {
  private readonly store = inject(Store)
  private readonly store2 = inject(Store)
  vm$ = combineLatest(
    this.store.select(selectItems),
    this.store.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store2.pipe(select(selectOtherItems)),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )
}`
  ),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

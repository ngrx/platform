import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, { SelectStyle } from '../../../src/rules/store/select-style';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[0][];

const validConstructor: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { Store } from '@ngrx/store'

class Ok {
  readonly test$ = somethingOutside();
}`,
  `
import { Store } from '@ngrx/store'

class Ok1 {
  constructor(private store: Store) {}
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok2 {
  constructor(private store: Store) {}
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok3 {
  foo$ = select(selector)

  constructor(private store: Store) {}
}`,
  `
import { select } from '@my-org/framework'
import { Store } from '@ngrx/store'

class Ok4 {
  foo$ = this.store.pipe(select(selector))

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok5 {
  foo$ = this.store.select(selector)

  constructor(private store: Store) {}
}`,
  `
import { Store } from '@ngrx/store'

class Ok6 {
  foo$ = this.store.select(selector)

  constructor(private store: Store) {}
}`,
  `
import { Store, select } from '@ngrx/store'

class Ok7 {
  foo$ = this.customName.select(selector)
  constructor(private customName: Store) {}
}`,
  {
    code: `
import { Store, select } from '@ngrx/store'

class Ok8 {
  foo$ = this.store.pipe(select(selector))

  constructor(private store: Store) {}
}`,
    options: [SelectStyle.Operator],
  },
  {
    code: `
import { select, Store } from '@ngrx/store'

class Ok9 {
  foo$ = this.store.select(selector)

  constructor(private store: Store) {}
}`,
    options: [SelectStyle.Method],
  },
];

const validInject: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok10 {
  private store = inject(Store)
}`,
  `
import { Store, select } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok11 {
  private store = inject(Store)
}`,
  `
import { Store, select } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok12 {
  private store = inject(Store)
  foo$ = select(selector)
}`,
  `
import { select } from '@my-org/framework'
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok13 {
  private store = inject(Store)
  foo$ = this.store.pipe(select(selector))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok14 {
  private store = inject(Store)
  foo$ = this.store.select(selector)
}`,
  `
import { Store, select } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok15 {
  private customName = inject(Store)
  foo$ = this.customName.select(selector)
}`,
  {
    code: `
import { Store, select } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok16 {
  private store = inject(Store)
  foo$ = this.store.pipe(select(selector))
}`,
    options: [SelectStyle.Operator],
  },
  {
    code: `
import { select, Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok17 {
  private store = inject(Store)
  foo$ = this.store.select(selector)
}`,
    options: [SelectStyle.Method],
  },
];

const invalidConstructor: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { select, Store } from '@ngrx/store'
         ~~~~~~ [${SelectStyle.Method}]

class NotOk {
  foo$ = this.store.pipe( select(selector), )
                          ~~~~~~ [${SelectStyle.Method}]

  constructor(private store: Store) {}
}`,
    {
      output: `
import {  Store } from '@ngrx/store'

class NotOk {
  foo$ = this.store. select((selector), )

  constructor(private store: Store) {}
}`,
    }
  ),
  fromFixture(
    `
import { Store, select } from '@ngrx/store'
                ~~~~~~ [${SelectStyle.Method}]

class NotOk1 {
  foo$ = this.store.pipe  (select
                           ~~~~~~ [${SelectStyle.Method}]
    (selector, selector2), filter(Boolean))

  constructor(private store: Store) {}
}`,
    {
      options: [SelectStyle.Method],
      output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  foo$ = this.store.select
    (selector, selector2).pipe  ( filter(Boolean))

  constructor(private store: Store) {}
}`,
    }
  ),
  fromFixture(
    `
import { select, Store } from '@ngrx/store'

class NotOk2 {
  bar$: Observable<unknown>
  foo$: Observable<unknown>

  constructor(store: Store, private readonly customStore: Store) {
    this.foo$ = store.select(
                      ~~~~~~ [${SelectStyle.Operator}]
      selector,
    )
  }

  ngOnInit() {
    this.bar$ = this.customStore.select(
                                 ~~~~~~ [${SelectStyle.Operator}]
      selector,
    )
  }
}`,
    {
      options: [SelectStyle.Operator],
      output: `
import { select, Store } from '@ngrx/store'

class NotOk2 {
  bar$: Observable<unknown>
  foo$: Observable<unknown>

  constructor(store: Store, private readonly customStore: Store) {
    this.foo$ = store.pipe(select(
      selector,
    ))
  }

  ngOnInit() {
    this.bar$ = this.customStore.pipe(select(
      selector,
    ))
  }
}`,
    }
  ),
  fromFixture(
    `
import {
  Store,
  select,
  ~~~~~~ [${SelectStyle.Method}]
} from '@ngrx/store'

class NotOk3 {
  foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                         ~~~~~~ [${SelectStyle.Method}]
  bar$ = this.store.
    select(selector).pipe()
  baz$ = this.store.pipe(
    select(({ customers }) => customers), map(toItem),
    ~~~~~~ [${SelectStyle.Method}]
  ).pipe()

  constructor(private store: Store) {}
}

class NotOk4 {
  foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                         ~~~~~~ [${SelectStyle.Method}]

  constructor(private readonly store: Store) {}
}`,
    {
      options: [SelectStyle.Method],
      output: `
import {
  Store,
} from '@ngrx/store'

class NotOk3 {
  foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
  bar$ = this.store.
    select(selector).pipe()
  baz$ = this.store.select(({ customers }) => customers).pipe(
     map(toItem),
  ).pipe()

  constructor(private store: Store) {}
}

class NotOk4 {
  foo$ = this.store.select(selector).pipe( map(toItem)).pipe()

  constructor(private readonly store: Store) {}
}`,
    }
  ),
  fromFixture(
    `
import type {Creator} from '@ngrx/store'
import { Store } from '@ngrx/store'

class NotOk5 {
  foo$ = this.store.select(selector)
                    ~~~~~~ [${SelectStyle.Operator}]

  constructor(private store: Store) {}
}`,
    {
      options: [SelectStyle.Operator],
      output: `
import type {Creator} from '@ngrx/store'
import { Store, select } from '@ngrx/store'

class NotOk5 {
  foo$ = this.store.pipe(select(selector))

  constructor(private store: Store) {}
}`,
    }
  ),
];

const invalidInject: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { select, Store } from '@ngrx/store'
         ~~~~~~ [${SelectStyle.Method}]
import { inject } from '@angular/core'

class NotOk6 {
  private store = inject(Store)
  foo$ = this.store.pipe( select(selector), )
                          ~~~~~~ [${SelectStyle.Method}]
}`,
    {
      output: `
import {  Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  private store = inject(Store)
  foo$ = this.store. select((selector), )
}`,
    }
  ),
  fromFixture(
    `
import { Store, select } from '@ngrx/store'
                ~~~~~~ [${SelectStyle.Method}]
import { inject } from '@angular/core'

class NotOk7 {
  private store = inject(Store)
  foo$ = this.store.pipe  (select
                           ~~~~~~ [${SelectStyle.Method}]
    (selector, selector2), filter(Boolean))
}`,
    {
      options: [SelectStyle.Method],
      output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  private store = inject(Store)
  foo$ = this.store.select
    (selector, selector2).pipe  ( filter(Boolean))
}`,
    }
  ),
  fromFixture(
    `
import { select, Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk8 {
  private store = inject(Store)
  private customStore = inject(Store)
  foo$ = this.store.select(
                    ~~~~~~ [${SelectStyle.Operator}]
    selector,
  )
  bar$: Observable<unknown>

  ngOnInit() {
    this.bar$ = this.customStore.select(
                                 ~~~~~~ [${SelectStyle.Operator}]
      selector,
    )
  }
}`,
    {
      options: [SelectStyle.Operator],
      output: `
import { select, Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk8 {
  private store = inject(Store)
  private customStore = inject(Store)
  foo$ = this.store.pipe(select(
    selector,
  ))
  bar$: Observable<unknown>

  ngOnInit() {
    this.bar$ = this.customStore.pipe(select(
      selector,
    ))
  }
}`,
    }
  ),
  fromFixture(
    `
import {
  Store,
  select,
  ~~~~~~ [${SelectStyle.Method}]
} from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk9 {
  private store = inject(Store)
  foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                         ~~~~~~ [${SelectStyle.Method}]
  bar$ = this.store.
    select(selector).pipe()
  baz$ = this.store.pipe(
    select(({ customers }) => customers), map(toItem),
    ~~~~~~ [${SelectStyle.Method}]
  ).pipe()
}

class NotOk10 {
  private readonly store = inject(Store)
  foo$ = this.store.pipe(select(selector), map(toItem)).pipe()
                         ~~~~~~ [${SelectStyle.Method}]
}`,
    {
      options: [SelectStyle.Method],
      output: `
import {
  Store,
} from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk9 {
  private store = inject(Store)
  foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
  bar$ = this.store.
    select(selector).pipe()
  baz$ = this.store.select(({ customers }) => customers).pipe(
     map(toItem),
  ).pipe()
}

class NotOk10 {
  private readonly store = inject(Store)
  foo$ = this.store.select(selector).pipe( map(toItem)).pipe()
}`,
    }
  ),
  fromFixture(
    `
import type {Creator} from '@ngrx/store'
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk11 {
  private store = inject(Store)
  foo$ = this.store.select(selector)
                    ~~~~~~ [${SelectStyle.Operator}]
}`,
    {
      options: [SelectStyle.Operator],
      output: `
import type {Creator} from '@ngrx/store'
import { Store, select } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk11 {
  private store = inject(Store)
  foo$ = this.store.pipe(select(selector))
}`,
    }
  ),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: [...validConstructor(), ...validInject()],
    invalid: [...invalidConstructor(), ...invalidInject()],
  }
);

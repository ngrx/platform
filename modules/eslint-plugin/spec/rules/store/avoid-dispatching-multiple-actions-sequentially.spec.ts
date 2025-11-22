import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/store/avoid-dispatching-multiple-actions-sequentially';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const validConstructor: () => (string | ValidTestCase<Options>)[] = () => [
  `
  import { Store } from '@ngrx/store'

  class Ok {
  ngOnInit() {
    this.dispatch(UserActions.add())
  }
  }`,
  `
  import { Store } from '@ngrx/store'

  class Ok1 {
  constructor(private store: Store) {}

  ping() {
    this.store.dispatch(GameActions.ping())
  }
  }`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/47
  `
  import { Store } from '@ngrx/store'

  class Ok2 {
  constructor(private store: Store) {}

  pingPong() {
    if (condition) {
      this.store.dispatch(GameActions.ping())
    } else {
      this.store.dispatch(GameActions.pong())
    }
  }
  }`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/86
  `
  import { Store } from '@ngrx/store'

  class Ok3 {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.subscribe(() => {
      this.store.dispatch(one());
    });
    this.store.subscribe(() => {
      this.store.dispatch(anotherOne());
    });
  }
  }`,
  // https://github.com/ngrx/platform/issues/3513
  `
  import { Store } from '@ngrx/store'

  class Ok4 {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(one());

    this.store.subscribe(() => {
      this.store.dispatch(anotherOne());
    });
  }
  }`,
  // https://github.com/ngrx/platform/issues/3513
  `
  import { Store } from '@ngrx/store'

  class Ok5 {
  constructor(private store: Store) {}

  ngOnInit() {
    this.store.dispatch(anotherOne());

    this.store.subscribe(() => {
      this.store.dispatch(one());
    });
  }
  }`,
];

const validInject: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok6 {
private readonly store = inject(Store)

ping() {
  this.store.dispatch(GameActions.ping())
}
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok7 {
private readonly store = inject(Store)

pingPong() {
  if (condition) {
    this.store.dispatch(GameActions.ping())
  } else {
    this.store.dispatch(GameActions.pong())
  }
}
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok8 {
private readonly store = inject(Store)

ngOnInit() {
  this.store.subscribe(() => {
    this.store.dispatch(one());
  });
  this.store.subscribe(() => {
    this.store.dispatch(anotherOne());
  });
}
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok9 {
private readonly store = inject(Store)

ngOnInit() {
  this.store.dispatch(one());

  this.store.subscribe(() => {
    this.store.dispatch(anotherOne());
  });
}
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok10 {
private readonly store = inject(Store)

ngOnInit() {
  this.store.dispatch(anotherOne());

  this.store.subscribe(() => {
    this.store.dispatch(one());
  });
}
}`,
];

const invalidConstructor: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
  import { Store } from '@ngrx/store'

  class NotOk {
  constructor(private store: Store) {}

  pingPong() {
    this.store.dispatch(GameActions.ping())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store.dispatch(GameActions.pong())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
  }`),
  fromFixture(`
  import { Store } from '@ngrx/store'

  class NotOk1 {
  constructor(store: Store, private readonly store$: Store) {
    store.dispatch(GameActions.ping())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.ping();
    this.name = 'Bob'
    this.store$.dispatch(GameActions.pong())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
  }`),
  fromFixture(`
  import { Store } from '@ngrx/store'

  class NotOk2 {
  constructor(private store: Store) {}

  pingPongPong() {
    this.store.dispatch(GameActions.ping())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store.dispatch(GameActions.pong())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store.dispatch(GameActions.pong())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
  }`),
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/44
  fromFixture(`
  import { Store } from '@ngrx/store'

  class NotOk3 {
  constructor(private customName: Store) {}

  ngOnInit() {
    customName.dispatch()
  }

  pingPong() {
    this.customName.dispatch(GameActions.ping())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.customName.dispatch(GameActions.pong())
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
  }`),
];

const invalidInject: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk4 {
private readonly store = inject(Store)

pingPong() {
  this.store.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.store.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk5 {
private readonly store = inject(Store)
private readonly store$ = inject(Store)
constructor() {
  store.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.ping();
  this.name = 'Bob'
  this.store$.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
private readonly store = inject(Store)

pingPongPong() {
  this.store.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.store.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.store.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
  fromFixture(`
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
private readonly customName = inject(Store)

ngOnInit() {
  customName.dispatch()
}

pingPong() {
  this.customName.dispatch(GameActions.ping())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  this.customName.dispatch(GameActions.pong())
  ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}
}`),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: [...validConstructor(), ...validInject()],
    invalid: [...invalidConstructor(), ...invalidInject()],
  }
);

import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  noDispatchInEffects,
  noDispatchInEffectsSuggest,
} from '../../../src/rules/effects/no-dispatch-in-effects';
import { ruleTester } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const validConstructor: () => RunTests['valid'] = () => [
  `
  import { Store } from '@ngrx/store'
  
  class Ok {
    readonly effect = somethingOutside();
  }`,
  `
  import { Store } from '@ngrx/store'
  
  class Ok1 {
    effect = createEffect(() => this.actions.pipe(
      ofType('PING'),
      tap(() => ({ type: 'PONG' }))
    ))
  
    constructor(private actions: Actions, private store: Store) {}
  }`,
  `
  import { Store } from '@ngrx/store'
  
  class Ok2 {
    readonly effect: CreateEffectMetadata
  
    constructor(private actions: Actions, private store$: Store) {
        this.effect = createEffect(
        () => ({ scheduler = asyncScheduler } = {}) =>
          this.actions.pipe(
            ofType(customerActions.remove),
            tap(() => {
              customObject.dispatch({ somethingElse: true })
              return customerActions.removeSuccess()
            }),
          ),
        { dispatch: false },
      )
    }
  }`,
];

const validInject: () => RunTests['valid'] = () => [
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok3 {
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);

  effect = createEffect(() => this.actions.pipe(
    ofType('PING'),
    tap(() => ({ type: 'PONG' }))
  ))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/inject'

class Ok4 {
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);

  effect = createEffect(() => this.actions.pipe(
    ofType('PING'),
    tap(() => ({ type: 'PONG' }))
  ))
}`,
  `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class Ok5 {
  readonly effect: CreateEffectMetadata
  private readonly actions = inject(Actions);
  private readonly store$ = inject(Store);

  constructor() {
      this.effect = createEffect(
      () => ({ scheduler = asyncScheduler } = {}) =>
        this.actions.pipe(
          ofType(customerActions.remove),
          tap(() => {
            customObject.dispatch({ somethingElse: true })
            return customerActions.removeSuccess()
          }),
        ),
      { dispatch: false },
    )
  }
}`,
];

const invalidConstructor: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk {
  effect = createEffect(
    () => {
      return this.actions.pipe(
        ofType(someAction),
        tap(() => this.store.dispatch(awesomeAction())),
                  ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest]
      )
    },
    { dispatch: false },
  )

  constructor(private actions: Actions, private store: Store) {}
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk {
  effect = createEffect(
    () => {
      return this.actions.pipe(
        ofType(someAction),
        tap(() => (awesomeAction())),
      )
    },
    { dispatch: false },
  )

  constructor(private actions: Actions, private store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk1 {
  readonly effect = createEffect(() => condition ? this.actions.pipe(
    ofType(userActions.add),
    tap(() => {
      return this.store.dispatch(userActions.addSuccess)
             ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest]
    })
  ) : this.actions.pipe())

  constructor(private actions: Actions, private store: Store) {}
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk1 {
  readonly effect = createEffect(() => condition ? this.actions.pipe(
    ofType(userActions.add),
    tap(() => {
      return (userActions.addSuccess)
    })
  ) : this.actions.pipe())

  constructor(private actions: Actions, private store: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk2 {
  effect = createEffect(
    () => ({ debounce = 200 } = {}) =>
      this.actions.pipe(
        ofType(actions.ping),
        tap(() => {
          return this.customName.dispatch(/* you shouldn't do this */ actions.pong())
                 ~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest]
        }),
      ),
  )

  constructor(private actions: Actions, private customName: Store) {}
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk2 {
  effect = createEffect(
    () => ({ debounce = 200 } = {}) =>
      this.actions.pipe(
        ofType(actions.ping),
        tap(() => {
          return (/* you shouldn't do this */ actions.pong())
        }),
      ),
  )

  constructor(private actions: Actions, private customName: Store) {}
}`,
        },
      ],
    }
  ),
  fromFixture(
    `
import { Store } from '@ngrx/store'

class NotOk3 {
  readonly effect : CreateEffectMetadata
  readonly effect : CreateEffectMetadata

  constructor(private actions: Actions, store: Store, private readonly store$: Store) {
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          map(() => {
            this.store$.dispatch(bookActions.loadSuccess());// you shouldn't do this
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest 0]
            return somethingElse()
          }),
        ),
      { dispatch: true, useEffectsErrorHandler: false, ...options },
    )
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          tap(() => store.dispatch(bookActions.loadSuccess()))
                    ~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest 1]
        ),
    )
  }

  ngOnDestroy() {
    store.dispatch()
  }
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  readonly effect : CreateEffectMetadata
  readonly effect : CreateEffectMetadata

  constructor(private actions: Actions, store: Store, private readonly store$: Store) {
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          map(() => {
            ;// you shouldn't do this
            return somethingElse()
          }),
        ),
      { dispatch: true, useEffectsErrorHandler: false, ...options },
    )
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          tap(() => store.dispatch(bookActions.loadSuccess()))
        ),
    )
  }

  ngOnDestroy() {
    store.dispatch()
  }
}`,
        },
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'

class NotOk3 {
  readonly effect : CreateEffectMetadata
  readonly effect : CreateEffectMetadata

  constructor(private actions: Actions, store: Store, private readonly store$: Store) {
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          map(() => {
            this.store$.dispatch(bookActions.loadSuccess());// you shouldn't do this
            return somethingElse()
          }),
        ),
      { dispatch: true, useEffectsErrorHandler: false, ...options },
    )
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          tap(() => (bookActions.loadSuccess()))
        ),
    )
  }

  ngOnDestroy() {
    store.dispatch()
  }
}`,
        },
      ],
    }
  ),
];

const invalidInject: () => RunTests['invalid'] = () => [
  fromFixture(
    `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk4 {
  private actions = inject(Actions);
  private store = inject(Store);

  effect = createEffect(
    () => {
      return this.actions.pipe(
        ofType(someAction),
        tap(() => this.store.dispatch(awesomeAction())),
                  ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest]
      )
    },
    { dispatch: false },
  )
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk4 {
  private actions = inject(Actions);
  private store = inject(Store);

  effect = createEffect(
    () => {
      return this.actions.pipe(
        ofType(someAction),
        tap(() => (awesomeAction())),
      )
    },
    { dispatch: false },
  )
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
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);
  readonly effect = createEffect(() => condition ? this.actions.pipe(
    ofType(userActions.add),
    tap(() => {
      return this.store.dispatch(userActions.addSuccess)
             ~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest]
    })
  ) : this.actions.pipe())
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk5 {
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);
  readonly effect = createEffect(() => condition ? this.actions.pipe(
    ofType(userActions.add),
    tap(() => {
      return (userActions.addSuccess)
    })
  ) : this.actions.pipe())
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
  private readonly actions = inject(Actions);
  private readonly customName = inject(Store);
  effect = createEffect(
    () => ({ debounce = 200 } = {}) =>
      this.actions.pipe(
        ofType(actions.ping),
        tap(() => {
          return this.customName.dispatch(/* you shouldn't do this */ actions.pong())
                 ~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest]
        }),
      ),
  )
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk6 {
  private readonly actions = inject(Actions);
  private readonly customName = inject(Store);
  effect = createEffect(
    () => ({ debounce = 200 } = {}) =>
      this.actions.pipe(
        ofType(actions.ping),
        tap(() => {
          return (/* you shouldn't do this */ actions.pong())
        }),
      ),
  )
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
  readonly effect : CreateEffectMetadata
  readonly effect : CreateEffectMetadata
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);
  private readonly store$ = inject(Store);

  constructor() {
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          map(() => {
            this.store$.dispatch(bookActions.loadSuccess());// you shouldn't do this
            ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest 0]
            return somethingElse()
          }),
        ),
      { dispatch: true, useEffectsErrorHandler: false, ...options },
    )
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          tap(() => store.dispatch(bookActions.loadSuccess()))
                    ~~~~~~~~~~~~~~ [${noDispatchInEffects} suggest 1]
        ),
    )
  }

  ngOnDestroy() {
    store.dispatch()
  }
}`,
    {
      suggestions: [
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  readonly effect : CreateEffectMetadata
  readonly effect : CreateEffectMetadata
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);
  private readonly store$ = inject(Store);

  constructor() {
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          map(() => {
            ;// you shouldn't do this
            return somethingElse()
          }),
        ),
      { dispatch: true, useEffectsErrorHandler: false, ...options },
    )
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          tap(() => store.dispatch(bookActions.loadSuccess()))
        ),
    )
  }

  ngOnDestroy() {
    store.dispatch()
  }
}`,
        },
        {
          messageId: noDispatchInEffectsSuggest,
          output: `
import { Store } from '@ngrx/store'
import { inject } from '@angular/core'

class NotOk7 {
  readonly effect : CreateEffectMetadata
  readonly effect : CreateEffectMetadata
  private readonly actions = inject(Actions);
  private readonly store = inject(Store);
  private readonly store$ = inject(Store);

  constructor() {
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          map(() => {
            this.store$.dispatch(bookActions.loadSuccess());// you shouldn't do this
            return somethingElse()
          }),
        ),
      { dispatch: true, useEffectsErrorHandler: false, ...options },
    )
    this.effect = createEffect(
      () =>
        this.actions.pipe(
          ofType(bookActions.load),
          tap(() => (bookActions.loadSuccess()))
        ),
    )
  }

  ngOnDestroy() {
    store.dispatch()
  }
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

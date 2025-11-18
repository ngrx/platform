import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/operators/prefer-concat-latest-from';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[0][];

const valid: () => (string | ValidTestCase<Options>)[] = () => [
  {
    code: `
  import { of, withLatestFrom } from 'rxjs'
  class Ok {
    effect = createEffect(
      () =>
        this.actions$.pipe(
          ofType(CollectionApiActions.addBookSuccess),
          concatLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
          switchMap(([, bookCollection]) => {
            return of({ type: 'noop' })
          })
        ),
    );
  }`,
    options: [{ strict: true }],
  },
  `
  import { Actions } from '@ngrx/effects'
  import { of, withLatestFrom } from 'rxjs'
  class Ok1 {
    readonly effect: CreateEffectMetadata
    constructor(actions$: Actions) {
      this.effect = createEffect(() => ({ scheduler = asyncScheduler } = {}) => {
        return actions$.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
          ),
          mergeMapTo(of({ type: 'noop' })),
        )
      }, { dispatch: false })
    }
  }`,
  `
  import { Actions } from '@ngrx/effects'
  import { of, withLatestFrom } from 'rxjs'
  class Ok2 {
    effect = createEffect(() =>
      condition
        ? this.actions$.pipe(
            ofType(ProductDetailPage.loaded),
            concatMap((action) =>
              of(action).pipe(
                withLatestFrom(this.store.select$(something), (one, other) =>
                  somethingElse(),
                ),
              ),
            ),
            mergeMap(([action, products]) => of(products)),
          )
        : this.actions$.pipe(),
    )
    constructor(private readonly actions$: Actions) {}
  }`,
  `
  import { Actions } from '@ngrx/effects'
  import { of, withLatestFrom } from 'rxjs'
  import { inject } from '@angular/core'
  class Ok3 {
    readonly effect: CreateEffectMetadata
    readonly actions$ = inject(Actions)
    constructor() {
      this.effect = createEffect(() => ({ scheduler = asyncScheduler } = {}) => {
        return actions$.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
          ),
          mergeMapTo(of({ type: 'noop' })),
        )
      }, { dispatch: false })
    }
  }`,
  `
  import { Actions } from '@ngrx/effects'
  import { of, withLatestFrom } from 'rxjs'
  import { inject } from '@angular/core'
  class Ok4 {
    private readonly actions$ = inject(Actions)
    effect = createEffect(() =>
      condition
        ? this.actions$.pipe(
            ofType(ProductDetailPage.loaded),
            concatMap((action) =>
              of(action).pipe(
                withLatestFrom(this.store.select$(something), (one, other) =>
                  somethingElse(),
                ),
              ),
            ),
            mergeMap(([action, products]) => of(products)),
          )
        : this.actions$.pipe(),
    )
  }`,
];

const invalid: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(
    `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'

class NotOk {
  effect = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionApiActions.addBookSuccess),
      withLatestFrom((action) =>
      ~~~~~~~~~~~~~~ [${messageId}]
        this.store.select(fromBooks.selectCollectionBookIds),
      ),
      switchMap(([action, bookCollection]) => {
        return of({ type: 'noop' })
      }),
    ),
  )

  constructor(private readonly actions$: Actions) {}
}`,
    {
      output: `import { concatLatestFrom } from '@ngrx/operators';
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'

class NotOk {
  effect = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionApiActions.addBookSuccess),
      concatLatestFrom((action) =>
        this.store.select(fromBooks.selectCollectionBookIds),
      ),
      switchMap(([action, bookCollection]) => {
        return of({ type: 'noop' })
      }),
    ),
  )

  constructor(private readonly actions$: Actions) {}
}`,
    }
  ),
  fromFixture(
    `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'

class NotOk {
  effect = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionApiActions.addBookSuccess),
      withLatestFrom((action) =>
      ~~~~~~~~~~~~~~ [${messageId}]
        this.store.select(fromBooks.selectCollectionBookIds),
        this.store.select(fromBooks.selectWishlist),
      ),
      switchMap(([action, bookCollection, wishlist]) => {
        return of({ type: 'noop' })
      }),
    ),
  )

  constructor(private readonly actions$: Actions) {}
}`
  ),
  fromFixture(
    `
import { Actions } from '@ngrx/effects'
import { tapResponse } from '@ngrx/operators'
import { of, withLatestFrom } from 'rxjs'

class NotOk1 {
  readonly effect: CreateEffectMetadata

  constructor(actions$: Actions) {
    this.effect = createEffect(
      () =>
        ({ debounce = 300 } = {}) =>
          condition
            ? actions$.pipe()
            : actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(() => this.store.select(fromBooks.selectCollectionBookIds)),
                ~~~~~~~~~~~~~~ [${messageId}]
                switchMap(([action, bookCollection]) => {
                  return of({ type: 'noop' })
                }),
              ),
    )
  }
}`,
    {
      output: `
import { Actions } from '@ngrx/effects'
import { tapResponse, concatLatestFrom } from '@ngrx/operators'
import { of, withLatestFrom } from 'rxjs'

class NotOk1 {
  readonly effect: CreateEffectMetadata

  constructor(actions$: Actions) {
    this.effect = createEffect(
      () =>
        ({ debounce = 300 } = {}) =>
          condition
            ? actions$.pipe()
            : actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                concatLatestFrom(() => this.store.select(fromBooks.selectCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return of({ type: 'noop' })
                }),
              ),
    )
  }
}`,
    }
  ),
  fromFixture(
    `
import { of, withLatestFrom } from 'rxjs'

class NotOk2 {
  effect = createEffect(() => ({ debounce = 700 } = {}) => {
    return this.actions$.pipe(
      ofType(ProductDetailPage.loaded),
      concatMap((action) =>
        of(action).pipe(withLatestFrom(this.store.select(selectProducts))),
                        ~~~~~~~~~~~~~~ [${messageId}]
      ),
      mergeMapTo(of({ type: 'noop' })),
    )
  }, { dispatch: false })
}`,
    {
      options: [{ strict: true }],
      output: `import { concatLatestFrom } from '@ngrx/operators';
import { of, withLatestFrom } from 'rxjs'

class NotOk2 {
  effect = createEffect(() => ({ debounce = 700 } = {}) => {
    return this.actions$.pipe(
      ofType(ProductDetailPage.loaded),
      concatMap((action) =>
        of(action).pipe(concatLatestFrom(() => this.store.select(selectProducts))),
      ),
      mergeMapTo(of({ type: 'noop' })),
    )
  }, { dispatch: false })
}`,
    }
  ),
  fromFixture(
    `
import { concatLatestFrom } from '@ngrx/operators'
import { of, withLatestFrom } from 'rxjs'

class NotOk3 {
  effect = createEffect(() => {
    return condition
      ? this.actions$.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(
              withLatestFrom(this.store.select$(something), (one, other) => somethingElse()),
              ~~~~~~~~~~~~~~ [${messageId}]
            ),
          ),
          mergeMap(([action, products]) => of(products)),
        )
      : this.actions$.pipe()
  })
}`,
    {
      options: [{ strict: true }],
      output: `import { map } from 'rxjs/operators';
import { concatLatestFrom } from '@ngrx/operators'
import { of, withLatestFrom } from 'rxjs'

class NotOk3 {
  effect = createEffect(() => {
    return condition
      ? this.actions$.pipe(
          ofType(ProductDetailPage.loaded),
          concatMap((action) =>
            of(action).pipe(
              concatLatestFrom(() => this.store.select$(something),), map( (one, other) => somethingElse()),
            ),
          ),
          mergeMap(([action, products]) => of(products)),
        )
      : this.actions$.pipe()
  })
}`,
    }
  ),
  fromFixture(
    `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
import { inject } from '@angular/core'

class NotOk4 {
  private readonly actions$ = inject(Actions);
  effect = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionApiActions.addBookSuccess),
      withLatestFrom((action) =>
      ~~~~~~~~~~~~~~ [${messageId}]
        this.store.select(fromBooks.selectCollectionBookIds),
      ),
      switchMap(([action, bookCollection]) => {
        return of({ type: 'noop' })
      }),
    ),
  )
}`,
    {
      output: `import { concatLatestFrom } from '@ngrx/operators';
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
import { inject } from '@angular/core'

class NotOk4 {
  private readonly actions$ = inject(Actions);
  effect = createEffect(() =>
    this.actions$.pipe(
      ofType(CollectionApiActions.addBookSuccess),
      concatLatestFrom((action) =>
        this.store.select(fromBooks.selectCollectionBookIds),
      ),
      switchMap(([action, bookCollection]) => {
        return of({ type: 'noop' })
      }),
    ),
  )
}`,
    }
  ),
  fromFixture(
    `
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
import { inject } from '@angular/core'

class NotOk5 {
  readonly effect: CreateEffectMetadata
  readonly actions$ = inject(Actions)

  constructor() {
    this.effect = createEffect(
      () =>
        ({ debounce = 300 } = {}) =>
          condition
            ? actions$.pipe()
            : actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                withLatestFrom(() => this.store.select(fromBooks.selectCollectionBookIds)),
                ~~~~~~~~~~~~~~ [${messageId}]
                switchMap(([action, bookCollection]) => {
                  return of({ type: 'noop' })
                }),
              ),
    )
  }
}`,
    {
      output: `import { concatLatestFrom } from '@ngrx/operators';
import { Actions } from '@ngrx/effects'
import { of, withLatestFrom } from 'rxjs'
import { inject } from '@angular/core'

class NotOk5 {
  readonly effect: CreateEffectMetadata
  readonly actions$ = inject(Actions)

  constructor() {
    this.effect = createEffect(
      () =>
        ({ debounce = 300 } = {}) =>
          condition
            ? actions$.pipe()
            : actions$.pipe(
                ofType(CollectionApiActions.addBookSuccess),
                concatLatestFrom(() => this.store.select(fromBooks.selectCollectionBookIds)),
                switchMap(([action, bookCollection]) => {
                  return of({ type: 'noop' })
                }),
              ),
    )
  }
}`,
    }
  ),
];

ruleTester(rule.meta.docs?.requiresTypeChecking).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);

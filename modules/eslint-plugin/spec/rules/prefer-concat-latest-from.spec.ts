import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/effects/prefer-concat-latest-from';
import { NGRX_MODULE_PATHS } from '../../src/utils';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = readonly ESLintUtils.InferOptionsTypeFromRule<typeof rule>[0][];
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const valid: () => RunTests['valid'] = () => [
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
];

const invalid: () => RunTests['invalid'] = () => [
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
      output: `
import { Actions, concatLatestFrom } from '@ngrx/effects'
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
import { Actions, concatLatestFrom } from '@ngrx/effects'
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
      output: `import { concatLatestFrom } from '@ngrx/effects';\n
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
import { concatLatestFrom } from '@ngrx/effects'
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
      output: `import { map } from 'rxjs/operators';\n
import { concatLatestFrom } from '@ngrx/effects'
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
];

const validNgrx11 = [
  `
import { of, withLatestFrom } from 'rxjs';

class Ok {
  effect = createEffect(
    () =>
      this.actions$.pipe(
        ofType(CollectionApiActions.addBookSuccess),
        withLatestFrom(action => this.store.select(fromBooks.getCollectionBookIds)),
        switchMap(([action, bookCollection]) => {
          return of({ type: 'noop' })
        }),
      ),
  );
}`,
];

ruleTester({ ngrxModule: NGRX_MODULE_PATHS.effects, version: '12.0.0' }).run(
  path.parse(__filename).name,
  rule,
  {
    valid: valid(),
    invalid: invalid(),
  }
);

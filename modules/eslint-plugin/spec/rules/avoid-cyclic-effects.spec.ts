import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, { messageId } from '../../src/rules/effects/avoid-cyclic-effects';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const setup = `
import type { OnRunEffects } from '@ngrx/effects'
import { EffectConfig } from '@ngrx/effects'
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { createAction } from '@ngrx/store'
import { map, tap } from 'rxjs/operators'

const foo = createAction('FOO')
const bar = createAction('BAR')

const fromFoo = {
  foo,
  bar
}
const subject = 'SUBJECT'
const genericFoo = createAction(\`$\{subject} FOO\`)
const genericBar = createAction(\`$\{subject} BAR\`)
`;

const valid: () => RunTests['valid'] = () => [
  `
${setup}
class Effect {
  foo$ = createEffect(() =>
    this.actions$.pipe(
      ofType(foo),
      map(() => bar()),
    ),
  )

  constructor(
    private actions$: Actions,
  ) {}
}`,
  `
${setup}
class Effect {
  foo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(foo),
      map(() => bar()),
    )
  })

  constructor(
    private actions$: Actions,
  ) {}
}`,
  `
${setup}
class Effect {
  foo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(fromFoo.foo),
      map(() => fromFoo.bar()),
    )
  })

  constructor(
    private actions$: Actions,
  ) {}
}`,
  `
${setup}
class Effect {
  foo$ = createEffect(() => {
    return this.actions.pipe(
      ofType(foo),
      mapTo(bar()),
    )
  })

  constructor(
    private actions: Actions,
  ) {}
}`,
  `
${setup}
class Effect {
  foo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(foo),
      tap(() => alert('hi'))
    )
    }, { dispatch: false }
  )

  constructor(
    private actions$: Actions,
  ) {}
}`,
  `
${setup}
class Effect {
  foo$: CreateEffectMetadata

  constructor(
    private actions$: Actions,
  ) {
    this.foo$ = createEffect(() =>
      this.actions$.pipe(
        ofType(genericFoo),
        map(() => genericBar()),
      ),
    )
  }
}`,
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/223
  `
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum OrderEntityActionTypes {
  postPortInData = '[Order Entity] Post PortIn Data',
  postPortInDataSuccess = '[Order Entity] Post PortIn Data Success',
}

class PostPortInData implements Action {
  readonly type = OrderEntityActionTypes.postPortInData
}

class PostPortInDataSuccess implements Action {
  readonly type = OrderEntityActionTypes.postPortInDataSuccess
}

@Injectable()
class Effect {
  readonly postPortInData$ = createEffect(() =>
    this.actions$.pipe(
      ofType<PostPortInData>(OrderEntityActionTypes.postPortInData),
      switchMap(() => of(new PostPortInDataSuccess())),
    ),
  )

  constructor(private readonly actions$: Actions) {}
}`,
];

const invalid: () => RunTests['invalid'] = () => [
  fromFixture(`
${setup}
class Effect {
  foo$ = createEffect(() =>
    this.actions$.pipe(
    ~~~~~~~~~~~~~~~~~~ [${messageId}]
      ofType(foo),
      tap(() => alert('hi'))
    ),
  )

  constructor(
    private actions$: Actions,
  ) {}
}`),
  fromFixture(`
${setup}
class Effect {
  foo$ = createEffect(() => {
    return this.actions$.pipe(
           ~~~~~~~~~~~~~~~~~~ [${messageId}]
      ofType(foo),
      tap(() => alert('hi'))
    )
  })

  constructor(
    private actions$: Actions,
  ) {}
}`),
  fromFixture(`
${setup}
class Effect {
  foo$ = createEffect(() => {
    return this.actions$.pipe(
           ~~~~~~~~~~~~~~~~~~ [${messageId}]
      ofType(foo),
      tap(() => alert('hi'))
    )
  }, { dispatch: true })

  constructor(
    private actions$: Actions,
  ) {}
}`),
  fromFixture(`
${setup}
class Effect {
  foo$ = createEffect(
    () =>
      ({ debounce = 100 } = {}) =>
        debounce
          ? this.actions$.pipe(
            ~~~~~~~~~~~~~~~~~~ [${messageId}]
              ofType(fromFoo.foo),
              tap(() => alert('hi')),
            )
          : this.actions$.pipe(),
  )

  constructor(private actions$: Actions) {}
}`),
  fromFixture(`
${setup}
class Effect {
  foo$: CreateEffectMetadata

  constructor(
    private actions$: Actions,
  ) {
    this.foo$ = createEffect(() =>
      this.actions$.pipe(
      ~~~~~~~~~~~~~~~~~~ [${messageId}]
        ofType(genericFoo),
      ),
    )
  }
}`),
  // https://github.com/timdeschryver/eslint-plugin-ngrx/issues/223
  fromFixture(`
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

enum OrderEntityActionTypes {
  postPortInData = '[Order Entity] Post PortIn Data',
  postPortInDataSuccess = '[Order Entity] Post PortIn Data Success',
}

class PostPortInData implements Action {
  readonly type = OrderEntityActionTypes.postPortInData
}

class PostPortInDataSuccess implements Action {
  readonly type = OrderEntityActionTypes.postPortInDataSuccess
}

@Injectable()
class Effect {
  readonly postPortInData$ = createEffect(() =>
    this.actions$.pipe(
    ~~~~~~~~~~~~~~~~~~ [${messageId}]
      ofType<PostPortInData>(OrderEntityActionTypes.postPortInData),
      switchMap(() => of(new PostPortInData())),
    ),
  )

  constructor(private readonly actions$: Actions) {}
}`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: valid(),
  invalid: invalid(),
});

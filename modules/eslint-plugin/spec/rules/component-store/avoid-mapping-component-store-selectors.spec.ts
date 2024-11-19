import type { ESLintUtils } from '@typescript-eslint/utils';
import type {
  InvalidTestCase,
  ValidTestCase,
} from '@typescript-eslint/rule-tester';
import * as path from 'path';
import rule, {
  messageId,
} from '../../../src/rules/component-store/avoid-mapping-component-store-selectors';
import { ruleTester, fromFixture } from '../../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;

const validConstructor: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok extends ComponentStore<MoviesState> {
  movies$ = this.select((state) => state.movies);
  firstMovie$ = this.select(this.movies$, (movies) => movies[0]);

  constructor() {
    super({ movies: [] })
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok {
  readonly movies$ = this.store.select((state) => state.movies);
  firstMovie$ = this.store.select(this.movies$, (movies) => movies[0]);

  constructor(private readonly store: ComponentStore<MoviesState>) {}
}`,
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok {
  readonly movies$: Observable<unknown>
  readonly firstMovie$: Observable<unknown>

  constructor(private customStore: ComponentStore<MoviesState>) {
    const movies = customStore.select((state) => state.movies);
    this.firstMovie$ = customStore.select(movies, (movies) => movies[0]);
    
    this.movies$ = this.customStore.select((state) => state.movies);
    this.firstMovie$ = this.customStore.select(this.movies$, (movies) => movies[0]);
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store'

export class UserStore extends ComponentStore<UserState> {
  loggedInUser$ = this.select((state) => state.loggedInUser);
  name$ = this.select(this.loggedInUser$, (user) => user.name);
}
`,
];

const validInject: () => (string | ValidTestCase<Options>)[] = () => [
  `
import { inject } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'

class Ok {
  readonly store = inject(ComponentStore<MoviesState>)
  readonly movies$ = this.store.select((state) => state.movies)
  readonly firstMovie$ = this.store.select(this.movies$, (movies) => movies[0]);
}`,
];

const invalidConstructor: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk extends ComponentStore<MoviesState> {
  movies$ = this.select((state) => state.movies).pipe(map((movies) => movies))
                                                      ~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]

  constructor() {
    super({ movies: [] })
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk {
  readonly movies$ = this.customStore.select((state) => state.movies).pipe(
      filter(Boolean), 
      map((movies) => movies)
      ~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  )

  constructor(private readonly customStore: ComponentStore<MoviesState>) {}
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk {
  readonly movies$: Observable<unknown>

  constructor(private customStore: ComponentStore<MoviesState>) {
    this.movies$ = customStore.select((state) => state.movies).pipe(map((movies) => movies), filter(Boolean));
                                                                    ~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.movies$ = this.customStore.select((state) => state.movies).pipe(map((movies) => movies));
                                                                         ~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

export class UserStore extends ComponentStore<UserState> {
  name$ = this.select((state) => state.loggedInUser).pipe(map((user) => user.name));
                                                          ~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}`),
];

const invalidInject: () => InvalidTestCase<MessageIds, Options>[] = () => [
  fromFixture(`
  import { inject } from '@angular/core'
  import { ComponentStore } from '@ngrx/component-store'

  class NotOk {
    readonly otherStoreName = inject(ComponentStore<MoviesState>)
    readonly movie$ = this.otherStoreName.select((state) => state.movies).pipe(
      map((m) => m),
      ~~~~~~~~~~~~~ [${messageId}]
      filter(Boolean),
      map((movies) => movies[0]),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    )
  }`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/component-store/avoid-combining-component-store-selectors';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const validConstructor: () => RunTests['valid'] = () => [
  `
import { ComponentStore } from '@ngrx/component-store'
class Ok extends ComponentStore<MoviesState> {
  movies$ = this.select((state) => state.movies);
  selectedId$ = this.select((state) => state.selectedId);
  movie$ = this.select(
    this.movies$,
    this.selectedId$,
    ([movies, selectedId]) => movies[selectedId]
  );

  constructor() {
    super({ movies: [] })
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store'
class Ok {
  readonly movies$ = this.store.select((state) => state.movies);
  readonly selectedId$ = this.store.select((state) => state.selectedId);
  readonly movie$ = this.store.select(
    this.movies$,
    this.selectedId$,
    ([movies, selectedId]) => movies[selectedId]
  );

  constructor(private readonly store: ComponentStore<MoviesState>) {}
}`,
  `
import { ComponentStore } from '@ngrx/component-store'
class Ok {
  movie$: Observable<unknown>

  constructor(customStore: ComponentStore<MoviesState>) {
    const movies = customStore.select((state) => state.movies);
    const selectedId = this.customStore.select((state) => state.selectedId);
    
    this.movie$ = this.customStore.select(
      this.movies$,
      this.selectedId$,
      ([movies, selectedId]) => movies[selectedId]
    );
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store'
class Ok {
  vm$ = combineLatest(this.somethingElse(), this.customStore.select(selectItems))

  constructor(customStore: ComponentStore<MoviesState>) {}
}`,
  `
import { ComponentStore } from '@ngrx/component-store'
class Ok extends ComponentStore<MoviesState> {
  vm$ = combineLatest(this.select(selectItems), this.somethingElse())
}`,
];

const validInject: () => RunTests['valid'] = () => [
  `
import { inject } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
class Ok {
  readonly store = inject(ComponentStore<MoviesState>)
  readonly movies$ = this.store.select((state) => state.movies);
  readonly selectedId$ = this.store.select((state) => state.selectedId);
  readonly movie$ = this.store.select(
    this.movies$,
    this.selectedId$,
    ([movies, selectedId]) => movies[selectedId]
  );
}`,
  `
import { inject } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
class Ok {
  readonly store = inject(ComponentStore<MoviesState>)
  readonly vm$ = combineLatest(this.store.select(selectItems), somethingElse())
}`,
];

const invalidConstructor: () => RunTests['invalid'] = () => [
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk extends ComponentStore<MoviesState> {
  movie$ = combineLatest(
    this.select((state) => state.movies),
    this.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  );

  constructor() {
    super({ movies: [] })
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk extends ComponentStore<MoviesState> {
  movie$ = combineLatest(
    this.select((state) => state.movies),
    this.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  );

  constructor() {
    super({ movies: [] })
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
class NotOk {
  movie$ = combineLatest(
    this.moviesState.select((state) => state.movies),
    this.moviesState.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  );

  constructor(private readonly moviesState: ComponentStore<MoviesState>) {}
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
class NotOk {
  movie$ = combineLatest(
    this.moviesState.select((state) => state.movies),
    this.moviesState.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.moviesState.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  );

  constructor(private readonly moviesState: ComponentStore<MoviesState>) {}
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
class NotOk {
  movie$: Observable<unknown>

  constructor(store: ComponentStore<MoviesState>) {
    this.movie$ = combineLatest(
      store.select((state) => state.movies),
      store.select((state) => state.selectedId)
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    );
  }
}
`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
class NotOk {
  movie$: Observable<unknown>

  constructor(store: ComponentStore<MoviesState>) {
    this.movie$ = combineLatest(
      store.select((state) => state.movies),
      store.select((state) => state.selectedId),
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
      store.select((state) => state.selectedId)
      ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    );
  }
}
`),
];

const invalidInject: () => RunTests['invalid'] = () => [
  fromFixture(`
import { inject } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
class NotOk {
  readonly componentStore = inject(ComponentStore<MoviesState>)
  readonly movie$ = combineLatest(
    this.componentStore.select((state) => state.movies),
    this.componentStore.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  );
}`),
  fromFixture(`
import { inject } from '@angular/core'
import { ComponentStore } from '@ngrx/component-store'
class NotOk {
  readonly store = inject(ComponentStore<MoviesState>)
  readonly movie$ = combineLatest(
    this.store.select((state) => state.movies),
    this.store.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.store.select((state) => state.selectedId),
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  );
}`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

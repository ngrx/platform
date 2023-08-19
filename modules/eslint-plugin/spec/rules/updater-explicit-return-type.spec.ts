import type {
  ESLintUtils,
  TSESLint,
} from '@typescript-eslint/experimental-utils';
import { fromFixture } from 'eslint-etc';
import * as path from 'path';
import rule, {
  messageId,
} from '../../src/rules/component-store/updater-explicit-return-type';
import { ruleTester } from '../utils';

type MessageIds = ESLintUtils.InferMessageIdsTypeFromRule<typeof rule>;
type Options = ESLintUtils.InferOptionsTypeFromRule<typeof rule>;
type RunTests = TSESLint.RunTests<MessageIds, Options>;

const validConstructor: () => RunTests['valid'] = () => [
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater(
    (state, movie): MoviesState => ({ movies: [...state.movies, movie] }),
  )

  constructor() {
    super({ movies: [] })
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok1 extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater<Movie>(
    (state, movie): MoviesState => ({ movies: [...state.movies, movie] }),
  )

  constructor() {
    super({ movies: [] })
  }
}`,
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok2 {
  readonly addMovie = this.store.updater<Movie>(
    (state, movie): MoviesState => ({
      movies: [...state.movies, movie],
    }),
  )

  constructor(private readonly store: ComponentStore<MoviesState>) {}
}`,
  `
import { ComponentStore } from '@ngrx/component-store'

class Ok3 {
  readonly addMovie: Observable<unknown>

  constructor(customStore: ComponentStore<MoviesState>) {
    this.addMovie = customStore.updater<Movie>(
      (state, movie): MoviesState => ({
        movies: [...state.movies, movie],
      }),
    )
  }
}`,
];

const validInject: () => RunTests['valid'] = () => [
  `
import { ComponentStore } from '@ngrx/component-store'
import { inject } from '@angular/core'

class Ok4 {
  private readonly store = inject(ComponentStore<MoviesState>);
  readonly addMovie = this.store.updater<Movie>(
    (state, movie): MoviesState => ({
      movies: [...state.movies, movie],
    }),
  )
}`,
  `
import { ComponentStore } from '@ngrx/component-store'
import { inject } from '@angular/core'

class Ok5 {
  readonly addMovie: Observable<unknown>
  customStore = inject(ComponentStore<MoviesState>)

  constructor() {
    this.addMovie = this.customStore.updater<Movie>(
      (state, movie): MoviesState => ({
        movies: [...state.movies, movie],
      }),
    )
  }
}`,
];

const invalidConstructor: () => RunTests['invalid'] = () => [
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk extends ComponentStore<MoviesState> {
  readonly addMovie = this.updater((state, movie) => ({ movies: [...state.movies, movie] }))
                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]

  constructor() {
    super({ movies: [] })
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk1 extends ComponentStore<MoviesState> {
  readonly updateMovie: Observable<unknown>
  readonly addMovie = this.updater<Movie | null>((state, movie) => movie ? ({ movies: [...state.movies, movie] }) : ({ movies }))
                                                 ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]

  constructor(componentStore: ComponentStore<MoviesState>) {
    super({ movies: [] })
    this.updateMovie = componentStore.updater(() => ({ movies: MOVIES }))
                                              ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk2 {
  readonly addMovie = this.store.updater((state, movie) => ({ movies: [...state.movies, movie] }))
                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]

  constructor(private readonly store: ComponentStore<MoviesState>) {}
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'

class NotOk3 {
  readonly addMovie: Observable<unknown>
  readonly updateMovie: Observable<unknown>

  constructor(
    customStore: ComponentStore<MoviesState>,
    private readonly store: ComponentStore<MoviesState>
  ) {
    this.addMovie = customStore.updater<Movie>((state, movie) => ({ movies: [...state.movies, movie] }))
                                               ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.updateMovie = this.store.updater(() => ({ movies: MOVIES }))
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }

  ngOnInit() {
    const updater = (item: Movie) => item
    updater()
  }
}`),
  fromFixture(`
@Injectable()
export class CompetitorsStore2 extends CompetitorsStore1 {
  override updateName = this.updater<string>((state, name: string) => ({ ...state, name }));
                                             ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]


  updateName2 = this.updater(() => ({ name: 'test' }));
                             ~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}`),
];

const invalidInject: () => RunTests['invalid'] = () => [
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
import { inject } from '@angular/core'

class NotOk4 {
  componentStore = inject(ComponentStore<MoviesState>)
  readonly updateMovie: Observable<unknown>

  constructor() {
    this.updateMovie = this.componentStore.updater(() => ({ movies: MOVIES }))
                                                   ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
import { inject } from '@angular/core'

class NotOk5 {
  private readonly store = inject(ComponentStore<MoviesState>)
  readonly addMovie = this.store.updater((state, movie) => ({ movies: [...state.movies, movie] }))
                                         ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
}`),
  fromFixture(`
import { ComponentStore } from '@ngrx/component-store'
import { inject } from '@angular/core'

class NotOk6 {
  customStore = inject(ComponentStore<MoviesState>)
  private readonly store = inject(ComponentStore<MoviesState>)
  readonly addMovie: Observable<unknown>
  readonly updateMovie: Observable<unknown>

  constructor() {
    this.addMovie = this.customStore.updater<Movie>((state, movie) => ({ movies: [...state.movies, movie] }))
                                                    ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
    this.updateMovie = this.store.updater(() => ({ movies: MOVIES }))
                                          ~~~~~~~~~~~~~~~~~~~~~~~~~~ [${messageId}]
  }

  ngOnInit() {
    const updater = (item: Movie) => item
    updater()
  }
}`),
];

ruleTester().run(path.parse(__filename).name, rule, {
  valid: [...validConstructor(), ...validInject()],
  invalid: [...invalidConstructor(), ...invalidInject()],
});

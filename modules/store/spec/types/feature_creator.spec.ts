import { expecter } from 'ts-snippet';
import { compilerOptions } from './utils';

describe('createFeature()', () => {
  const expectSnippet = expecter(
    (code) => `
      import {
        ActionReducer,
        createAction,
        createFeature,
        createReducer,
        createSelector,
        on,
        props,
        Selector,
        Store,
        StoreModule,
      } from '@ngrx/store';

      ${code}
    `,
    { ...compilerOptions(), strict: true }
  );

  describe('with default app state type', () => {
    it('should create', () => {
      const snippet = expectSnippet(`
        const search = createAction(
          '[Products Page] Search',
          props<{ query: string }>()
        );
        const loadProductsSuccess = createAction(
          '[Products API] Load Products Success',
          props<{ products: string[] }>()
        );

        interface State {
          products: string[] | null;
          query: string;
        }

        const initialState: State = {
          products: null,
          query: '',
        };

        const productsFeature = createFeature({
          name: 'products',
          reducer: createReducer(
            initialState,
            on(search, (state, { query }) => ({ ...state, query })),
            on(loadProductsSuccess, (state, { products }) => ({
              ...state,
              products,
            }))
          ),
        });

        let {
          name,
          reducer,
          selectProductsState,
          selectProducts,
          selectQuery,
        } = productsFeature;

        let productsFeatureKeys: keyof typeof productsFeature;
      `);

      snippet.toInfer('name', '"products"');
      snippet.toInfer('reducer', 'ActionReducer<State, Action>');
      snippet.toInfer(
        'selectProductsState',
        'MemoizedSelector<Record<string, any>, State, DefaultProjectorFn<State>>'
      );
      snippet.toInfer(
        'selectProducts',
        'MemoizedSelector<Record<string, any>, string[] | null, DefaultProjectorFn<string[] | null>>'
      );
      snippet.toInfer(
        'selectQuery',
        'MemoizedSelector<Record<string, any>, string, DefaultProjectorFn<string>>'
      );
      snippet.toInfer(
        'productsFeatureKeys',
        '"selectProductsState" | "selectQuery" | "selectProducts" | keyof FeatureConfig<"products", State>'
      );
    });

    it('should create a feature when reducer is created outside', () => {
      const snippet = expectSnippet(`
        const counterReducer = createReducer({ count: 0 });
        const counterFeature = createFeature({
          name: 'counter',
          reducer: counterReducer,
        });

        const {
          name,
          reducer,
          selectCounterState,
          selectCount,
        } = counterFeature;
      `);

      snippet.toInfer('name', '"counter"');
      snippet.toInfer('reducer', 'ActionReducer<{ count: number; }, Action>');
      snippet.toInfer(
        'selectCounterState',
        'MemoizedSelector<Record<string, any>, { count: number; }, DefaultProjectorFn<{ count: number; }>>'
      );
      snippet.toInfer(
        'selectCount',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
    });

    it('should allow use with StoreModule.forFeature', () => {
      expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
        });

        StoreModule.forFeature(counterFeature);
      `).toSucceed();
    });

    it('should allow use with untyped store.select', () => {
      const snippet = expectSnippet(`
        const { selectCounterState, selectCount } = createFeature({
          name: 'counter',
          reducer: createReducer({ count: 0 }),
        });

        let store!: Store;
        const counterState$ = store.select(selectCounterState);
        const count$ = store.select(selectCount);
      `);

      snippet.toInfer('counterState$', 'Observable<{ count: number; }>');
      snippet.toInfer('count$', 'Observable<number>');
    });

    it('should allow use with typed store.select', () => {
      const snippet = expectSnippet(`
        const { selectCounterState } = createFeature({
          name: 'counter',
          reducer: createReducer(0),
        });

        let store!: Store<{ counter: number }>;
        const counterState$ = store.select(selectCounterState);
      `);

      snippet.toInfer('counterState$', 'Observable<number>');
    });

    it('should fail when feature state contains optional properties', () => {
      expectSnippet(`
        interface State {
          movies: string[];
          activeProductId?: number;
        }

        const initialState: State = { movies: [], activeProductId: undefined };

        const counterFeature = createFeature({
          name: 'movies',
          reducer: createReducer(initialState),
        });
      `).toFail(/optional properties are not allowed in the feature state/);
    });
  });

  describe('with passed app state type', () => {
    it('should create', () => {
      const snippet = expectSnippet(`
        const enter = createAction('[Books Page] Enter');
        const loadBooksSuccess = createAction(
          '[Books API] Load Books Success',
          props<{ books: Book[] }>()
        );

        interface Book {
          id: number;
          title: string;
        }

        type LoadState = 'init' | 'loading' | 'loaded' | 'error';

        interface BooksState {
          books: Book[];
          loadState: LoadState;
        }

        interface AppState {
          books: BooksState;
        }

        const initialState: BooksState = {
          books: [],
          loadState: 'init',
        };

        const booksFeature = createFeature<AppState>({
          name: 'books',
          reducer: createReducer(
            initialState,
            on(enter, (state) => ({ ...state, loadState: 'loading' })),
            on(loadBooksSuccess, (state, { books }) => ({
              ...state,
              books,
              loadState: 'loaded',
            }))
          ),
        });

        const {
          name,
          reducer,
          selectBooksState,
          selectBooks,
          selectLoadState,
        } = booksFeature;

        let booksFeatureKeys: keyof typeof booksFeature;
      `);

      snippet.toInfer('name', '"books"');
      snippet.toInfer('reducer', 'ActionReducer<BooksState, Action>');
      snippet.toInfer(
        'selectBooksState',
        'MemoizedSelector<AppState, BooksState, DefaultProjectorFn<BooksState>>'
      );
      snippet.toInfer(
        'selectBooks',
        'MemoizedSelector<AppState, Book[], DefaultProjectorFn<Book[]>>'
      );
      snippet.toInfer(
        'selectLoadState',
        'MemoizedSelector<AppState, LoadState, DefaultProjectorFn<LoadState>>'
      );
      snippet.toInfer(
        'booksFeatureKeys',
        '"selectBooksState" | "selectBooks" | "selectLoadState" | keyof FeatureConfig<"books", BooksState>'
      );
    });

    it('should create a feature when reducer is created outside', () => {
      const snippet = expectSnippet(`
        interface State {
          bar: string;
        }
        const initialState: State = { bar: 'ngrx' };

        const fooReducer = createReducer(initialState);
        const fooFeature = createFeature<{ foo: State }>({
          name: 'foo',
          reducer: fooReducer,
        });

        const {
          name,
          reducer,
          selectFooState,
          selectBar,
        } = fooFeature;
      `);

      snippet.toInfer('name', '"foo"');
      snippet.toInfer('reducer', 'ActionReducer<State, Action>');
      snippet.toInfer(
        'selectFooState',
        'MemoizedSelector<{ foo: State; }, State, DefaultProjectorFn<State>>'
      );
      snippet.toInfer(
        'selectBar',
        'MemoizedSelector<{ foo: State; }, string, DefaultProjectorFn<string>>'
      );
    });

    it('should fail when name is not key of app state', () => {
      expectSnippet(`
        interface AppState {
          counter1: number;
          counter2: number;
        }

        const counterFeature = createFeature<AppState>({
          name: 'counter3',
          reducer: createReducer(0),
        });
      `).toFail(
        /Type '"counter3"' is not assignable to type '"counter1" | "counter2"'/
      );
    });

    it('should allow use with StoreModule.forFeature', () => {
      expectSnippet(`
        const counterFeature = createFeature<{ counter: number }>({
          name: 'counter',
          reducer: createReducer(0),
        });

        StoreModule.forFeature(counterFeature);
      `).toSucceed();
    });

    it('should allow use with untyped store.select', () => {
      expectSnippet(`
        const { selectCounterState, selectCount } = createFeature<{ counter: { count: number } }>({
          name: 'counter',
          reducer: createReducer({ count: 0 }),
        });

        let store!: Store;
        const counterState$ = store.select(selectCounterState);
        const count$ = store.select(selectCount);
      `).toFail(
        /Type 'object' is not assignable to type '{ counter: { count: number; }; }'/
      );
    });

    it('should allow use with typed store.select', () => {
      const snippet = expectSnippet(`
        const { selectCounterState } = createFeature<{ counter: number }>({
          name: 'counter',
          reducer: createReducer(0),
        });

        let store!: Store<{ counter: number }>;
        const counterState$ = store.select(selectCounterState);
      `);

      snippet.toInfer('counterState$', 'Observable<number>');
    });

    it('should fail when feature state contains optional properties', () => {
      expectSnippet(`
        interface CounterState {
          count?: number;
        }

        interface AppState {
          counter: CounterState;
        }

        const counterFeature = createFeature<AppState>({
          name: 'counter',
          reducer: createReducer({} as CounterState),
        });
      `).toFail(/optional properties are not allowed in the feature state/);
    });
  });

  describe('nested selectors', () => {
    it('should not create with feature state as a primitive value', () => {
      expectSnippet(`
        const feature = createFeature({
          name: 'primitive',
          reducer: createReducer('text'),
        });

        let featureKeys: keyof typeof feature;
      `).toInfer(
        'featureKeys',
        '"selectPrimitiveState" | keyof FeatureConfig<"primitive", string>'
      );
    });

    it('should not create with feature state as an array', () => {
      expectSnippet(`
        const feature = createFeature({
          name: 'array',
          reducer: createReducer([1, 2, 3]),
        });

        let featureKeys: keyof typeof feature;
      `).toInfer(
        'featureKeys',
        '"selectArrayState" | keyof FeatureConfig<"array", number[]>'
      );
    });

    it('should not create with feature state as a date object', () => {
      expectSnippet(`
        const feature = createFeature({
          name: 'date',
          reducer: createReducer(new Date()),
        });

        let featureKeys: keyof typeof feature;
      `).toInfer(
        'featureKeys',
        '"selectDateState" | keyof FeatureConfig<"date", Date>'
      );
    });
  });

  describe('derived selectors', () => {
    it('should create a feature', () => {
      const snippet = expectSnippet(`
        const increment = createAction('increment');

        interface State {
          count: number;
        }
        const initialState: State = {
          count: 0,
        };

        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(
            initialState,
            on(increment, (state) => ({ count: state.count + 1 }))
          ),
          derivedSelectors: ({ selectCounterState, selectCount }) => ({
            selectCounterState2: createSelector(
              selectCounterState,
              (state) => state
            ),
            selectCountPlus1: createSelector(
              selectCount,
              (count) => count + 1
            ),
          }),
        });

        const {
          name,
          reducer,
          selectCounterState,
          selectCount,
          selectCounterState2,
          selectCountPlus1,
        } = counterFeature;
        let counterFeatureKeys: keyof typeof counterFeature;
      `);

      snippet.toInfer('name', '"counter"');
      snippet.toInfer('reducer', 'ActionReducer<State, Action>');
      snippet.toInfer(
        'selectCounterState',
        'MemoizedSelector<Record<string, any>, State, DefaultProjectorFn<State>>'
      );
      snippet.toInfer(
        'selectCount',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
      snippet.toInfer(
        'selectCounterState2',
        'MemoizedSelector<Record<string, any>, State, (s1: State) => State>'
      );
      snippet.toInfer(
        'selectCountPlus1',
        'MemoizedSelector<Record<string, any>, number, (s1: number) => number>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState" | "selectCount" | "selectCounterState2" | "selectCountPlus1"'
      );
    });

    it('should create a feature when reducer is created outside', () => {
      const snippet = expectSnippet(`
        const counterReducer = createReducer({ count: 0 });

        const counterFeature = createFeature({
          name: 'counter',
          reducer: counterReducer,
          derivedSelectors: ({ selectCounterState, selectCount }) => ({
            selectSquaredCount: createSelector(
              selectCounterState,
              selectCount,
              ({ count }, c) => count * c
            ),
          }),
        });

        const {
          name,
          reducer,
          selectCounterState,
          selectCount,
          selectSquaredCount,
        } = counterFeature;
        let counterFeatureKeys: keyof typeof counterFeature;
      `);

      snippet.toInfer('name', '"counter"');
      snippet.toInfer('reducer', 'ActionReducer<{ count: number; }, Action>');
      snippet.toInfer(
        'selectCounterState',
        'MemoizedSelector<Record<string, any>, { count: number; }, DefaultProjectorFn<{ count: number; }>>'
      );
      snippet.toInfer(
        'selectCount',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
      snippet.toInfer(
        'selectSquaredCount',
        'MemoizedSelector<Record<string, any>, number, (s1: { count: number; }, s2: number) => number>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState" | "selectCount" | "selectSquaredCount"'
      );
    });

    it('should override base selectors if derived selectors have the same names', () => {
      const snippet = expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer({ count1: 0, count2: 0 }),
          derivedSelectors: ({ selectCounterState, selectCount1, selectCount2 }) => ({
            selectCounterState: createSelector(
              selectCount1,
              selectCount2,
              (count3, count4) => ({ count3, count4 })
            ),
            selectCount1: createSelector(selectCount1, (count) => count + ''),
            selectCount10: createSelector(selectCount2, (count) => count + 1),
          }),
        });

        const {
          selectCounterState,
          selectCount1,
          selectCount2,
          selectCount10,
        } = counterFeature;
        let counterFeatureKeys: keyof typeof counterFeature;
      `);

      snippet.toInfer(
        'selectCounterState',
        'MemoizedSelector<Record<string, any>, { count3: number; count4: number; }, (s1: number, s2: number) => { count3: number; count4: number; }>'
      );
      snippet.toInfer(
        'selectCount1',
        'MemoizedSelector<Record<string, any>, string, (s1: number) => string>'
      );
      snippet.toInfer(
        'selectCount2',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
      snippet.toInfer(
        'selectCount10',
        'MemoizedSelector<Record<string, any>, number, (s1: number) => number>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState" | "selectCount1" | "selectCount2" | "selectCount10"'
      );
    });

    it('should not break the feature object when derived selector names are not string literals', () => {
      const snippet = expectSnippet(`
        const untypedSelectors: Record<string, Selector<Record<string, any>, unknown>> = {};

        const counterFeature1 = createFeature({
          name: 'counter1',
          reducer: createReducer(0),
          derivedSelectors: ({ selectCounter1State }) => ({
            ['selectInvalid' as string]: createSelector(
              selectCounter1State,
              (count) => count
            ),
            selectSquaredCount: createSelector(
              selectCounter1State,
              (count) => count * count
            ),
            ...untypedSelectors,
          }),
        });

        const counterFeature2 = createFeature({
          name: 'counter2',
          reducer: createReducer(0),
          derivedSelectors: () => untypedSelectors,
        });

        const { selectCounter1State } = counterFeature1;
        const { selectCounter2State } = counterFeature2;

        let counterFeature1Keys: keyof typeof counterFeature1;
        let counterFeature2Keys: keyof typeof counterFeature2;
      `);

      snippet.toInfer(
        'selectCounter1State',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
      snippet.toInfer(
        'selectCounter2State',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
      snippet.toInfer(
        'counterFeature1Keys',
        '"selectCounter1State" | keyof FeatureConfig<"counter1", number>'
      );
      snippet.toInfer(
        'counterFeature2Keys',
        '"selectCounter2State" | keyof FeatureConfig<"counter2", number>'
      );
    });

    it('should not break the feature object when derived selectors are an empty object', () => {
      const snippet = expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          derivedSelectors: () => ({}),
        });

        const { selectCounterState } = counterFeature;
        let counterFeatureKeys: keyof typeof counterFeature;
      `);

      snippet.toInfer(
        'selectCounterState',
        'MemoizedSelector<Record<string, any>, number, DefaultProjectorFn<number>>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState"'
      );
    });

    it('should create a feature when derived selectors dictionary is typed as a type', () => {
      const snippet = expectSnippet(`
        type DerivedSelectors = {
          selectCountStr: Selector<Record<string, any>, string>;
        }

        function getDerivedSelectors(
          selectCount: Selector<Record<string, any>, number>
        ): DerivedSelectors {
          return {
            selectCountStr: createSelector(
              selectCount,
              (count) => count + ''
            ),
          };
        }

        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          derivedSelectors: ({ selectCounterState }) =>
            getDerivedSelectors(selectCounterState),
        });

        const { selectCountStr } = counterFeature;
        let counterFeatureKeys: keyof typeof counterFeature;
      `);

      snippet.toInfer(
        'selectCountStr',
        'Selector<Record<string, any>, string>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState" | "selectCountStr"'
      );
    });

    // This is known behavior.
    // Record<string, Selector> is not compatible with interface of selectors.
    it('should fail when derived selectors dictionary is typed as an interface', () => {
      expectSnippet(`
        interface DerivedSelectors {
          selectSquaredCount: Selector<Record<string, any>, number>;
        }

        function getDerivedSelectors(
          selectCount: Selector<Record<string, any>, number>
        ): DerivedSelectors {
          return {
            selectSquaredCount: createSelector(
              selectCount,
              (count) => count * count
            ),
          };
        }

        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          derivedSelectors: ({ selectCounterState }) =>
            getDerivedSelectors(selectCounterState),
        });
      `).toFail(
        /Index signature for type 'string' is missing in type 'DerivedSelectors'./
      );
    });

    it('should fail when derived selectors result is not a dictionary of selectors', () => {
      expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          derivedSelectors: ({ selectCounterState }) => ({
            selectSquaredCount: createSelector(
              selectCounterState,
              (count) => count * count
            ),
            x: 1,
          }),
        });
      `).toFail();

      expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          derivedSelectors: () => 'ngrx',
        });
      `).toFail();
    });

    it('should fail when feature state contains optional properties', () => {
      expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer({} as { count?: number; }),
          derivedSelectors: () => ({}),
        });
      `).toFail();

      expectSnippet(`
        interface State {
          count?: number;
        }
        const initialState: State = {};

        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(initialState),
          derivedSelectors: () => ({}),
        });
      `).toFail();
    });
  });
});

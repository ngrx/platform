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
        on,
        props,
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
          props<{ entities: Book[] }>()
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
});

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

  describe('extra selectors', () => {
    it('should create extra selectors', () => {
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
          extraSelectors: ({ selectCounterState, selectCount }) => ({
            selectCounterState2: createSelector(
              selectCounterState,
              (state) => state
            ),
            selectCountPlus1: createSelector(
              selectCount,
              (count) => count + 1
            ),
            selectCountPlusNum: (num: number) =>
              createSelector(selectCount, (count) => count + num),
          }),
        });

        const {
          name,
          reducer,
          selectCounterState,
          selectCount,
          selectCounterState2,
          selectCountPlus1,
          selectCountPlusNum,
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
        'selectCountPlusNum',
        '(num: number) => MemoizedSelector<Record<string, any>, number, (s1: number) => number>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState" | "selectCount" | "selectCounterState2" | "selectCountPlus1" | "selectCountPlusNum"'
      );
    });

    it('should create extra selectors when reducer is created outside', () => {
      const snippet = expectSnippet(`
        const counterReducer = createReducer({ count: 0 });

        const counterFeature = createFeature({
          name: 'counter',
          reducer: counterReducer,
          extraSelectors: ({ selectCounterState, selectCount }) => ({
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

    it('should override base selectors if extra selectors have the same names', () => {
      const snippet = expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer({ count1: 0, count2: 0 }),
          extraSelectors: ({ selectCounterState, selectCount1, selectCount2 }) => ({
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

    it('should not break the feature object when extra selector names are not string literals', () => {
      const snippet = expectSnippet(`
        const untypedSelectors: Record<string, Selector<Record<string, any>, unknown>> = {};

        const counterFeature1 = createFeature({
          name: 'counter1',
          reducer: createReducer(0),
          extraSelectors: ({ selectCounter1State }) => ({
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
          extraSelectors: () => untypedSelectors,
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

    it('should not break the feature object when extra selectors are an empty object', () => {
      const snippet = expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          extraSelectors: () => ({}),
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

    it('should create a feature when extra selectors dictionary is typed as a type', () => {
      const snippet = expectSnippet(`
        type ExtraSelectors = {
          selectCountStr: Selector<Record<string, any>, string>;
          selectCountPlusNum: (num: number) => Selector<Record<string, any>, number>;
        }

        function getExtraSelectors(
          selectCount: Selector<Record<string, any>, number>
        ): ExtraSelectors {
          return {
            selectCountStr: createSelector(
              selectCount,
              (count) => count + ''
            ),
            selectCountPlusNum: (num: number) =>
              createSelector(selectCount, (count) => count + num)
          };
        }

        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          extraSelectors: ({ selectCounterState }) =>
            getExtraSelectors(selectCounterState),
        });

        const { selectCountStr, selectCountPlusNum } = counterFeature;
        let counterFeatureKeys: keyof typeof counterFeature;
      `);

      snippet.toInfer(
        'selectCountStr',
        'Selector<Record<string, any>, string>'
      );
      snippet.toInfer(
        'selectCountPlusNum',
        '(num: number) => Selector<Record<string, any>, number>'
      );
      snippet.toInfer(
        'counterFeatureKeys',
        '"name" | "reducer" | "selectCounterState" | keyof ExtraSelectors'
      );
    });

    // This is known behavior.
    // Record<string, Selector> is not compatible with interface of selectors.
    it('should fail when extra selectors dictionary is typed as an interface', () => {
      expectSnippet(`
        interface ExtraSelectors {
          selectSquaredCount: Selector<Record<string, any>, number>;
        }

        function getExtraSelectors(
          selectCount: Selector<Record<string, any>, number>
        ): ExtraSelectors {
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
          extraSelectors: ({ selectCounterState }) =>
            getExtraSelectors(selectCounterState),
        });
      `).toFail(
        /Index signature for type 'string' is missing in type 'ExtraSelectors'./
      );
    });

    it('should fail when extra selectors result is not a dictionary of selectors', () => {
      expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer(0),
          extraSelectors: ({ selectCounterState }) => ({
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
          extraSelectors: () => 'ngrx',
        });
      `).toFail();
    });

    it('should fail when feature state contains optional properties', () => {
      expectSnippet(`
        const counterFeature = createFeature({
          name: 'counter',
          reducer: createReducer({} as { count?: number; }),
          extraSelectors: () => ({}),
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
          extraSelectors: () => ({}),
        });
      `).toFail();
    });
  });
});

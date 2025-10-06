import { capitalize } from './helpers';
import { ActionReducer, Prettify, Primitive, Selector } from './models';
import { isPlainObject } from './meta-reducers/utils';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from './selector';

export interface FeatureConfig<FeatureName extends string, FeatureState> {
  name: FeatureName;
  reducer: ActionReducer<FeatureState>;
}

type Feature<FeatureName extends string, FeatureState> = FeatureConfig<
  FeatureName,
  FeatureState
> &
  BaseSelectors<FeatureName, FeatureState>;

type FeatureWithExtraSelectors<
  FeatureName extends string,
  FeatureState,
  ExtraSelectors extends SelectorsDictionary
> = string extends keyof ExtraSelectors
  ? Feature<FeatureName, FeatureState>
  : Omit<Feature<FeatureName, FeatureState>, keyof ExtraSelectors> &
      ExtraSelectors;

type FeatureSelector<FeatureName extends string, FeatureState> = {
  [K in FeatureName as `select${Capitalize<K>}State`]: MemoizedSelector<
    Record<string, any>,
    FeatureState,
    (featureState: FeatureState) => FeatureState
  >;
};

type NestedSelectors<FeatureState> = FeatureState extends
  | Primitive
  | unknown[]
  | Date
  ? {}
  : {
      [K in keyof FeatureState &
        string as `select${Capitalize<K>}`]: MemoizedSelector<
        Record<string, any>,
        FeatureState[K],
        (featureState: FeatureState) => FeatureState[K]
      >;
    };

type BaseSelectors<FeatureName extends string, FeatureState> = FeatureSelector<
  FeatureName,
  FeatureState
> &
  NestedSelectors<FeatureState>;

type SelectorsDictionary = Record<
  string,
  | Selector<Record<string, any>, unknown>
  | ((...args: any[]) => Selector<Record<string, any>, unknown>)
>;

type ExtraSelectorsFactory<
  FeatureName extends string,
  FeatureState,
  ExtraSelectors extends SelectorsDictionary
> = (baseSelectors: BaseSelectors<FeatureName, FeatureState>) => ExtraSelectors;

type NotAllowedFeatureStateCheck<FeatureState> =
  FeatureState extends Required<FeatureState>
    ? unknown
    : 'optional properties are not allowed in the feature state';

/**
 * Creates a feature object with extra selectors.
 *
 * @param featureConfig An object that contains a feature name, a feature
 * reducer, and extra selectors factory.
 * @returns An object that contains a feature name, a feature reducer,
 * a feature selector, a selector for each feature state property, and
 * extra selectors.
 */
export function createFeature<
  FeatureName extends string,
  FeatureState,
  ExtraSelectors extends SelectorsDictionary
>(
  featureConfig: FeatureConfig<FeatureName, FeatureState> & {
    extraSelectors: ExtraSelectorsFactory<
      FeatureName,
      FeatureState,
      ExtraSelectors
    >;
  } & NotAllowedFeatureStateCheck<FeatureState>
): Prettify<
  FeatureWithExtraSelectors<FeatureName, FeatureState, ExtraSelectors>
>;
/**
 * Creates a feature object.
 *
 * @param featureConfig An object that contains a feature name and a feature
 * reducer.
 * @returns An object that contains a feature name, a feature reducer,
 * a feature selector, and a selector for each feature state property.
 */
export function createFeature<FeatureName extends string, FeatureState>(
  featureConfig: FeatureConfig<FeatureName, FeatureState> &
    NotAllowedFeatureStateCheck<FeatureState>
): Prettify<Feature<FeatureName, FeatureState>>;
/**
 * @description
 * A function that accepts a feature name and a feature reducer, and creates
 * a feature selector and a selector for each feature state property.
 * This function also provides the ability to add extra selectors to
 * the feature object.
 *
 * @param featureConfig An object that contains a feature name and a feature
 * reducer as required, and extra selectors factory as an optional argument.
 * @returns An object that contains a feature name, a feature reducer,
 * a feature selector, a selector for each feature state property, and extra
 * selectors.
 *
 * @usageNotes
 *
 * ```ts
 * interface ProductsState {
 *   products: Product[];
 *   selectedId: string | null;
 * }
 *
 * const initialState: ProductsState = {
 *   products: [],
 *   selectedId: null,
 * };
 *
 * const productsFeature = createFeature({
 *   name: 'products',
 *   reducer: createReducer(
 *     initialState,
 *     on(ProductsApiActions.loadSuccess, (state, { products }) => ({
 *       ...state,
 *       products,
 *     })),
 *   ),
 * });
 *
 * const {
 *   name,
 *   reducer,
 *   // feature selector
 *   selectProductsState, // type: MemoizedSelector<Record<string, any>, ProductsState>
 *   // feature state properties selectors
 *   selectProducts, // type: MemoizedSelector<Record<string, any>, Product[]>
 *   selectSelectedId, // type: MemoizedSelector<Record<string, any>, string | null>
 * } = productsFeature;
 * ```
 *
 * **Creating Feature with Extra Selectors**
 *
 * ```ts
 * type CallState = 'init' | 'loading' | 'loaded' | { error: string };
 *
 * interface State extends EntityState<Product> {
 *   callState: CallState;
 * }
 *
 * const adapter = createEntityAdapter<Product>();
 * const initialState: State = adapter.getInitialState({
 *   callState: 'init',
 * });
 *
 * export const productsFeature = createFeature({
 *   name: 'products',
 *   reducer: createReducer(initialState),
 *   extraSelectors: ({ selectProductsState, selectCallState }) => ({
 *     ...adapter.getSelectors(selectProductsState),
 *     ...getCallStateSelectors(selectCallState)
 *   }),
 * });
 *
 * const {
 *   name,
 *   reducer,
 *   // feature selector
 *   selectProductsState,
 *   // feature state properties selectors
 *   selectIds,
 *   selectEntities,
 *   selectCallState,
 *   // selectors returned by `adapter.getSelectors`
 *   selectAll,
 *   selectTotal,
 *   // selectors returned by `getCallStateSelectors`
 *   selectIsLoading,
 *   selectIsLoaded,
 *   selectError,
 * } = productsFeature;
 * ```
 */
export function createFeature<
  FeatureName extends string,
  FeatureState,
  ExtraSelectors extends SelectorsDictionary
>(
  featureConfig: FeatureConfig<FeatureName, FeatureState> & {
    extraSelectors?: ExtraSelectorsFactory<
      FeatureName,
      FeatureState,
      ExtraSelectors
    >;
  }
): Feature<FeatureName, FeatureState> & ExtraSelectors {
  const {
    name,
    reducer,
    extraSelectors: extraSelectorsFactory,
  } = featureConfig;

  const featureSelector = createFeatureSelector<FeatureState>(name);
  const nestedSelectors = createNestedSelectors(featureSelector, reducer);
  const baseSelectors = {
    [`select${capitalize(name)}State`]: featureSelector,
    ...nestedSelectors,
  } as BaseSelectors<FeatureName, FeatureState>;
  const extraSelectors = extraSelectorsFactory
    ? extraSelectorsFactory(baseSelectors)
    : {};

  return {
    name,
    reducer,
    ...baseSelectors,
    ...extraSelectors,
  } as Feature<FeatureName, FeatureState> & ExtraSelectors;
}

function createNestedSelectors<FeatureState>(
  featureSelector: MemoizedSelector<Record<string, any>, FeatureState>,
  reducer: ActionReducer<FeatureState>
): NestedSelectors<FeatureState> {
  const initialState = getInitialState(reducer);
  const nestedKeys = (
    isPlainObject(initialState) ? Object.keys(initialState) : []
  ) as Array<keyof FeatureState & string>;

  return nestedKeys.reduce(
    (nestedSelectors, nestedKey) => ({
      ...nestedSelectors,
      [`select${capitalize(nestedKey)}`]: createSelector(
        featureSelector,
        (parentState) => parentState?.[nestedKey]
      ),
    }),
    {} as NestedSelectors<FeatureState>
  );
}

function getInitialState<FeatureState>(
  reducer: ActionReducer<FeatureState>
): FeatureState {
  return reducer(undefined, { type: '@ngrx/feature/init' });
}

import { capitalize } from './helpers';
import { ActionReducer, Selector } from './models';
import { isPlainObject } from './meta-reducers/utils';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from './selector';
import { FeatureSelector, NestedSelectors } from './feature_creator_models';

export interface FeatureConfig<FeatureName extends string, FeatureState> {
  name: FeatureName;
  reducer: ActionReducer<FeatureState>;
}

type Feature<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string,
  FeatureState extends AppState[FeatureName]
> = FeatureConfig<FeatureName, FeatureState> &
  BaseSelectors<AppState, FeatureName, FeatureState>;

type FeatureWithExtraSelectors<
  FeatureName extends string,
  FeatureState,
  ExtraSelectors extends SelectorsDictionary
> = string extends keyof ExtraSelectors
  ? Feature<Record<string, any>, FeatureName, FeatureState>
  : Omit<
      Feature<Record<string, any>, FeatureName, FeatureState>,
      keyof ExtraSelectors
    > &
      ExtraSelectors;

type BaseSelectors<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string,
  FeatureState extends AppState[FeatureName]
> = FeatureSelector<AppState, FeatureName, FeatureState> &
  NestedSelectors<AppState, FeatureState>;

type SelectorsDictionary = Record<
  string,
  Selector<Record<string, any>, unknown>
>;

type ExtraSelectorsFactory<
  FeatureName extends string,
  FeatureState,
  ExtraSelectors extends SelectorsDictionary
> = (
  baseSelectors: BaseSelectors<Record<string, any>, FeatureName, FeatureState>
) => ExtraSelectors;

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
): FeatureWithExtraSelectors<FeatureName, FeatureState, ExtraSelectors>;
/**
 * Creates a feature object.
 *
 * @param featureConfig An object that contains a feature name and a feature
 * reducer.
 * @returns An object that contains a feature name, a feature reducer,
 * a feature selector, and a selector for each feature state property.
 */
export function createFeature<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string = keyof AppState & string,
  FeatureState extends AppState[FeatureName] = AppState[FeatureName]
>(
  featureConfig: FeatureConfig<FeatureName, FeatureState> &
    NotAllowedFeatureStateCheck<FeatureState>
): Feature<AppState, FeatureName, FeatureState>;
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
 * **With Application State**
 *
 * ```ts
 * interface AppState {
 *   products: ProductsState;
 * }
 *
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
 * // AppState is passed as a generic argument
 * const productsFeature = createFeature<AppState>({
 *   name: 'products',
 *   reducer: createReducer(
 *     initialState,
 *     on(ProductsApiActions.loadSuccess(state, { products }) => ({
 *       ...state,
 *       products,
 *     }),
 *   ),
 * });
 *
 * const {
 *   selectProductsState, // type: MemoizedSelector<AppState, ProductsState>
 *   selectProducts, // type: MemoizedSelector<AppState, Product[]>
 *   selectSelectedId, // type: MemoizedSelector<AppState, string | null>
 * } = productsFeature;
 * ```
 *
 * **Without Application State**
 *
 * ```ts
 * const productsFeature = createFeature({
 *   name: 'products',
 *   reducer: createReducer(initialState),
 * });
 *
 * const {
 *   selectProductsState, // type: MemoizedSelector<Record<string, any>, ProductsState>
 *   selectProducts, // type: MemoizedSelector<Record<string, any>, Product[]>
 *   selectSelectedId, // type: MemoizedSelector<Record<string, any, string | null>
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
 *     ...adapter.getSelectors(selectBooksState),
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
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string,
  FeatureState extends AppState[FeatureName],
  ExtraSelectors extends SelectorsDictionary
>(
  featureConfig: FeatureConfig<FeatureName, FeatureState> & {
    extraSelectors?: ExtraSelectorsFactory<
      FeatureName,
      FeatureState,
      ExtraSelectors
    >;
  }
): Feature<AppState, FeatureName, FeatureState> & ExtraSelectors {
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
  } as BaseSelectors<Record<string, any>, FeatureName, FeatureState>;
  const extraSelectors = extraSelectorsFactory
    ? extraSelectorsFactory(baseSelectors)
    : {};

  return {
    name,
    reducer,
    ...baseSelectors,
    ...extraSelectors,
  } as Feature<AppState, FeatureName, FeatureState> & ExtraSelectors;
}

function createNestedSelectors<
  AppState extends Record<string, any>,
  FeatureState
>(
  featureSelector: MemoizedSelector<AppState, FeatureState>,
  reducer: ActionReducer<FeatureState>
): NestedSelectors<AppState, FeatureState> {
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
    {} as NestedSelectors<AppState, FeatureState>
  );
}

function getInitialState<FeatureState>(
  reducer: ActionReducer<FeatureState>
): FeatureState {
  return reducer(undefined, { type: '@ngrx/feature/init' });
}

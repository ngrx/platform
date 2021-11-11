import { capitalize } from './helpers';
import { ActionReducer } from './models';
import { isPlainObject } from './meta-reducers/utils';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from './selector';
import { FeatureSelector, NestedSelectors } from './feature_creator_models';

export type Feature<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string,
  FeatureState extends AppState[FeatureName]
> = FeatureConfig<FeatureName, FeatureState> &
  FeatureSelector<AppState, FeatureName, FeatureState> &
  NestedSelectors<AppState, FeatureState>;

export interface FeatureConfig<FeatureName extends string, FeatureState> {
  name: FeatureName;
  reducer: ActionReducer<FeatureState>;
}

type NotAllowedFeatureStateCheck<
  FeatureState
> = FeatureState extends Required<FeatureState>
  ? unknown
  : 'optional properties are not allowed in the feature state';

/**
 * @description
 * A function that accepts a feature name and a feature reducer, and creates
 * a feature selector and a selector for each feature state property.
 *
 * @param featureConfig An object that contains a feature name and a feature reducer.
 * @returns An object that contains a feature name, a feature reducer,
 * a feature selector, and a selector for each feature state property.
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
 */
export function createFeature<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string = keyof AppState & string,
  FeatureState extends AppState[FeatureName] = AppState[FeatureName]
>(
  featureConfig: FeatureConfig<FeatureName, FeatureState> &
    NotAllowedFeatureStateCheck<FeatureState>
): Feature<AppState, FeatureName, FeatureState> {
  const { name, reducer } = featureConfig;
  const featureSelector = createFeatureSelector<FeatureState>(name);
  const nestedSelectors = createNestedSelectors(featureSelector, reducer);

  return ({
    name,
    reducer,
    [`select${capitalize(name)}State`]: featureSelector,
    ...nestedSelectors,
  } as unknown) as Feature<AppState, FeatureName, FeatureState>;
}

function createNestedSelectors<
  AppState extends Record<string, any>,
  FeatureState
>(
  featureSelector: MemoizedSelector<AppState, FeatureState>,
  reducer: ActionReducer<FeatureState>
): NestedSelectors<AppState, FeatureState> {
  const initialState = getInitialState(reducer);
  const nestedKeys = (isPlainObject(initialState)
    ? Object.keys(initialState)
    : []) as Array<keyof FeatureState & string>;

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

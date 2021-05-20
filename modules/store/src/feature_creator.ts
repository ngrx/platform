import { capitalize, isDictionary } from './helpers';
import { ActionReducer, NonOptional, Primitive } from './models';
import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from './selector';

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

type FeatureSelector<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string,
  FeatureState extends AppState[FeatureName]
> = {
  [K in FeatureName as `select${Capitalize<K>}State`]: MemoizedSelector<
    AppState,
    FeatureState
  >;
};

type NestedSelectors<
  AppState extends Record<string, any>,
  FeatureState
> = FeatureState extends Primitive | unknown[] | Date
  ? {}
  : {
      [K in keyof NonOptional<FeatureState> &
        string as `select${Capitalize<K>}`]: MemoizedSelector<
        AppState,
        FeatureState[K]
      >;
    };

export function createFeature<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string = keyof AppState & string,
  FeatureState extends AppState[FeatureName] = AppState[FeatureName]
>({
  name,
  reducer,
}: FeatureConfig<FeatureName, FeatureState>): Feature<
  AppState,
  FeatureName,
  FeatureState
> {
  const featureSelector = createFeatureSelector<AppState, FeatureState>(name);
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
  const nestedKeys = (isDictionary(initialState)
    ? Object.keys(initialState)
    : []) as Array<keyof FeatureState & string>;

  return nestedKeys.reduce(
    (nestedSelectors, nestedKey) => ({
      ...nestedSelectors,
      [`select${capitalize(nestedKey)}`]: createSelector(
        featureSelector,
        (parentState) => parentState[nestedKey]
      ),
    }),
    {} as NestedSelectors<AppState, FeatureState>
  );
}

function getInitialState<FeatureState>(
  reducer: ActionReducer<FeatureState>
): FeatureState {
  return reducer(undefined, { type: '' });
}

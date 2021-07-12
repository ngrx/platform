import { MemoizedSelector } from './selector';
import { Primitive } from './models';

// Generating documentation for `createFeature` function is solved by moving types that use
// template literal types (`FeatureSelector` and `NestedSelectors`) from `feature_creator.ts`.
// These types should be returned back to the `feature_creator.ts` file, when `dgeni` resolves
// the bug with template literal types.

export type FeatureSelector<
  AppState extends Record<string, any>,
  FeatureName extends keyof AppState & string,
  FeatureState extends AppState[FeatureName]
> = {
  [K in FeatureName as `select${Capitalize<K>}State`]: MemoizedSelector<
    AppState,
    FeatureState
  >;
};

export type NestedSelectors<
  AppState extends Record<string, any>,
  FeatureState
> = FeatureState extends Primitive | unknown[] | Date
  ? {}
  : {
      [K in keyof FeatureState &
        string as `select${Capitalize<K>}`]: MemoizedSelector<
        AppState,
        FeatureState[K]
      >;
    };

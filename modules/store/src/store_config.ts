import { inject, InjectionToken } from '@angular/core';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  ActionReducerFactory,
  StoreFeature,
  InitialState,
  MetaReducer,
  RuntimeChecks,
} from './models';
import { combineReducers } from './utils';
import { Store } from './store';

/**
 * @public
 */
export interface StoreConfig<T, V extends Action = Action> {
  initialState?: InitialState<T>;
  reducerFactory?: ActionReducerFactory<T, V>;
  metaReducers?: MetaReducer<{ [P in keyof T]: T[P] }, V>[];
}

/**
 * @public
 */
export interface RootStoreConfig<T, V extends Action = Action>
  extends StoreConfig<T, V> {
  runtimeChecks?: Partial<RuntimeChecks>;
}

/**
 * An object with the name and the reducer for the feature.
 * @public
 */
export interface FeatureSlice<T, V extends Action = Action> {
  name: string;
  reducer: ActionReducer<T, V>;
}

/**
 * @public
 */
export function _createStoreReducers<T, V extends Action = Action>(
  reducers: ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>
): ActionReducerMap<T, V> {
  return reducers instanceof InjectionToken ? inject(reducers) : reducers;
}

/**
 * @public
 */
export function _createFeatureStore<T, V extends Action = Action>(
  configs: StoreConfig<T, V>[] | InjectionToken<StoreConfig<T, V>>[],
  featureStores: StoreFeature<T, V>[]
) {
  return featureStores.map((feat, index) => {
    if (configs[index] instanceof InjectionToken) {
      const conf = inject(configs[index] as InjectionToken<StoreConfig<T, V>>);
      return {
        key: feat.key,
        reducerFactory: conf.reducerFactory
          ? conf.reducerFactory
          : combineReducers,
        metaReducers: conf.metaReducers ? conf.metaReducers : [],
        initialState: conf.initialState,
      };
    }
    return feat;
  });
}

/**
 * @public
 */
export function _createFeatureReducers<T, V extends Action = Action>(
  reducerCollection: Array<
    ActionReducerMap<T, V> | InjectionToken<ActionReducerMap<T, V>>
  >
): ActionReducerMap<T, V>[] {
  return reducerCollection.map((reducer) => {
    return reducer instanceof InjectionToken ? inject(reducer) : reducer;
  });
}

/**
 * @public
 */
export function _initialStateFactory(initialState: any): any {
  if (typeof initialState === 'function') {
    return initialState();
  }

  return initialState;
}

/**
 * @public
 */
export function _concatMetaReducers(
  metaReducers: MetaReducer[],
  userProvidedMetaReducers: MetaReducer[]
): MetaReducer[] {
  return metaReducers.concat(userProvidedMetaReducers);
}

/**
 * @public
 */
export function _provideForRootGuard(): unknown {
  const store = inject(Store, { optional: true, skipSelf: true });
  if (store) {
    throw new TypeError(
      `The root Store has been provided more than once. Feature modules should provide feature states instead.`
    );
  }
  return 'guarded';
}

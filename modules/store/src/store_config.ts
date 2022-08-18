import { InjectionToken, Injector } from '@angular/core';
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
import {
  _INITIAL_REDUCERS,
  _REDUCER_FACTORY,
  _INITIAL_STATE,
  _STORE_REDUCERS,
  _FEATURE_REDUCERS,
  _FEATURE_REDUCERS_TOKEN,
  _STORE_FEATURES,
  _FEATURE_CONFIGS,
  _RESOLVED_META_REDUCERS,
  _ROOT_STORE_GUARD,
  _ACTION_TYPE_UNIQUENESS_CHECK,
} from './tokens';
import { Store } from './store';

export interface StoreConfig<T, V extends Action = Action> {
  initialState?: InitialState<T>;
  reducerFactory?: ActionReducerFactory<T, V>;
  metaReducers?: MetaReducer<{ [P in keyof T]: T[P] }, V>[];
}

export interface RootStoreConfig<T, V extends Action = Action>
  extends StoreConfig<T, V> {
  runtimeChecks?: Partial<RuntimeChecks>;
}

/**
 * An object with the name and the reducer for the feature.
 */
export interface FeatureSlice<T, V extends Action = Action> {
  name: string;
  reducer: ActionReducer<T, V>;
}

export function _createStoreReducers(
  injector: Injector,
  reducers: ActionReducerMap<any, any>
) {
  return reducers instanceof InjectionToken ? injector.get(reducers) : reducers;
}

export function _createFeatureStore(
  injector: Injector,
  configs: StoreConfig<any, any>[] | InjectionToken<StoreConfig<any, any>>[],
  featureStores: StoreFeature<any, any>[]
) {
  return featureStores.map((feat, index) => {
    if (configs[index] instanceof InjectionToken) {
      const conf = injector.get(configs[index]);
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

export function _createFeatureReducers(
  injector: Injector,
  reducerCollection: ActionReducerMap<any, any>[]
) {
  const reducers = reducerCollection.map((reducer) => {
    return reducer instanceof InjectionToken ? injector.get(reducer) : reducer;
  });

  return reducers;
}

export function _initialStateFactory(initialState: any): any {
  if (typeof initialState === 'function') {
    return initialState();
  }

  return initialState;
}

export function _concatMetaReducers(
  metaReducers: MetaReducer[],
  userProvidedMetaReducers: MetaReducer[]
): MetaReducer[] {
  return metaReducers.concat(userProvidedMetaReducers);
}

export function _provideForRootGuard(store: Store<any>): any {
  if (store) {
    throw new TypeError(
      `The root Store has been provided more than once. Feature modules should provide feature states instead.`
    );
  }
  return 'guarded';
}

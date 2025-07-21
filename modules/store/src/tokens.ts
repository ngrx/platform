import { InjectionToken } from '@angular/core';
import { RuntimeChecks, MetaReducer } from './models';

/**
 * @public
 */
export const _ROOT_STORE_GUARD = new InjectionToken<void>(
  '@ngrx/store Internal Root Guard'
);
/**
 * @public
 */
export const _INITIAL_STATE = new InjectionToken(
  '@ngrx/store Internal Initial State'
);
/**
 * @public
 */
export const INITIAL_STATE = new InjectionToken('@ngrx/store Initial State');
/**
 * @public
 */
export const REDUCER_FACTORY = new InjectionToken(
  '@ngrx/store Reducer Factory'
);
/**
 * @public
 */
export const _REDUCER_FACTORY = new InjectionToken(
  '@ngrx/store Internal Reducer Factory Provider'
);
/**
 * @public
 */
export const INITIAL_REDUCERS = new InjectionToken(
  '@ngrx/store Initial Reducers'
);
/**
 * @public
 */
export const _INITIAL_REDUCERS = new InjectionToken(
  '@ngrx/store Internal Initial Reducers'
);
/**
 * @public
 */
export const STORE_FEATURES = new InjectionToken('@ngrx/store Store Features');
/**
 * @public
 */
export const _STORE_REDUCERS = new InjectionToken(
  '@ngrx/store Internal Store Reducers'
);
/**
 * @public
 */
export const _FEATURE_REDUCERS = new InjectionToken(
  '@ngrx/store Internal Feature Reducers'
);

/**
 * @public
 */
export const _FEATURE_CONFIGS = new InjectionToken(
  '@ngrx/store Internal Feature Configs'
);

/**
 * @public
 */
export const _STORE_FEATURES = new InjectionToken(
  '@ngrx/store Internal Store Features'
);

/**
 * @public
 */
export const _FEATURE_REDUCERS_TOKEN = new InjectionToken(
  '@ngrx/store Internal Feature Reducers Token'
);
/**
 * @public
 */
export const FEATURE_REDUCERS = new InjectionToken(
  '@ngrx/store Feature Reducers'
);

/**
 * User-defined meta reducers from StoreModule.forRoot()
 * @public
 */
export const USER_PROVIDED_META_REDUCERS = new InjectionToken<MetaReducer[]>(
  '@ngrx/store User Provided Meta Reducers'
);

/**
 * Meta reducers defined either internally by \@ngrx/store or by library authors
 * @public
 */
export const META_REDUCERS = new InjectionToken<MetaReducer[]>(
  '@ngrx/store Meta Reducers'
);

/**
 * Concats the user provided meta reducers and the meta reducers provided on the multi
 * injection token
 * @public
 */
export const _RESOLVED_META_REDUCERS = new InjectionToken<MetaReducer>(
  '@ngrx/store Internal Resolved Meta Reducers'
);

/**
 * Runtime checks defined by the user via an InjectionToken
 * Defaults to `_USER_RUNTIME_CHECKS`
 * @public
 */
export const USER_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store User Runtime Checks Config'
);

/**
 * Runtime checks defined by the user via forRoot()
 * @public
 */
export const _USER_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store Internal User Runtime Checks Config'
);

/**
 * Runtime checks currently in use
 * @public
 */
export const ACTIVE_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store Internal Runtime Checks'
);

/**
 * @public
 */
export const _ACTION_TYPE_UNIQUENESS_CHECK = new InjectionToken<void>(
  '@ngrx/store Check if Action types are unique'
);

/**
 * InjectionToken that registers the global Store.
 * Mainly used to provide a hook that can be injected
 * to ensure the root state is loaded before something
 * that depends on it.
 * @public
 */
export const ROOT_STORE_PROVIDER = new InjectionToken<void>(
  '@ngrx/store Root Store Provider'
);

/**
 * InjectionToken that registers feature states.
 * Mainly used to provide a hook that can be injected
 * to ensure feature state is loaded before something
 * that depends on it.
 * @public
 */
export const FEATURE_STATE_PROVIDER = new InjectionToken<void>(
  '@ngrx/store Feature State Provider'
);

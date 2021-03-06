import { InjectionToken } from '@angular/core';
import { RuntimeChecks, MetaReducer } from './models';

export const _ROOT_STORE_GUARD = new InjectionToken<void>(
  '@ngrx/store Internal Root Guard'
);
export const _INITIAL_STATE = new InjectionToken(
  '@ngrx/store Internal Initial State'
);
export const INITIAL_STATE = new InjectionToken('@ngrx/store Initial State');
export const REDUCER_FACTORY = new InjectionToken(
  '@ngrx/store Reducer Factory'
);
export const _REDUCER_FACTORY = new InjectionToken(
  '@ngrx/store Internal Reducer Factory Provider'
);
export const INITIAL_REDUCERS = new InjectionToken(
  '@ngrx/store Initial Reducers'
);
export const _INITIAL_REDUCERS = new InjectionToken(
  '@ngrx/store Internal Initial Reducers'
);
export const STORE_FEATURES = new InjectionToken('@ngrx/store Store Features');
export const _STORE_REDUCERS = new InjectionToken(
  '@ngrx/store Internal Store Reducers'
);
export const _FEATURE_REDUCERS = new InjectionToken(
  '@ngrx/store Internal Feature Reducers'
);

export const _FEATURE_CONFIGS = new InjectionToken(
  '@ngrx/store Internal Feature Configs'
);

export const _STORE_FEATURES = new InjectionToken(
  '@ngrx/store Internal Store Features'
);

export const _FEATURE_REDUCERS_TOKEN = new InjectionToken(
  '@ngrx/store Internal Feature Reducers Token'
);
export const FEATURE_REDUCERS = new InjectionToken(
  '@ngrx/store Feature Reducers'
);

/**
 * User-defined meta reducers from StoreModule.forRoot()
 */
export const USER_PROVIDED_META_REDUCERS = new InjectionToken<MetaReducer[]>(
  '@ngrx/store User Provided Meta Reducers'
);

/**
 * Meta reducers defined either internally by @ngrx/store or by library authors
 */
export const META_REDUCERS = new InjectionToken<MetaReducer[]>(
  '@ngrx/store Meta Reducers'
);

/**
 * Concats the user provided meta reducers and the meta reducers provided on the multi
 * injection token
 */
export const _RESOLVED_META_REDUCERS = new InjectionToken<MetaReducer>(
  '@ngrx/store Internal Resolved Meta Reducers'
);

/**
 * Runtime checks defined by the user via an InjectionToken
 * Defaults to `_USER_RUNTIME_CHECKS`
 */
export const USER_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store User Runtime Checks Config'
);

/**
 * Runtime checks defined by the user via forRoot()
 */
export const _USER_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store Internal User Runtime Checks Config'
);

/**
 * Runtime checks currently in use
 */
export const ACTIVE_RUNTIME_CHECKS = new InjectionToken<RuntimeChecks>(
  '@ngrx/store Internal Runtime Checks'
);

export const _ACTION_TYPE_UNIQUENESS_CHECK = new InjectionToken<void>(
  '@ngrx/store Check if Action types are unique'
);

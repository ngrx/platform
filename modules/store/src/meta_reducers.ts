import { InjectionToken } from '@angular/core';
import { Action, ActionReducer } from './models';
import { compose } from './utils';

export interface MetaReducer<
  InputState = any,
  InputAction extends Action = Action,
  OutputState = InputState,
  OutputAction extends Action = InputAction
> {
  (reducer: ActionReducer<InputState, InputAction>): ActionReducer<
    OutputState,
    OutputAction
  >;
}

export function identityMetaReducer<S, A extends Action>(
  reducer: ActionReducer<S, A>
) {
  return reducer;
}

/**
 * User-defined meta reducers from StoreModule.forRoot() or StoreModule.forFeature()
 */
export const USER_PROVIDED_META_REDUCERS = new InjectionToken<MetaReducer[]>(
  '@ngrx/store/user-provided-metareducers'
);

/**
 * Meta reducers defined either internally by @ngrx/store or by library authors
 */
export const META_REDUCERS = new InjectionToken<MetaReducer[]>(
  '@ngrx/store/meta-reducers'
);

/**
 * Takes the user provided meta reduers and the meta reducers provided on the multi
 * injection token and resolves them into one
 */
export const RESOLVED_META_REDUCER = new InjectionToken<MetaReducer>(
  '@ngrx/store/resolved-meta-reducer'
);

export function resolveMetaReduers(
  userProvidedMetaReducers: MetaReducer[],
  boundMetaReducers: MetaReducer[]
): MetaReducer {
  return compose.apply(null, [
    ...userProvidedMetaReducers,
    ...boundMetaReducers,
  ]);
}

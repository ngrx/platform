import { OpaqueToken } from '@angular/core';

export const _INITIAL_STATE = new OpaqueToken('_ngrx/store Initial State');
export const INITIAL_STATE = new OpaqueToken('@ngrx/store Initial State');
export const REDUCER_FACTORY = new OpaqueToken('@ngrx/store Reducer Factory');
export const _REDUCER_FACTORY = new OpaqueToken(
  '@ngrx/store Reducer Factory Provider'
);
export const INITIAL_REDUCERS = new OpaqueToken('@ngrx/store Initial Reducers');
export const META_REDUCERS = new OpaqueToken('@ngrx/store Meta Reducers');
export const STORE_FEATURES = new OpaqueToken('@ngrx/store Store Features');

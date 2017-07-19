import { InjectionToken } from '@angular/core';

export const _INITIAL_STATE = new InjectionToken('_ngrx/store Initial State');
export const INITIAL_STATE = new InjectionToken('@ngrx/store Initial State');
export const REDUCER_FACTORY = new InjectionToken(
  '@ngrx/store Reducer Factory'
);
export const _REDUCER_FACTORY = new InjectionToken(
  '@ngrx/store Reducer Factory Provider'
);
export const INITIAL_REDUCERS = new InjectionToken(
  '@ngrx/store Initial Reducers'
);
export const META_REDUCERS = new InjectionToken('@ngrx/store Meta Reducers');
export const STORE_FEATURES = new InjectionToken('@ngrx/store Store Features');

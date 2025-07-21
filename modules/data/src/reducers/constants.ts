import { InjectionToken } from '@angular/core';
import { MetaReducer } from '@ngrx/store';
import { EntityCache } from './entity-cache';

/**
 * @public
 */
export const ENTITY_CACHE_NAME = 'entityCache';

/**
 * @public
 */
export const ENTITY_CACHE_NAME_TOKEN = new InjectionToken<string>(
  '@ngrx/data Entity Cache Name'
);

/**
 * @public
 */
export const ENTITY_CACHE_META_REDUCERS = new InjectionToken<
  MetaReducer<any, any>[]
>('@ngrx/data Entity Cache Meta Reducers');

/**
 * @public
 */
export const ENTITY_COLLECTION_META_REDUCERS = new InjectionToken<
  MetaReducer<any, any>[]
>('@ngrx/data Entity Collection Meta Reducers');

/**
 * @public
 */
export const INITIAL_ENTITY_CACHE_STATE = new InjectionToken<
  EntityCache | (() => EntityCache)
>('@ngrx/data Initial Entity Cache State');

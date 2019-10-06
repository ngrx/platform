import { InjectionToken } from '@angular/core';
import { MetaReducer } from '@ngrx/store';
import { EntityCache } from './entity-cache';

export const ENTITY_CACHE_NAME = 'entityCache';
export const ENTITY_CACHE_NAME_TOKEN = new InjectionToken<string>(
  '@ngrx/data/entity-cache-name'
);

export const ENTITY_CACHE_META_REDUCERS = new InjectionToken<
  MetaReducer<any, any>[]
>('@ngrx/data/entity-cache-meta-reducers');
export const ENTITY_COLLECTION_META_REDUCERS = new InjectionToken<
  MetaReducer<any, any>[]
>('@ngrx/data/entity-collection-meta-reducers');

export const INITIAL_ENTITY_CACHE_STATE = new InjectionToken<
  EntityCache | (() => EntityCache)
>('@ngrx/data/initial-entity-cache-state');

import { InjectionToken, Optional, FactoryProvider } from '@angular/core';
import { createFeatureSelector, MemoizedSelector } from '@ngrx/store';
import { EntityCache } from '../reducers/entity-cache';
import {
  ENTITY_CACHE_NAME,
  ENTITY_CACHE_NAME_TOKEN,
} from '../reducers/constants';

export const ENTITY_CACHE_SELECTOR_TOKEN = new InjectionToken<
  MemoizedSelector<Object, EntityCache>
>('@ngrx/data Entity Cache Selector');

export const entityCacheSelectorProvider: FactoryProvider = {
  provide: ENTITY_CACHE_SELECTOR_TOKEN,
  useFactory: createEntityCacheSelector,
  deps: [[new Optional(), ENTITY_CACHE_NAME_TOKEN]],
};

export type EntityCacheSelector = MemoizedSelector<Object, EntityCache>;

export function createEntityCacheSelector(
  entityCacheName?: string
): MemoizedSelector<Object, EntityCache> {
  entityCacheName = entityCacheName || ENTITY_CACHE_NAME;
  return createFeatureSelector<EntityCache>(entityCacheName);
}

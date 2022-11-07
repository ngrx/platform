import { InjectionToken } from '@angular/core';
import { MetaReducer } from '@ngrx/store';
import { EntityCache } from './reducers/entity-cache';
import { EntityAction } from './actions/entity-action';
import { EntityMetadataMap } from './entity-metadata/entity-metadata';
import { EntityCollection } from './reducers/entity-collection';

export interface EntityDataModuleConfig {
  entityMetadata?: EntityMetadataMap;
  entityCacheMetaReducers?: (
    | MetaReducer<EntityCache>
    | InjectionToken<MetaReducer<EntityCache>>
  )[];
  entityCollectionMetaReducers?: MetaReducer<EntityCollection, EntityAction>[];
  // Initial EntityCache state or a function that returns that state
  initialEntityCacheState?: EntityCache | (() => EntityCache);
  pluralNames?: { [name: string]: string };
}

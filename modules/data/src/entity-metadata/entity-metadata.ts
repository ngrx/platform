import { InjectionToken } from '@angular/core';
import { EntityDispatcherDefaultOptions } from '../dispatchers/entity-dispatcher-default-options';
import { EntityFilterFn } from './entity-filters';
import { IdSelector, Comparer } from '../utils/ngrx-entity-models';

export const ENTITY_METADATA_TOKEN = new InjectionToken<EntityMetadataMap>(
  'ngrx-data/entity-metadata'
);

/** Metadata that describe an entity type and its collection to ngrx-data */
export interface EntityMetadata<T = any, S extends object = {}> {
  entityName: string;
  entityDispatcherOptions?: Partial<EntityDispatcherDefaultOptions>;
  filterFn?: EntityFilterFn<T>;
  noChangeTracking?: boolean;
  selectId?: IdSelector<T>;
  sortComparer?: false | Comparer<T>;
  additionalCollectionState?: S;
}

/** Map entity-type name to its EntityMetadata */
export interface EntityMetadataMap {
  [entityName: string]: Partial<EntityMetadata<any>>;
}

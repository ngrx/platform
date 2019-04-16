import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';

import {
  EntitySelectors,
  EntitySelectorsFactory,
} from '../selectors/entity-selectors';
import {
  Comparer,
  Dictionary,
  IdSelector,
  Update,
} from '../utils/ngrx-entity-models';
import { EntityDispatcherDefaultOptions } from '../dispatchers/entity-dispatcher-default-options';
import { defaultSelectId } from '../utils/utilities';
import { EntityCollection } from '../reducers/entity-collection';
import { EntityFilterFn } from './entity-filters';
import { EntityMetadata } from './entity-metadata';

export interface EntityDefinition<T = any> {
  entityName: string;
  entityAdapter: EntityAdapter<T>;
  entityDispatcherOptions?: Partial<EntityDispatcherDefaultOptions>;
  initialState: EntityCollection<T>;
  metadata: EntityMetadata<T>;
  noChangeTracking: boolean;
  selectId: IdSelector<T>;
  sortComparer: false | Comparer<T>;
}

export function createEntityDefinition<T, S extends object>(
  metadata: EntityMetadata<T, S>
): EntityDefinition<T> {
  let entityName = metadata.entityName;
  if (!entityName) {
    throw new Error('Missing required entityName');
  }
  metadata.entityName = entityName = entityName.trim();
  const selectId = metadata.selectId || defaultSelectId;
  const sortComparer = (metadata.sortComparer = metadata.sortComparer || false);

  const entityAdapter = createEntityAdapter<T>({ selectId, sortComparer });

  const entityDispatcherOptions: Partial<EntityDispatcherDefaultOptions> =
    metadata.entityDispatcherOptions || {};

  const initialState: EntityCollection<T> = entityAdapter.getInitialState({
    entityName,
    filter: '',
    loaded: false,
    loading: false,
    changeState: {},
    ...(metadata.additionalCollectionState || {}),
  });

  const noChangeTracking = metadata.noChangeTracking === true; // false by default

  return {
    entityName,
    entityAdapter,
    entityDispatcherOptions,
    initialState,
    metadata,
    noChangeTracking,
    selectId,
    sortComparer,
  };
}

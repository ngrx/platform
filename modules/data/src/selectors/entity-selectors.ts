import { Inject, Injectable, Optional } from '@angular/core';

// Prod build requires `MemoizedSelector even though not used.
import { MemoizedSelector } from '@ngrx/store';
import { createSelector, Selector } from '@ngrx/store';
import { Dictionary } from '@ngrx/entity';

import { EntityCache } from '../reducers/entity-cache';
import {
  ENTITY_CACHE_SELECTOR_TOKEN,
  EntityCacheSelector,
  createEntityCacheSelector,
} from './entity-cache-selector';
import { ENTITY_CACHE_NAME } from '../reducers/constants';
import {
  EntityCollection,
  ChangeStateMap,
} from '../reducers/entity-collection';
import { EntityCollectionCreator } from '../reducers/entity-collection-creator';
import { EntityMetadata } from '../entity-metadata/entity-metadata';

/**
 * The selector functions for entity collection members,
 * Selects from the entity collection to the collection member
 * Contrast with {EntitySelectors}.
 */
export interface CollectionSelectors<T> {
  readonly [selector: string]: any;

  /** Count of entities in the cached collection. */
  readonly selectCount: Selector<EntityCollection<T>, number>;

  /** All entities in the cached collection. */
  readonly selectEntities: Selector<EntityCollection<T>, T[]>;

  /** Map of entity keys to entities */
  readonly selectEntityMap: Selector<EntityCollection<T>, Dictionary<T>>;

  /** Filter pattern applied by the entity collection's filter function */
  readonly selectFilter: Selector<EntityCollection<T>, string>;

  /** Entities in the cached collection that pass the filter function */
  readonly selectFilteredEntities: Selector<EntityCollection<T>, T[]>;

  /** Keys of the cached collection, in the collection's native sort order */
  readonly selectKeys: Selector<EntityCollection<T>, string[] | number[]>;

  /** True when the collection has been fully loaded. */
  readonly selectLoaded: Selector<EntityCollection<T>, boolean>;

  /** True when a multi-entity query command is in progress. */
  readonly selectLoading: Selector<EntityCollection<T>, boolean>;

  /** ChangeState (including original values) of entities with unsaved changes */
  readonly selectChangeState: Selector<EntityCollection<T>, ChangeStateMap<T>>;
}

/**
 * The selector functions for entity collection members,
 * Selects from store root, through EntityCache, to the entity collection member
 * Contrast with {CollectionSelectors}.
 */
export interface EntitySelectors<T> {
  /** Name of the entity collection for these selectors */
  readonly entityName: string;

  readonly [name: string]: MemoizedSelector<EntityCollection<T>, any> | string;

  /** The cached EntityCollection itself */
  readonly selectCollection: MemoizedSelector<Object, EntityCollection<T>>;

  /** Count of entities in the cached collection. */
  readonly selectCount: MemoizedSelector<Object, number>;

  /** All entities in the cached collection. */
  readonly selectEntities: MemoizedSelector<Object, T[]>;

  /** The EntityCache */
  readonly selectEntityCache: MemoizedSelector<Object, EntityCache>;

  /** Map of entity keys to entities */
  readonly selectEntityMap: MemoizedSelector<Object, Dictionary<T>>;

  /** Filter pattern applied by the entity collection's filter function */
  readonly selectFilter: MemoizedSelector<Object, string>;

  /** Entities in the cached collection that pass the filter function */
  readonly selectFilteredEntities: MemoizedSelector<Object, T[]>;

  /** Keys of the cached collection, in the collection's native sort order */
  readonly selectKeys: MemoizedSelector<Object, string[] | number[]>;

  /** True when the collection has been fully loaded. */
  readonly selectLoaded: MemoizedSelector<Object, boolean>;

  /** True when a multi-entity query command is in progress. */
  readonly selectLoading: MemoizedSelector<Object, boolean>;

  /** ChangeState (including original values) of entities with unsaved changes */
  readonly selectChangeState: MemoizedSelector<Object, ChangeStateMap<T>>;
}

/** Creates EntitySelector functions for entity collections. */
@Injectable()
export class EntitySelectorsFactory {
  private entityCollectionCreator: EntityCollectionCreator;
  private selectEntityCache: EntityCacheSelector;

  constructor(
    @Optional() entityCollectionCreator?: EntityCollectionCreator,
    @Optional()
    @Inject(ENTITY_CACHE_SELECTOR_TOKEN)
    selectEntityCache?: EntityCacheSelector
  ) {
    this.entityCollectionCreator =
      entityCollectionCreator || new EntityCollectionCreator();
    this.selectEntityCache =
      selectEntityCache || createEntityCacheSelector(ENTITY_CACHE_NAME);
  }

  /**
   * Create the NgRx selector from the store root to the named collection,
   * e.g. from Object to Heroes.
   * @param entityName the name of the collection
   */
  createCollectionSelector<
    T = any,
    C extends EntityCollection<T> = EntityCollection<T>
  >(entityName: string) {
    const getCollection = (cache: EntityCache = {}) =>
      <C>(
        (cache[entityName] ||
          this.entityCollectionCreator.create<T>(entityName))
      );
    return createSelector(this.selectEntityCache, getCollection);
  }

  /////// createCollectionSelectors //////////

  // Based on @ngrx/entity/state_selectors.ts

  /* eslint-disable @typescript-eslint/unified-signatures */
  // createCollectionSelectors(metadata) overload
  /**
   * Creates entity collection selectors from metadata.
   * @param metadata - EntityMetadata for the collection.
   * May be partial but much have `entityName`.
   */
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(metadata: EntityMetadata<T>): S;

  /* eslint-disable @typescript-eslint/unified-signatures */
  // createCollectionSelectors(entityName) overload
  /**
   * Creates default entity collection selectors for an entity type.
   * Use the metadata overload for additional collection selectors.
   * @param entityName - name of the entity type
   */
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(entityName: string): S;

  // createCollectionSelectors implementation
  createCollectionSelectors<
    T,
    S extends CollectionSelectors<T> = CollectionSelectors<T>
  >(metadataOrName: EntityMetadata<T> | string): S {
    const metadata =
      typeof metadataOrName === 'string'
        ? { entityName: metadataOrName }
        : metadataOrName;
    const selectKeys = (c: EntityCollection<T>) => c.ids;
    const selectEntityMap = (c: EntityCollection<T>) => c.entities;

    const selectEntities: Selector<
      EntityCollection<T>,
      T[]
    > = createSelector(
      selectKeys,
      selectEntityMap,
      (keys: (number | string)[], entities: Dictionary<T>): T[] =>
        keys.map((key) => entities[key] as T)
    );

    const selectCount: Selector<EntityCollection<T>, number> = createSelector(
      selectKeys,
      (keys) => keys.length
    );

    // EntityCollection selectors that go beyond the ngrx/entity/EntityState selectors
    const selectFilter = (c: EntityCollection<T>) => c.filter;

    const filterFn = metadata.filterFn;
    const selectFilteredEntities: Selector<EntityCollection<T>, T[]> = filterFn
      ? createSelector(
          selectEntities,
          selectFilter,
          (entities: T[], pattern: any): T[] => filterFn(entities, pattern)
        )
      : selectEntities;

    const selectLoaded = (c: EntityCollection<T>) => c.loaded;
    const selectLoading = (c: EntityCollection<T>) => c.loading;
    const selectChangeState = (c: EntityCollection<T>) => c.changeState;

    // Create collection selectors for each `additionalCollectionState` property.
    // These all extend from `selectCollection`
    const extra = metadata.additionalCollectionState || {};
    const extraSelectors: {
      [name: string]: Selector<EntityCollection<T>, any>;
    } = {};
    Object.keys(extra).forEach((k) => {
      extraSelectors['select' + k[0].toUpperCase() + k.slice(1)] = (
        c: EntityCollection<T>
      ) => (<any>c)[k];
    });

    return {
      selectCount,
      selectEntities,
      selectEntityMap,
      selectFilter,
      selectFilteredEntities,
      selectKeys,
      selectLoaded,
      selectLoading,
      selectChangeState,
      ...extraSelectors,
    } as S;
  }

  /////// create //////////

  // create(metadata) overload
  /**
   * Creates the store-rooted selectors for an entity collection.
   * {EntitySelectors$Factory} turns them into selectors$.
   *
   * @param metadata - EntityMetadata for the collection.
   * May be partial but much have `entityName`.
   *
   * Based on ngrx/entity/state_selectors.ts
   * Differs in that these selectors select from the NgRx store root,
   * through the collection, to the collection members.
   */
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    metadata: EntityMetadata<T>
  ): S;

  // create(entityName) overload
  /**
   * Creates the default store-rooted selectors for an entity collection.
   * {EntitySelectors$Factory} turns them into selectors$.
   * Use the metadata overload for additional collection selectors.
   *
   * @param entityName - name of the entity type.
   *
   * Based on ngrx/entity/state_selectors.ts
   * Differs in that these selectors select from the NgRx store root,
   * through the collection, to the collection members.
   */
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    // eslint-disable-next-line @typescript-eslint/unified-signatures
    entityName: string
  ): S;

  // createCollectionSelectors implementation
  create<T, S extends EntitySelectors<T> = EntitySelectors<T>>(
    metadataOrName: EntityMetadata<T> | string
  ): S {
    const metadata =
      typeof metadataOrName === 'string'
        ? { entityName: metadataOrName }
        : metadataOrName;
    const entityName = metadata.entityName;
    const selectCollection: Selector<
      Object,
      EntityCollection<T>
    > = this.createCollectionSelector<T>(entityName);
    const collectionSelectors = this.createCollectionSelectors<T>(metadata);

    const entitySelectors: {
      [name: string]: Selector<EntityCollection<T>, any>;
    } = {};
    Object.keys(collectionSelectors).forEach((k) => {
      entitySelectors[k] = createSelector(
        selectCollection,
        collectionSelectors[k]
      );
    });

    return {
      entityName,
      selectCollection,
      selectEntityCache: this.selectEntityCache,
      ...entitySelectors,
    } as S;
  }
}

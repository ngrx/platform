import { Inject, Injectable, Optional } from '@angular/core';
import { compose, MetaReducer } from '@ngrx/store';

import { EntityAction } from '../actions/entity-action';
import { EntityCollection } from './entity-collection';
import { ENTITY_COLLECTION_META_REDUCERS } from './constants';
import {
  EntityCollectionReducer,
  EntityCollectionReducerFactory,
} from './entity-collection-reducer';

/** A hash of EntityCollectionReducers */
export interface EntityCollectionReducers {
  [entity: string]: EntityCollectionReducer<any>;
}

/**
 * Registry of entity types and their previously-constructed reducers.
 * Can create a new CollectionReducer, which it registers for subsequent use.
 */
@Injectable()
export class EntityCollectionReducerRegistry {
  protected entityCollectionReducers: EntityCollectionReducers = {};
  private entityCollectionMetaReducer: MetaReducer<
    EntityCollection,
    EntityAction
  >;

  constructor(
    private entityCollectionReducerFactory: EntityCollectionReducerFactory,
    @Optional()
    @Inject(ENTITY_COLLECTION_META_REDUCERS)
    entityCollectionMetaReducers?: MetaReducer<EntityCollection, EntityAction>[]
  ) {
    // eslint-disable-next-line prefer-spread
    this.entityCollectionMetaReducer = compose.apply(
      null,
      entityCollectionMetaReducers || []
    ) as any;
  }

  /**
   * Get the registered EntityCollectionReducer<T> for this entity type or create one and register it.
   * @param entityName Name of the entity type for this reducer
   */
  getOrCreateReducer<T>(entityName: string): EntityCollectionReducer<T> {
    let reducer: EntityCollectionReducer<T> = this.entityCollectionReducers[
      entityName
    ];

    if (!reducer) {
      reducer = this.entityCollectionReducerFactory.create<T>(entityName);
      reducer = this.registerReducer<T>(entityName, reducer);
      this.entityCollectionReducers[entityName] = reducer;
    }
    return reducer;
  }

  /**
   * Register an EntityCollectionReducer for an entity type
   * @param entityName - the name of the entity type
   * @param reducer - reducer for that entity type
   *
   * Examples:
   *   registerReducer('Hero', myHeroReducer);
   *   registerReducer('Villain', myVillainReducer);
   */
  registerReducer<T>(
    entityName: string,
    reducer: EntityCollectionReducer<T>
  ): EntityCollectionReducer<T> {
    reducer = this.entityCollectionMetaReducer(reducer as any);
    return (this.entityCollectionReducers[entityName.trim()] = reducer);
  }

  /**
   * Register a batch of EntityCollectionReducers.
   * @param reducers - reducers to merge into existing reducers
   *
   * Examples:
   *   registerReducers({
   *     Hero: myHeroReducer,
   *     Villain: myVillainReducer
   *   });
   */
  registerReducers(reducers: EntityCollectionReducers) {
    const keys = reducers ? Object.keys(reducers) : [];
    keys.forEach((key) => this.registerReducer(key, reducers[key]));
  }
}

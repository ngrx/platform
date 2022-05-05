import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions } from '@ngrx/effects';
import { Dictionary } from '@ngrx/entity';

import { Observable } from 'rxjs';
import { filter, shareReplay } from 'rxjs/operators';

import { EntityAction } from '../actions/entity-action';
import { OP_ERROR } from '../actions/entity-op';
import { ofEntityType } from '../actions/entity-action-operators';
import {
  ENTITY_CACHE_SELECTOR_TOKEN,
  EntityCacheSelector,
} from './entity-cache-selector';
import { EntitySelectors } from './entity-selectors';
import { EntityCache } from '../reducers/entity-cache';
import {
  EntityCollection,
  ChangeStateMap,
} from '../reducers/entity-collection';

/**
 * The selector observable functions for entity collection members.
 */
export interface EntitySelectors$<T> {
  /** Name of the entity collection for these selectors$ */
  readonly entityName: string;

  /** Names from custom selectors from additionalCollectionState fits here, 'any' to avoid conflict with entityName */
  readonly [name: string]: Observable<any> | Store<any> | any;

  /** Observable of the collection as a whole */
  readonly collection$: Observable<EntityCollection> | Store<EntityCollection>;

  /** Observable of count of entities in the cached collection. */
  readonly count$: Observable<number> | Store<number>;

  /** Observable of all entities in the cached collection. */
  readonly entities$: Observable<T[]> | Store<T[]>;

  /** Observable of actions related to this entity type. */
  readonly entityActions$: Observable<EntityAction>;

  /** Observable of the map of entity keys to entities */
  readonly entityMap$: Observable<Dictionary<T>> | Store<Dictionary<T>>;

  /** Observable of error actions related to this entity type. */
  readonly errors$: Observable<EntityAction>;

  /** Observable of the filter pattern applied by the entity collection's filter function */
  readonly filter$: Observable<string> | Store<string>;

  /** Observable of entities in the cached collection that pass the filter function */
  readonly filteredEntities$: Observable<T[]> | Store<T[]>;

  /** Observable of the keys of the cached collection, in the collection's native sort order */
  readonly keys$: Observable<string[] | number[]> | Store<string[] | number[]>;

  /** Observable true when the collection has been loaded */
  readonly loaded$: Observable<boolean> | Store<boolean>;

  /** Observable true when a multi-entity query command is in progress. */
  readonly loading$: Observable<boolean> | Store<boolean>;

  /** ChangeState (including original values) of entities with unsaved changes */
  readonly changeState$:
    | Observable<ChangeStateMap<T>>
    | Store<ChangeStateMap<T>>;
}

/** Creates observable EntitySelectors$ for entity collections. */
@Injectable()
export class EntitySelectors$Factory {
  /** Observable of the EntityCache */
  entityCache$: Observable<EntityCache>;

  /** Observable of error EntityActions (e.g. QUERY_ALL_ERROR) for all entity types */
  entityActionErrors$: Observable<EntityAction>;

  constructor(
    private store: Store<any>,
    private actions: Actions<EntityAction>,
    @Inject(ENTITY_CACHE_SELECTOR_TOKEN)
    private selectEntityCache: EntityCacheSelector
  ) {
    // This service applies to the cache in ngrx/store named `cacheName`
    this.entityCache$ = this.store.select(this.selectEntityCache);
    this.entityActionErrors$ = actions.pipe(
      filter(
        (ea: EntityAction) =>
          ea.payload &&
          ea.payload.entityOp &&
          ea.payload.entityOp.endsWith(OP_ERROR)
      ),
      shareReplay(1)
    );
  }

  /**
   * Creates an entity collection's selectors$ observables for this factory's store.
   * `selectors$` are observable selectors of the cached entity collection.
   * @param entityName - is also the name of the collection.
   * @param selectors - selector functions for this collection.
   **/
  create<T, S$ extends EntitySelectors$<T> = EntitySelectors$<T>>(
    entityName: string,
    selectors: EntitySelectors<T>
  ): S$ {
    const selectors$: { [prop: string]: any } = {
      entityName,
    };

    Object.keys(selectors).forEach((name) => {
      if (name.startsWith('select')) {
        // strip 'select' prefix from the selector fn name and append `$`
        // Ex: 'selectEntities' => 'entities$'
        const name$ = name[6].toLowerCase() + name.substring(7) + '$';
        selectors$[name$] = this.store.select((<any>selectors)[name]);
      }
    });
    selectors$.entityActions$ = this.actions.pipe(ofEntityType(entityName));
    selectors$.errors$ = this.entityActionErrors$.pipe(
      ofEntityType(entityName)
    );
    return selectors$ as S$;
  }
}
